import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Mail, 
  Clock, 
  Tag, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  Flame,
  Zap,
  Truck,
  RotateCcw
} from 'lucide-react';
import { formatTimeAgo, getSLAStatus } from '../utils/helpers';

export default function TicketDetailModal({
  ticketId,
  onClose,
  onTicketUpdated
}) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [authorName, setAuthorName] = useState('Support Agent');
  const [isInternal, setIsInternal] = useState(1);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Fetch ticket details
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) throw new Error('Failed to load ticket');
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (!ticket) return;
    try {
      const res = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTicket();
        onTicketUpdated();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Handle adding note
  const handleAddNote = async (e) => {
    if (e) e.preventDefault();
    if (!noteText.trim() || submittingNote) return;

    try {
      setSubmittingNote(true);
      const res = await fetch(`/api/tickets/${ticket.ticket_id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note_text: noteText.trim(),
          author_name: authorName.trim() || 'Support Agent',
          is_internal: isInternal
        })
      });

      if (res.ok) {
        setNoteText('');
        fetchTicket();
        onTicketUpdated();
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  // AI Copilot Reply Generator
  const handleGenerateAIReply = async () => {
    if (!ticket || generatingAI) return;
    try {
      setGeneratingAI(true);
      const res = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticket.ticket_id,
          customer_name: ticket.customer_name,
          customer_email: ticket.customer_email,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority
        })
      });
      const data = await res.json();
      if (data.suggestedReply) {
        setNoteText(data.suggestedReply);
        setIsInternal(0); // AI replies are meant for the customer
      }
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Canned Responses
  const applyCannedResponse = (type) => {
    const firstName = ticket?.customer_name?.split(' ')[0] || 'there';
    switch (type) {
      case 'delivery':
        setNoteText(`Hi ${firstName},\n\nThank you for following up regarding your delivery. I have reached out directly to our courier operations team to expedite your shipment. Your package is currently out for priority delivery and will arrive by tomorrow evening.\n\nTracking link: https://track.datastraw-logistics.io/${ticket?.ticket_id}\n\nPlease reply if you need any additional delivery instructions noted!`);
        setIsInternal(0);
        break;
      case 'info':
        setNoteText(`Hi ${firstName},\n\nCould you please provide additional details or a recent timestamp when you encountered this issue? This will help our team isolate the root cause in our server telemetry logs.\n\nThank you for your patience,\nSupport Team`);
        setIsInternal(0);
        break;
      case 'escalate':
        setNoteText(`[Escalation Notice]\nTicket escalated to Tier 3 Engineering on-call. Correlating gateway traces with edge error spikes. Standby for deployment hotfix.`);
        setIsInternal(1);
        break;
      case 'resolved':
        setNoteText(`Hi ${firstName},\n\nWe are pleased to confirm that this issue has now been resolved and verified across our systems. If everything looks good on your end, we will mark this ticket as closed.\n\nPlease don't hesitate to reach back out if you need further assistance!\n\nBest regards,\nCustomer Support`);
        setIsInternal(0);
        break;
      default:
        break;
    }
  };

  const copyCustomerEmail = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.customer_email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1500);
  };

  if (!ticketId) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl lg:max-w-3xl bg-white dark:bg-slate-900 h-screen max-h-screen shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Pinned Header Bar */}
        <div className="flex-shrink-0 p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80 px-2.5 py-1 rounded-lg border border-primary-200 dark:border-primary-800">
              {ticket?.ticket_id || ticketId}
            </span>
            {ticket && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-900' :
                ticket.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-900' :
                'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
              }`}>
                {ticket.priority} Priority
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {ticket && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs font-bold bg-transparent text-slate-900 dark:text-white rounded px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading ticket dossier...</div>
        ) : ticket ? (
          <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6 pb-24">
            
            {/* Subject Title */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {ticket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Created {new Date(ticket.created_at).toLocaleString()}</span>
                <span>•</span>
                <span>Category: <strong className="text-slate-700 dark:text-slate-300">{ticket.category}</strong></span>
              </div>
            </div>

            {/* Customer Dossier Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  {ticket.customer_name ? ticket.customer_name[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.customer_name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="w-3 h-3" />
                    <span>{ticket.customer_email}</span>
                    <button
                      onClick={copyCustomerEmail}
                      className="text-primary-500 hover:text-primary-600 ml-1"
                      title="Copy customer email"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SLA Status Widget */}
              {(() => {
                const sla = getSLAStatus(ticket);
                return (
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      SLA Target
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md mt-0.5 ${
                      sla.status === 'BREACHED' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-300 dark:border-red-800' :
                      sla.status === 'AT_RISK' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-300 dark:border-amber-800' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    }`}>
                      {sla.label} {sla.remaining ? `(${sla.remaining})` : ''}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Original Issue Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Customer Inquiry Description
              </h3>
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </div>
            </div>

            {/* Activity & Notes Timeline */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Activity & Communication Timeline ({ticket.notes ? ticket.notes.length : 0})
                </h3>
                <span className="text-[11px] text-slate-400">Chronological history</span>
              </div>

              {(!ticket.notes || ticket.notes.length === 0) ? (
                <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                  No notes recorded yet. Add an internal note or send a customer reply below.
                </div>
              ) : (
                <div className="space-y-3">
                  {ticket.notes.map((note) => {
                    const isInternalNote = note.is_internal === 1 || note.is_internal === true;
                    return (
                      <div
                        key={note.id}
                        className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                          isInternalNote
                            ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/60'
                            : 'bg-blue-50/70 dark:bg-blue-950/25 border-blue-200 dark:border-blue-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {note.author_name}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                              isInternalNote
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300'
                            }`}>
                              {isInternalNote ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                              {isInternalNote ? 'Internal Note' : 'Public Reply'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {formatTimeAgo(note.created_at)}
                          </span>
                        </div>
                        <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {note.note_text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Note / Reply Composer with AI Copilot & Canned Responses */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 space-y-3 shadow-sm">
              
              {/* Copilot & Canned responses quick bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Templates:
                  </span>
                  <button
                    type="button"
                    onClick={() => applyCannedResponse('delivery')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1"
                  >
                    <Truck className="w-3 h-3 text-blue-500" />
                    Delivery Status
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCannedResponse('info')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    Need Info
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCannedResponse('escalate')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    Escalate
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCannedResponse('resolved')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    Resolved
                  </button>
                </div>

                {/* AI Copilot Suggestion Button */}
                <button
                  type="button"
                  onClick={handleGenerateAIReply}
                  disabled={generatingAI}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/80 hover:bg-primary-100 dark:hover:bg-primary-900 border border-primary-300 dark:border-primary-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  title="Generate a context-aware customer resolution reply using AI"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-primary-500 ${generatingAI ? 'animate-spin' : ''}`} />
                  <span>{generatingAI ? 'AI Drafting Reply...' : '✨ AI Copilot Reply'}</span>
                </button>
              </div>

              {/* Note / Reply Type Selector */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInternal(1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                      isInternal === 1
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 shadow-sm border border-amber-300 dark:border-amber-700'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Internal Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternal(0)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                      isInternal === 0
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/80 dark:text-blue-200 shadow-sm border border-blue-300 dark:border-blue-700'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Public Reply
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Author:</span>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-1 focus:outline-none focus:border-primary-500"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      handleAddNote(e);
                    }
                  }}
                  rows={4}
                  placeholder={
                    isInternal === 1
                      ? 'Add private technical context, root-cause notes, or triage notes (Internal only)...'
                      : 'Draft a direct, helpful response to the customer...'
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 leading-relaxed shadow-inner"
                />
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">Ctrl + Enter</kbd> to send
                </span>
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || submittingNote}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-md shadow-primary-500/25 active:scale-95 transition-all disabled:opacity-50 ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingNote ? 'Saving...' : isInternal ? 'Save Internal Note' : 'Send Public Reply'}</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-red-500">Ticket not found</div>
        )}
      </div>
    </div>
  );
}
