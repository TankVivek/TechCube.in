import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.origin);

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  // step: 'form' (enter details) | 'chat' (active chat) | 'ended' (session ended summary)
  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentOnline, setAgentOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const [unread, setUnread] = useState(0);

  // ── Restore session from localStorage on mount ──
  useEffect(() => {
    const saved = localStorage.getItem('tc_support');
    if (!saved) return;
    try {
      const { ticketId: tid, name: n, email: e } = JSON.parse(saved);
      if (!tid) return;
      // Validate ticket still exists on server
      axios.get(`${API}/api/support/ticket/${tid}`).then(r => {
        if (r.data.success && r.data.ticket) {
          setTicketId(tid);
          setName(n);
          setEmail(e);
          setMessages(r.data.ticket.messages || []);
          setStep(r.data.ticket.status === 'closed' ? 'ended' : 'chat');
        } else {
          localStorage.removeItem('tc_support');
        }
      }).catch(() => {
        localStorage.removeItem('tc_support');
      });
    } catch {
      localStorage.removeItem('tc_support');
    }
  }, []);

  // ── Socket connection — only when widget is open, in chat, and ticketId exists ──
  useEffect(() => {
    if (!ticketId || !open || step !== 'chat') return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_ticket', ticketId);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => {
        const exists = prev.some(m => m.time === msg.time && m.text === msg.text && m.sender === msg.sender);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socket.on('agent_joined', () => setAgentOnline(true));

    socket.on('ticket_closed', () => {
      setMessages(prev => [...prev, { sender: 'system', text: 'This ticket has been closed. Thank you!', time: new Date().toISOString() }]);
      setStep('ended');
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [ticketId, open, step]);

  // ── Auto-scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Start a new chat session ──
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
        const t = await axios.get(`${API}/api/support/ticket/${tid}`);
        if (t.data.success) setMessages(t.data.ticket.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ── Send a message ──
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('user_message', { ticketId, text: input.trim() });
    setInput('');
  };

  // ── End the chat session (clears localStorage, resets to form) ──
  const endSession = useCallback(() => {
    localStorage.removeItem('tc_support');
    socketRef.current?.disconnect();
    socketRef.current = null;
    setTicketId(null);
    setMessages([]);
    setName('');
    setEmail('');
    setInput('');
    setAgentOnline(false);
    setConfirmEnd(false);
    setStep('form');
  }, []);

  // ── Toggle widget open/close — just minimizes, never destroys session ──
  const toggleWidget = () => {
    setOpen(prev => !prev);
    setUnread(0);
    setConfirmEnd(false); // reset confirmation if closing
  };

  // ── Start new chat from "ended" screen ──
  const startNewChat = () => {
    endSession();
  };

  // ── Back arrow: from chat → just close widget (session preserved) ──
  // ── From ended → go to form (session cleared) ──
  const handleBack = () => {
    if (step === 'ended') {
      endSession();
    } else if (step === 'chat') {
      setOpen(false); // just minimize, session stays
    }
  };

  const msgColor = (sender) => {
    if (sender === 'user') return 'bg-blue-600 text-white ml-auto';
    if (sender === 'agent') return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white';
    return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs';
  };

  const headerSubtext = () => {
    if (step === 'form') return 'Start a conversation';
    if (step === 'ended') return 'Session ended';
    return agentOnline ? 'Agent online' : 'Offline — ticket mode';
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="support-chat-toggle"
        onClick={toggleWidget}
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
            <div className="flex items-center gap-2">
              {/* Back arrow — show in chat and ended steps */}
              {step !== 'form' && (
                <button onClick={handleBack} className="p-1 hover:bg-white/20 rounded transition" aria-label="Back">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
              )}
              <div>
                <div className="font-semibold text-sm">TechCube Support</div>
                <div className="text-xs opacity-80">{headerSubtext()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* End Session button — only in active chat, with confirmation */}
              {step === 'chat' && !confirmEnd && (
                <button onClick={() => setConfirmEnd(true)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition">End</button>
              )}
            </div>
          </div>

          {/* End session confirmation bar */}
          {confirmEnd && step === 'chat' && (
            <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-red-700 dark:text-red-300">End this chat session?</span>
              <div className="flex gap-2">
                <button onClick={endSession} className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Yes, end</button>
                <button onClick={() => setConfirmEnd(false)} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:opacity-80 transition">Cancel</button>
              </div>
            </div>
          )}

          {/* ── Step: Form ── */}
          {step === 'form' && (
            <form onSubmit={startChat} className="p-4 space-y-3 flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">Enter your details to start chatting with us.</p>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="your@email.com" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Connecting...' : 'Start Chat'}
              </button>
            </form>
          )}

          {/* ── Step: Active Chat ── */}
          {step === 'chat' && (
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

          {/* ── Step: Session Ended ── */}
          {step === 'ended' && (
            <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Session ended</p>
              {ticketId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Ticket ID: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{ticketId}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                You can view your ticket at <a href={`/support-ticket#${ticketId || ''}`} className="text-blue-600 dark:text-blue-400 underline">/support-ticket</a>
              </p>
              <button onClick={startNewChat} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                Start New Chat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
