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
  const [selectedImage, setSelectedImage] = useState(null); // For lightbox

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
      if (!open) setUnread(prev => prev + 1);
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
  const sendMessage = (e, imgUrl = null) => {
    if (e) e.preventDefault();
    if (!input.trim() && !imgUrl) return;
    if (!socketRef.current) return;
    socketRef.current.emit('user_message', { ticketId, text: input.trim(), image: imgUrl });
    setInput('');
  };

  // ── Handle Image Upload ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        const res = await axios.post(`${API}/api/support/upload`, { image: base64 });
        if (res.data.success) {
          sendMessage(null, res.data.url);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Image upload failed. Please try again.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
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

  const getActiveMeeting = () => {
    const meetRegex = /(https:\/\/(?:meet\.google\.com|meet\.jit\.si|zoom\.us)\/[a-z0-9.-]+)/i;
    const lastMeetingMsg = [...messages].reverse().find(m => meetRegex.test(m.text));
    if (lastMeetingMsg) {
      return lastMeetingMsg.text.match(meetRegex)[1];
    }
    return null;
  };

  const activeMeeting = getActiveMeeting();

  const msgColor = (sender) => {
    if (sender === 'user') return 'bg-blue-600 text-white ml-auto';
    if (sender === 'agent') return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700';
    return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs';
  };

  const renderMessageText = (m) => {
    const meetRegex = /(https:\/\/(meet\.google\.com|meet\.jit\.si|zoom\.us)\/[a-z0-9.-]+)/i;
    const match = m.text.match(meetRegex);
    if (match) {
      const meetUrl = match[1];
      const isJitsi = meetUrl.includes('jit.si');
      const isZoom = meetUrl.includes('zoom.us');
      const textWithoutUrl = m.text.replace(meetUrl, '').trim();
      
      let theme = {
        bg: 'from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20',
        border: 'border-teal-200/60 dark:border-teal-800/40',
        iconBg: 'bg-teal-100 dark:bg-teal-900/40',
        iconText: 'text-teal-600 dark:text-teal-400',
        title: 'Video Support Call',
        subtitle: 'Google Meet is ready',
        btn: 'from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
      };

      if (isJitsi) {
        theme = {
          bg: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
          border: 'border-purple-200/60 dark:border-purple-800/40',
          iconBg: 'bg-purple-100 dark:bg-purple-900/40',
          iconText: 'text-purple-600 dark:text-purple-400',
          title: 'Secure Video Call',
          subtitle: 'Jitsi Meet is ready',
          btn: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        };
      } else if (isZoom) {
        theme = {
          bg: 'from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20',
          border: 'border-blue-200/60 dark:border-blue-800/40',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40',
          iconText: 'text-blue-600 dark:text-blue-400',
          title: 'Zoom Meeting',
          subtitle: 'Zoom is ready',
          btn: 'from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700'
        };
      }

      return (
        <div className="space-y-2 my-1">
          {textWithoutUrl && <div className="text-sm leading-relaxed">{textWithoutUrl}</div>}
          <div className={`p-3 bg-gradient-to-br ${theme.bg} rounded-xl border ${theme.border} shadow-sm text-left`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.iconText} shrink-0`}>
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className={`font-semibold text-xs ${theme.iconText.replace('text-', 'text-').replace('400', '300')} leading-none`}>{theme.title}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{theme.subtitle}</p>
              </div>
            </div>
            <a 
              href={meetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center w-full px-3 py-1.5 bg-gradient-to-r ${theme.btn} text-white rounded-lg text-xs font-semibold shadow-sm transition-all focus:outline-none`}
            >
              <span>Join Meeting</span>
              <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      );
    }
    return m.text;
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
        <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[9999] w-full h-full sm:w-96 sm:h-[600px] sm:max-h-[85vh] bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl border-t sm:border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-4 sm:py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 sm:gap-2">
              {/* Back arrow — show in chat and ended steps */}
              {step !== 'form' ? (
                <button onClick={handleBack} className="p-1.5 hover:bg-white/20 rounded-lg transition" aria-label="Back">
                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                </div>
              )}
              <div>
                <div className="font-bold sm:font-semibold text-base sm:text-sm">TechCube Support</div>
                <div className="text-[11px] sm:text-xs opacity-80">{headerSubtext()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* End Session button — only in active chat */}
              {step === 'chat' && !confirmEnd && (
                <button onClick={() => setConfirmEnd(true)} className="text-[10px] uppercase font-bold tracking-wider bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition">End Session</button>
              )}
              {/* Minimize button for mobile/desktop */}
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition" aria-label="Minimize">
                <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          </div>

          {/* End session confirmation bar */}
          {confirmEnd && step === 'chat' && (
            <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 flex items-center justify-between shrink-0">
              <span className="text-xs font-medium text-red-700 dark:text-red-300 text-[11px] sm:text-xs">End this chat session?</span>
              <div className="flex gap-2">
                <button onClick={endSession} className="text-[10px] sm:text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition font-bold uppercase tracking-wider">End</button>
                <button onClick={() => setConfirmEnd(false)} className="text-[10px] sm:text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:opacity-80 transition font-bold uppercase tracking-wider">Cancel</button>
              </div>
            </div>
          )}

          {/* Active Meeting Banner */}
          {step === 'chat' && activeMeeting && (
            <a 
              href={activeMeeting}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-600 text-white px-4 py-2 flex items-center justify-between text-[11px] sm:text-xs font-semibold hover:bg-teal-700 transition shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span>Meeting in progress — Click to join call</span>
              </div>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          )}

          {/* ── Step: Form ── */}
          {step === 'form' && (
            <form onSubmit={startChat} className="p-6 sm:p-4 space-y-4 sm:space-y-3 flex-1 overflow-y-auto">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863)0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">How can we help?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Our team is ready to assist you.</p>
              </div>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="w-full px-4 py-2.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="your@email.com" className="w-full px-4 py-2.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 sm:py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-blue-500/20">
                {loading ? 'Connecting...' : 'Start Conversation'}
              </button>
            </form>
          )}

          {/* ── Step: Active Chat ── */}
          {step === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50 min-h-0">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : m.sender === 'agent' ? 'items-start' : 'items-center'}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${msgColor(m.sender)} whitespace-pre-wrap break-words shadow-sm`}>
                      {m.sender === 'agent' && <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Support Agent</div>}
                      {m.image && (
                        <img 
                          src={m.image.startsWith('http') ? m.image : `${API}${m.image}`} 
                          alt="Upload" 
                          className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90 transition" 
                          onClick={() => setSelectedImage(m.image.startsWith('http') ? m.image : `${API}${m.image}`)}
                        />
                      )}
                      {m.text && renderMessageText(m)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 px-1">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-end gap-2 shrink-0">
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-end p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                  {/* Image Upload Button */}
                  <label className="p-2 text-gray-500 hover:text-blue-600 cursor-pointer transition shrink-0">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </label>
                  <textarea 
                    rows="1"
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                    placeholder="Type a message..." 
                    className="flex-1 py-2 px-2 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none resize-none max-h-32" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 shrink-0 shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </form>
            </>
          )}

          {/* ── Step: Session Ended ── */}
          {step === 'ended' && (
            <div className="p-8 text-center flex-1 flex flex-col items-center justify-center overflow-y-auto">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chat session ended</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Thank you for contacting TechCube Support. We hope we were able to help!</p>
              
              {ticketId && (
                <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 text-left border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Reference Details</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Ticket ID</span>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">#{ticketId}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    You can track progress or view history at <a href={`/support-ticket#${ticketId}`} className="text-blue-600 hover:underline font-semibold">techcube.in/support-ticket</a>
                  </p>
                </div>
              )}
              
              <button onClick={startNewChat} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition shadow-lg">
                Start New Chat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
