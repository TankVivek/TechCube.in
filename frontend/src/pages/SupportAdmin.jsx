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
  appId: "1:814216803952:web:b6cd67c0d7283e67f0e6b5",
  measurementId: "G-PYE4J9VXSD"
};

export default function SupportAdmin() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authed, setAuthed] = useState(false);
  const [initializing, setInitializing] = useState(() => {
    const saved = localStorage.getItem('tc_admin_session');
    if (!saved) return false;
    try {
      const { expiry } = JSON.parse(saved);
      return new Date().getTime() < expiry;
    } catch {
      return false;
    }
  });
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
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [manualMeetLink, setManualMeetLink] = useState('');
  const [meetError, setMeetError] = useState('');
  const [meetLoading, setMeetLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox
  const [showMobileChat, setShowMobileChat] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const headers = (pass) => ({ 'x-admin-password': pass || password });

  const getActiveMeeting = () => {
    const meetRegex = /(https:\/\/(?:meet\.google\.com|meet\.jit\.si|zoom\.us|talky\.io)\/[a-z0-9_.-]+)/i;
    const lastMeetingMsg = [...(selected?.messages || [])].reverse().find(m => m.text && meetRegex.test(m.text));
    if (lastMeetingMsg) {
      return lastMeetingMsg.text.match(meetRegex)[1];
    }
    return null;
  };

  const activeMeeting = getActiveMeeting();

  const renderMessageText = (m) => {
    const meetRegex = /(https:\/\/(meet\.google\.com|meet\.jit\.si|zoom\.us|talky\.io)\/[a-z0-9_.-]+)/i;
    const match = m.text.match(meetRegex);
    if (match) {
      const meetUrl = match[1];
      const isJitsi = meetUrl.includes('jit.si');
      const isZoom = meetUrl.includes('zoom.us');
      const isTalky = meetUrl.includes('talky.io');
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
      } else if (isTalky) {
        theme = {
          bg: 'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
          border: 'border-pink-200/60 dark:border-pink-800/40',
          iconBg: 'bg-pink-100 dark:bg-pink-900/40',
          iconText: 'text-pink-600 dark:text-pink-400',
          title: 'Video Call',
          subtitle: 'Talky.io is ready',
          btn: 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
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

  const generateMeetLinkAutomatically = async () => {
    if (!selected) return;
    setMeetLoading(true);
    setMeetError('');
    try {
      const res = await axios.post(`${API}/api/support/ticket/${selected.id}/meet`, {}, { headers: headers() });
      if (res.data.success) {
        setShowMeetModal(false);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to auto-generate Meet link.';
      setMeetError(`${errMsg} Configure Google credentials in environment or use manual mode below.`);
    }
    setMeetLoading(false);
  };

  const generateJitsiLink = () => {
    if (!selected) return;
    const roomName = `TechCubeSupport_${selected.id.slice(0, 8)}_${Math.random().toString(36).substring(7)}`;
    const link = `https://meet.jit.si/${roomName}`;
    socketRef.current?.emit('admin_message', { 
      ticketId: selected.id, 
      text: `Please join the secure video support call: ${link}` 
    });
    setShowMeetModal(false);
  };

  const generateTalkyLink = () => {
    if (!selected) return;
    const roomName = `TechCubeSupport_${selected.id.slice(0, 8)}_${Math.random().toString(36).substring(7)}`;
    const link = `https://talky.io/${roomName}`;
    socketRef.current?.emit('admin_message', { 
      ticketId: selected.id, 
      text: `Please join the Talky video support call: ${link}` 
    });
    setShowMeetModal(false);
  };

  const submitManualMeetLink = (e) => {
    e.preventDefault();
    if (!manualMeetLink.trim() || !selected) return;
    
    const link = manualMeetLink.trim();
    const validDomains = ['meet.google.com', 'zoom.us', 'meet.jit.si', 'talky.io'];
    const isValid = validDomains.some(d => link.includes(d));

    if (!isValid) {
      setMeetError('Please enter a valid Google Meet, Zoom, Jitsi, or Talky link.');
      return;
    }

    socketRef.current?.emit('admin_message', { 
      ticketId: selected.id, 
      text: `Please join the video support call: ${link}` 
    });
    
    setManualMeetLink('');
    setShowMeetModal(false);
    setMeetError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selected) return;

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
          socketRef.current?.emit('admin_message', { 
            ticketId: selected.id, 
            text: '', 
            image: res.data.url 
          });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
    console.log('FCM: [1/7] Starting push notification setup sequence...');
    try {
      if (!('serviceWorker' in navigator)) {
        console.error('FCM: [ERROR] Push notifications not supported - No Service Worker capability in this browser.');
        return;
      }
      
      console.log('FCM: [2/7] Registering Service Worker from /firebase-messaging-sw.js...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('FCM: [3/7] Service Worker registered successfully:', registration.scope);

      console.log('FCM: [4/7] Initializing Firebase App...');
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      console.log('FCM: Firebase messaging initialized.');

      console.log('FCM: [5/7] Requesting notification permissions...');
      const permission = await Notification.requestPermission();
      console.log('FCM: Permission status:', permission);
      
      if (permission === 'granted') {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        console.log('FCM: [6/7] VAPID Key found:', vapidKey ? 'YES' : 'NO (Missing in .env)');
        
        if (!vapidKey) {
          console.error('FCM: [CRITICAL ERROR] VITE_FIREBASE_VAPID_KEY is missing in your .env file. Push notifications WILL NOT WORK without it.');
        }

        console.log('FCM: [7/7] Requesting FCM device token...');
        const token = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: vapidKey || undefined
        });

        if (token) {
          console.log('FCM: SUCCESS! Device token generated:', token);
          console.log('FCM: Registering token with backend...');
          const res = await axios.post(`${API}/api/support/admin/fcm-token`, { token }, { headers: headers(pass) });
          if (res.data.success) {
            console.log('FCM: Token registered on backend successfully. System ready.');
          } else {
            console.error('FCM: Backend rejected token registration:', res.data);
          }
        } else {
          console.warn('FCM: [WARNING] No token received from Firebase. Ensure VAPID key is correct and Firebase project is configured for web push.');
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('FCM: [FOREGROUND EVENT] Message received!', payload);
          new Notification(payload.notification?.title || 'New Support Message', {
            body: payload.notification?.body || 'Check the admin panel.',
            icon: '/logo-square.png'
          });
        });

      } else {
        console.warn('FCM: [BLOCKER] Notification permission denied by user. User must enable notifications in browser settings.');
      }
    } catch (err) {
      console.error('FCM: [FATAL ERROR] Setup failed at some step:', err);
    }
  };

  const login = (e, manualPass, manualUser) => {
    if (e) e.preventDefault();
    const passToUse = manualPass || password;
    const userToUse = manualUser || username;
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
      setInitializing(false);
    });

    socket.on('admin_authenticated', () => {
      setAuthed(true);
      setPassword(passToUse);
      setUsername(userToUse);
      setError('');
      loadTickets(passToUse);
      loadDomains(passToUse);
      setupNotifications(passToUse);
      setInitializing(false);
      
      // Save session for 24 hours
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('tc_admin_session', JSON.stringify({ username: userToUse, password: passToUse, expiry }));
    });

    socket.on('auth_error', (msg) => {
      setError(msg);
      localStorage.removeItem('tc_admin_session');
      setInitializing(false);
    });

    // Listen for real-time updates
    socket.on('ticket_update', ({ ticketId, msg }) => {
      setSelected(prev => {
        if (prev && prev.id === ticketId) {
          const messages = prev.messages || [];
          // Prevent displaying duplicate messages in UI
          const exists = messages.some(m => m.time === msg.time && m.text === msg.text && m.sender === msg.sender);
          if (exists) return prev;
          return { ...prev, messages: [...messages, msg] };
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
    setShowMobileChat(false);
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
        setShowMobileChat(true);
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
        const { username: u, password: p, expiry } = JSON.parse(saved);
        if (new Date().getTime() < expiry) {
          login(null, p, u);
        } else {
          localStorage.removeItem('tc_admin_session');
          setInitializing(false);
        }
      } catch {
        localStorage.removeItem('tc_admin_session');
        setInitializing(false);
      }
    } else {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  useEffect(() => { return () => socketRef.current?.disconnect(); }, []);

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 animate-in fade-in duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 animate-pulse">Reconnecting session...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Support Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your credentials to continue.</p>
          {error && <div className="text-red-500 text-sm mb-3 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition">Login</button>
        </form>
      </div>
    );
  }

  const filteredTickets = tickets.filter(t => t.status !== 'closed');

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      {/* Sidebar - Hidden on mobile if chat is open */}
      <div className={`${showMobileChat ? 'hidden sm:flex' : 'flex'} w-full sm:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col shrink-0`}>
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

      {/* Main Content - Shown on mobile if chat is open */}
      <div className={`${!showMobileChat && 'hidden sm:flex'} flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950`}>
        {activeTab === 'tickets' ? (
          selected ? (
            <>
              {/* Chat Header */}
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={() => setShowMobileChat(false)} className="sm:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" aria-label="Back to list">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <div className="truncate">
                    <div className="font-bold text-gray-900 dark:text-white truncate">{selected.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{selected.email} · #{selected.id?.slice(0,6)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                  <button 
                    onClick={() => sendEmailInstructions()} 
                    disabled={emailStatus === 'sending'} 
                    className="shrink-0 text-[10px] sm:text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition disabled:opacity-50"
                  >
                    {emailStatus === 'sending' ? 'Sending...' : emailStatus || 'Email Instructions'}
                  </button>

                  {selected.status === 'open' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => setShowMeetModal(true)} 
                        className="text-[10px] sm:text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-3 py-1.5 rounded-lg hover:opacity-80 transition font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Meeting
                      </button>
                      <button onClick={closeTicket} className="text-[10px] sm:text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg hover:opacity-80 transition font-bold uppercase tracking-wider">Close</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Meeting Banner */}
              {activeMeeting && (
                <div className="bg-teal-600 text-white px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs font-semibold shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span>Active Meeting: {activeMeeting}</span>
                  </div>
                  <a href={activeMeeting} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition">Join Call</a>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
                {selected.messages?.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : m.sender === 'user' ? 'items-start' : 'items-center'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm ${
                      m.sender === 'agent' ? 'bg-blue-600 text-white' :
                      m.sender === 'user' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700' :
                      'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs'
                    }`}>
                      {m.sender === 'user' && <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{selected.name}</div>}
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
                    <div className={`text-[10px] mt-1 px-1 ${m.sender === 'agent' ? 'text-blue-600/50' : 'text-gray-400'}`}>{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Reply Box */}
              {selected.status === 'open' && (
                <form onSubmit={sendReply} className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4 shrink-0">
                  <div className="flex items-end gap-2 max-w-5xl mx-auto">
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
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(e); } }}
                        placeholder="Type a reply..." 
                        className="flex-1 py-2 px-2 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none resize-none max-h-32" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!input.trim()}
                      className="w-10 h-10 sm:w-auto sm:px-6 bg-blue-600 text-white rounded-full sm:rounded-xl flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-500/20 shrink-0"
                    >
                      <span className="hidden sm:inline">Send Reply</span>
                      <svg className="sm:hidden w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">No ticket selected</h3>
                <p className="text-sm">Select a ticket from the sidebar to start chatting.</p>
              </div>
            </div>
          )
        ) : (
          selectedDomain ? (
            <div className="p-4 sm:p-8 overflow-y-auto flex-1">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6 sm:hidden">
                  <button onClick={() => setSelectedDomain(null)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Domain Details</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedDomain.name}</h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Domain Infrastructure</p>
                  </div>
                  <button 
                    onClick={() => verifyDomain(selectedDomain.id)}
                    disabled={isVerifying}
                    className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    {isVerifying ? 'Checking...' : 'Check Verification'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">DNS Configuration</h3>
                    <div className="space-y-4">
                      {selectedDomain.records?.map((record, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[10px]">
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
            <div className="flex-1 flex items-center justify-center text-gray-400 p-8 text-center">
              <div>
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">No domain selected</h3>
                <p className="text-sm">Select a domain from the sidebar to view configuration.</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Video Meeting Integration Modal */}
      {showMeetModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Video Meeting Tools</h3>
              </div>
              <button onClick={() => { setShowMeetModal(false); setMeetError(''); }} className="p-2 hover:bg-white/20 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {meetError && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 text-xs rounded-xl border border-orange-100 dark:border-orange-900/30">
                  {meetError}
                </div>
              )}

              {/* Jitsi Meet - Instant */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Instant Meeting (Jitsi)</h4>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Free & Unlimited</span>
                </div>
                <button
                  type="button"
                  onClick={generateJitsiLink}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Send Jitsi Meeting Link
                </button>
              </div>

              {/* Talky.io - Instant */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Instant Meeting (Talky)</h4>
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded">Free & Instant</span>
                </div>
                <button
                  type="button"
                  onClick={generateTalkyLink}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  Send Talky.io Meeting Link
                </button>
              </div>

              {/* Google Meet - Automatic */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Google Meet Integration</h4>
                <button
                  type="button"
                  onClick={generateMeetLinkAutomatically}
                  disabled={meetLoading}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {meetLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  )}
                  Auto-Generate Google Meet
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-widest">or manual share</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              </div>

              {/* Manual Link Input */}
              <form onSubmit={submitManualMeetLink} className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Paste Meeting URL (Zoom/Google/Jitsi)</h4>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={manualMeetLink}
                    onChange={e => setManualMeetLink(e.target.value)}
                    placeholder="https://zoom.us/j/123..."
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shadow-lg"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
