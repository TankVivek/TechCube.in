import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function SupportTicket() {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatEndRef = useRef(null);

  // Check URL hash for ticket ID
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) { setTicketId(hash); lookupTicket(hash); }
  }, []);

  const lookupTicket = async (id) => {
    const tid = (id || ticketId).trim();
    if (!tid) return;
    setLoading(true);
    setError('');
    setTicket(null);
    try {
      const res = await axios.get(`${API}/api/support/ticket/${tid}`);
      if (res.data.success) setTicket(res.data.ticket);
      else setError('Ticket not found.');
    } catch {
      setError('Ticket not found. Please check the ID and try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket]);

  const statusBadge = (s) => s === 'open'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline text-sm">&larr; Back to Home</a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Ticket</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your ticket ID to view the status and conversation.</p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <form onSubmit={(e) => { e.preventDefault(); lookupTicket(); }} className="flex gap-3">
            <input
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
              placeholder="Enter Ticket ID (e.g. a1b2c3d4e5f6)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap">
              {loading ? 'Loading...' : 'View Ticket'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
        </div>

        {/* Ticket Details */}
        {ticket && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Ticket Info Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{ticket.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {ticket.email} &middot; Ticket #{ticket.id.slice(0, 6)} &middot; {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(ticket.status)}`}>
                {ticket.status.toUpperCase()}
              </span>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-950">
              {ticket.messages.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No messages yet.</p>
              )}
              {ticket.messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : m.sender === 'agent' ? 'items-start' : 'items-center'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm ${
                    m.sender === 'user' ? 'bg-blue-600 text-white ml-auto' :
                    m.sender === 'agent' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700' :
                    'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs'
                  }`}>
                    {m.sender === 'agent' && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Support Agent</div>}
                    {m.sender === 'user' && <div className="text-xs font-semibold text-blue-200 mb-1">You</div>}
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

            {/* Footer note */}
            {ticket.status === 'open' && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💬 This ticket is still open. Use the chat widget on our homepage to continue the conversation in real-time.
                </p>
              </div>
            )}
            {ticket.status === 'closed' && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ✅ This ticket has been resolved. Need more help? Start a new chat from our homepage.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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
