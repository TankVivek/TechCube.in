import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const API = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.origin);

const firebaseConfig = {
  apiKey: "AIzaSyAJhsnL_Vwwu4Qj8fZvO9RW9SD8O1tWbUk",
  authDomain: "techcube-99abf.firebaseapp.com",
  projectId: "techcube-99abf",
  storageBucket: "techcube-99abf.firebasestorage.app",
  messagingSenderId: "814216803952",
  appId: "1:814216803952:web:b6cd67c0d7283e67f0e6b5"
};

export default function SupportAdmin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'domains'
  const [tickets, setTickets] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selected, setSelected] = useState(null); // full ticket object
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const headers = (pass) => ({ 'x-admin-password': pass || password });

  const loadTickets = async (pass) => {
    try {
      const res = await axios.get(`${API}/api/support/tickets`, { 
        headers: headers(pass) 
      });
      if (res.data.success) setTickets(res.data.tickets);
    } catch { setError('Failed to load tickets'); }
  };

  const loadDomains = async (pass) => {
    try {
      const res = await axios.get(`${API}/api/admin/domains`, { 
        headers: headers(pass) 
      });
      if (res.data.success) setDomains(res.data.domains.data || []);
    } catch { setError('Failed to load domains'); }
  };

  const verifyDomain = async (id) => {
    setIsVerifying(true);
    try {
      await axios.post(`${API}/api/admin/domains/${id}/verify`, {}, { headers: headers() });
      loadDomains();
      const res = await axios.get(`${API}/api/admin/domains/${id}`, { headers: headers() });
      if (res.data.success) setSelectedDomain(res.data.domain);
    } catch { setError('Verification check failed'); }
    setIsVerifying(false);
  };

  const fetchDomainDetails = async (id) => {
    try {
      const res = await axios.get(`${API}/api/admin/domains/${id}`, { headers: headers() });
      if (res.data.success) setSelectedDomain(res.data.domain);
    } catch { setError('Failed to load domain details'); }
  };

  const setupNotifications = async (pass) => {
    console.log('FCM: Starting push notification setup...');
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('FCM: Push notifications not supported - No Service Worker capability in this browser.');
        return;
      }
      
      console.log('FCM: Registering Service Worker...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('FCM: Service Worker registered successfully.');

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      console.log('FCM: Requesting notification permissions...');
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('FCM: Notification permission granted.');
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          console.error('FCM: ERROR - VITE_FIREBASE_VAPID_KEY is missing in your .env file. Setup will fail.');
        }

        console.log('FCM: Generating device token...');
        const token = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: vapidKey || undefined
        });

        if (token) {
          console.log('FCM: Token generated:', token);
          const res = await axios.post(`${API}/api/support/admin/fcm-token`, { token }, { headers: headers(pass) });
          if (res.data.success) {
            console.log('FCM: Token registered on backend successfully.');
          }
        } else {
          console.warn('FCM: No token received from Firebase. Check your VAPID key and Firebase project settings.');
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('FCM: Foreground message received!', payload);
          // Show a browser notification manually
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/logo-square.png'
          });
        });

      } else {
        console.warn('FCM: Notification permission denied by user.');
      }
    } catch (err) {
      console.error('FCM: Setup failed with error:', err);
    }
  };

  const login = (e, manualPass) => {
    if (e) e.preventDefault();
    const passToUse = manualPass || password;
    if (!passToUse) return;

    setError('');
    // Disconnect old socket to prevent duplicate connection instances
    socketRef.current?.disconnect();

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    // Wait for connection before authenticating
    socket.on('connect', () => {
      socket.emit('admin_join', passToUse);
    });

    socket.on('connect_error', () => {
      setError('Could not connect to server. Please try again.');
    });

    socket.on('admin_authenticated', () => {
      setAuthed(true);
      setPassword(passToUse);
      setError('');
      loadTickets(passToUse);
      loadDomains(passToUse);
      setupNotifications(passToUse);
      
      // Save session for 24 hours
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('tc_admin_session', JSON.stringify({ password: passToUse, expiry }));
    });

    socket.on('auth_error', (msg) => {
      setError(msg);
      localStorage.removeItem('tc_admin_session');
    });

    // Listen for real-time updates
    socket.on('ticket_update', ({ ticketId, msg }) => {
      setSelected(prev => {
        if (prev && prev.id === ticketId) {
          // Prevent displaying duplicate messages in UI
          const exists = prev.messages.some(m => m.time === msg.time && m.text === msg.text && m.sender === msg.sender);
          if (exists) return prev;
          return { ...prev, messages: [...prev.messages, msg] };
        }
        return prev;
      });
      // Refresh ticket list
      loadTickets(passToUse);
    });
  };

  const logout = () => {
    localStorage.removeItem('tc_admin_session');
    socketRef.current?.disconnect();
    setAuthed(false);
    setPassword('');
    setTickets([]);
    setDomains([]);
    setSelected(null);
    setSelectedDomain(null);
  };

  const sendEmailInstructions = async () => {
    if (!emailInput.trim() || !selected) return;
    setEmailStatus('sending');
    try {
      const res = await axios.post(`${API}/api/support/ticket/${selected.id}/send-email-instructions`, { email: emailInput.trim() }, { headers: headers() });
      if (res.data.success) {
        setEmailStatus('Sent!');
        setTimeout(() => setEmailStatus(''), 3000);
      } else {
        setEmailStatus('Failed');
      }
    } catch {
      setEmailStatus('Error');
    }
  };

  const loadTicket = async (id) => {
    try {
      const res = await axios.get(`${API}/api/support/ticket/${id}`);
      if (res.data.success) {
        setSelected(res.data.ticket);
        setEmailInput(res.data.ticket.email);
        setEmailStatus('');
        socketRef.current?.emit('admin_join_ticket', id);
      }
    } catch { setError('Failed to load ticket'); }
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

  // ── Auto-login check ──
  useEffect(() => {
    const saved = localStorage.getItem('tc_admin_session');
    if (saved) {
      try {
        const { password: p, expiry } = JSON.parse(saved);
        if (new Date().getTime() < expiry) {
          login(null, p);
        } else {
          localStorage.removeItem('tc_admin_session');
        }
      } catch {
        localStorage.removeItem('tc_admin_session');
      }
    }
  }, []);

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

  const filteredTickets = tickets.filter(t => t.status !== 'closed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">Admin</h1>
            <button 
              onClick={logout}
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
            >
              Logout
            </button>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
            <button 
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-1.5 rounded transition ${activeTab === 'tickets' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
            >
              Tickets
            </button>
            <button 
              onClick={() => setActiveTab('domains')}
              className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-1.5 rounded transition ${activeTab === 'domains' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
            >
              Domains
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tickets' ? (
            <>
              {filteredTickets.map(t => (
                <button key={t.id} onClick={() => { setSelected(t); setSelectedDomain(null); loadTicket(t.id); }}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${selected?.id === t.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{t.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{t.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{t.email}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.messageCount} message(s) · #{t.id.slice(0,6)}</div>
                </button>
              ))}
              {filteredTickets.length === 0 && <p className="p-4 text-sm text-gray-400">No active tickets.</p>}
            </>
          ) : (
            <>
              {domains.map(d => (
                <button key={d.id} onClick={() => { setSelectedDomain(d); setSelected(null); fetchDomainDetails(d.id); }}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${selectedDomain?.id === d.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{d.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${d.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{d.status}</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{d.region} · {new Date(d.created_at).toLocaleDateString()}</div>
                </button>
              ))}
              {domains.length === 0 && <p className="p-4 text-sm text-gray-400">No domains added.</p>}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'tickets' ? (
          selected ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{selected.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{selected.email} · Ticket #{selected.id.slice(0,6)} · {selected.status}</div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <input 
                    type="email" 
                    value={emailInput} 
                    onChange={e => setEmailInput(e.target.value)} 
                    placeholder="Client Email" 
                    className="text-xs px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                  />
                  <button 
                    onClick={sendEmailInstructions} 
                    disabled={emailStatus === 'sending'} 
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition disabled:opacity-50"
                  >
                    {emailStatus === 'sending' ? 'Sending...' : emailStatus || 'Email Instructions'}
                  </button>
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
          )
        ) : (
          selectedDomain ? (
            <div className="p-8 overflow-y-auto">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedDomain.name}</h2>
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Domain Infrastructure</p>
                  </div>
                  <button 
                    onClick={() => verifyDomain(selectedDomain.id)}
                    disabled={isVerifying}
                    className="bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isVerifying ? 'Checking...' : 'Check Verification'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">DNS Configuration</h3>
                    <div className="space-y-4">
                      {selectedDomain.records?.map((record, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 font-mono text-[10px]">
                          <div className="flex gap-4 mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{record.type}</span>
                            <span className="text-slate-400">{record.name}</span>
                          </div>
                          <div className="break-all text-slate-600 dark:text-slate-400">{record.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400"><p>Select a domain to view configuration</p></div>
          )
        )}
      </div>
    </div>
  );
}
