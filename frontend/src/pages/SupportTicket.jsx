import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function SupportTicket() {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    const meetRegex = /(https:\/\/meet\.google\.com\/[a-z0-9-]+)/i;
    const match = m.text.match(meetRegex);
    if (match) {
      const meetUrl = match[1];
      const textWithoutUrl = m.text.replace(meetUrl, '').trim();
      return (
        <div className="space-y-2 my-1">
          {textWithoutUrl && <div className="text-sm leading-relaxed">{textWithoutUrl}</div>}
          <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 rounded-xl border border-teal-200/65 dark:border-teal-800/40 shadow-sm text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-teal-800 dark:text-teal-300 leading-none">Video Support Call</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Google Meet is ready</p>
              </div>
            </div>
            <a 
              href={meetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all focus:outline-none"
            >
              <span>Join Meeting</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div key={i} className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm whitespace-pre-wrap break-words ${
                  m.sender === 'user' ? 'bg-blue-600 text-white ml-auto' :
                  m.sender === 'agent' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700' :
                  'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 mx-auto text-center text-xs'
                }`}>
                  {m.sender === 'agent' && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Support Agent</div>}
                  {m.sender === 'user' && <div className="text-xs font-semibold text-blue-200 mb-0.5">You</div>}
                  {renderMessageText(m)}
                  <div className={`text-xs mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(m.time).toLocaleString()}
                  </div>
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
    </div>
  );
}
