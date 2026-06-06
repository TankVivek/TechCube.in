import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.origin);

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('form'); // form | chat
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentOnline, setAgentOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const [unread, setUnread] = useState(0);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tc_support');
    if (saved) {
      const { ticketId: tid, name: n, email: e } = JSON.parse(saved);
      setTicketId(tid);
      setName(n);
      setEmail(e);
      setStep('chat');
      // Load existing messages
      axios.get(`${API}/api/support/ticket/${tid}`).then(r => {
        if (r.data.success) setMessages(r.data.ticket.messages || []);
      }).catch(() => {});
    }
  }, []);

  // Socket connection — only when widget is open and ticketId exists
  useEffect(() => {
    if (!ticketId || !open) return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_ticket', ticketId);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('agent_joined', () => setAgentOnline(true));
    socket.on('ticket_closed', () => {
      setMessages(prev => [...prev, { sender: 'system', text: 'This ticket has been closed. Thank you!', time: new Date().toISOString() }]);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [ticketId, open]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/support/initiate`, { name, email });
      if (res.data.success) {
        const tid = res.data.ticket.id;
        setTicketId(tid);
        setAgentOnline(res.data.agentOnline);
        localStorage.setItem('tc_support', JSON.stringify({ ticketId: tid, name, email }));
        setStep('chat');
        // Load messages (includes system message if no agent)
        const t = await axios.get(`${API}/api/support/ticket/${tid}`);
        if (t.data.success) setMessages(t.data.ticket.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('user_message', { ticketId, text: input.trim() });
    setInput('');
  };

  const endChat = () => {
    localStorage.removeItem('tc_support');
    socketRef.current?.disconnect();
    setStep('form');
    setTicketId(null);
    setMessages([]);
    setName('');
    setEmail('');
    setOpen(false);
  };

  const msgColor = (sender) => {
    if (sender === 'user') return 'bg-blue-600 text-white ml-auto';
    if (sender === 'agent') return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white';
    return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs';
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="support-chat-toggle"
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
        aria-label="Open support chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unread}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden" style={{ maxHeight: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">TechCube Support</div>
              <div className="text-xs opacity-80">{step === 'chat' ? (agentOnline ? '🟢 Agent online' : '🔴 Offline — ticket mode') : 'Start a conversation'}</div>
            </div>
            {step === 'chat' && (
              <button onClick={endChat} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition">End</button>
            )}
          </div>

          {step === 'form' ? (
            /* ── Ticket Form ── */
            <form onSubmit={startChat} className="p-4 space-y-3 flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">Enter your details to start chatting with us.</p>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="your@email.com" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Connecting...' : 'Start Chat'}
              </button>
            </form>
          ) : (
            /* ── Chat Area ── */
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: '280px', maxHeight: '360px' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msgColor(m.sender)} whitespace-pre-wrap break-words`}>
                    {m.sender === 'agent' && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Support Agent</div>}
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex border-t border-gray-200 dark:border-gray-700">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none" />
                <button type="submit" className="px-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition">Send</button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
