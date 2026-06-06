import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.origin);

export default function SupportAdmin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null); // full ticket object
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const headers = () => ({ 'x-admin-password': password });

  const loadTickets = async () => {
    try {
      const res = await axios.get(`${API}/api/support/tickets`, { headers: headers() });
      if (res.data.success) setTickets(res.data.tickets);
    } catch { setError('Failed to load tickets'); }
  };

  const loadTicket = async (id) => {
    try {
      const res = await axios.get(`${API}/api/support/ticket/${id}`);
      if (res.data.success) {
        setSelected(res.data.ticket);
        socketRef.current?.emit('admin_join_ticket', id);
      }
    } catch { setError('Failed to load ticket'); }
  };

  const login = (e) => {
    e.preventDefault();
    setError('');
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    // Wait for connection before authenticating
    socket.on('connect', () => {
      socket.emit('admin_join', password);
    });

    socket.on('connect_error', () => {
      setError('Could not connect to server. Please try again.');
    });

    socket.on('admin_authenticated', () => {
      setAuthed(true);
      setError('');
      loadTickets();
    });
    socket.on('auth_error', (msg) => setError(msg));

    // Listen for real-time updates
    socket.on('ticket_update', ({ ticketId, msg }) => {
      setSelected(prev => {
        if (prev && prev.id === ticketId) return { ...prev, messages: [...prev.messages, msg] };
        return prev;
      });
      // Refresh ticket list
      loadTickets();
    });
  };

  const sendReply = (e) => {
    e.preventDefault();
    if (!input.trim() || !selected) return;
    socketRef.current?.emit('admin_message', { ticketId: selected.id, text: input.trim() });
    setInput('');
  };

  const closeTicket = async () => {
    if (!selected) return;
    await axios.post(`${API}/api/support/ticket/${selected.id}/close`, {}, { headers: headers() });
    setSelected({ ...selected, status: 'closed' });
    loadTickets();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  useEffect(() => { return () => socketRef.current?.disconnect(); }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Support Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the admin password to continue.</p>
          {error && <div className="text-red-500 text-sm mb-3 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar - Ticket List */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tickets.length} ticket(s)</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.map(t => (
            <button key={t.id} onClick={() => loadTicket(t.id)}
              className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${selected?.id === t.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{t.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{t.status}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{t.email}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.messageCount} message(s) · #{t.id.slice(0,6)}</div>
            </button>
          ))}
          {tickets.length === 0 && <p className="p-4 text-sm text-gray-400">No tickets yet.</p>}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{selected.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{selected.email} · Ticket #{selected.id.slice(0,6)} · {selected.status}</div>
              </div>
              {selected.status === 'open' && (
                <button onClick={closeTicket} className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg hover:opacity-80 transition font-medium">Close Ticket</button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 dark:bg-gray-950">
              {selected.messages.map((m, i) => (
                <div key={i} className={`max-w-[70%] px-4 py-2.5 rounded-xl text-sm whitespace-pre-wrap break-words ${
                  m.sender === 'agent' ? 'bg-blue-600 text-white ml-auto' :
                  m.sender === 'user' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700' :
                  'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs'
                }`}>
                  {m.sender === 'user' && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">{selected.name}</div>}
                  {m.text}
                  <div className={`text-xs mt-1 ${m.sender === 'agent' ? 'text-blue-200' : 'text-gray-400'}`}>{new Date(m.time).toLocaleTimeString()}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Reply Box */}
            {selected.status === 'open' && (
              <form onSubmit={sendReply} className="flex border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a reply..." className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Send</button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <p className="text-sm">Select a ticket to start replying</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
