import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  Copy, 
  Check,
  User,
  Inbox
} from 'lucide-react';
import { formatTimeAgo, getSLAStatus } from '../utils/helpers';

export default function TicketList({
  tickets,
  loading,
  onSelectTicket,
  onQuickStatusChange,
  onOpenCreateModal
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopyId = (e, ticketId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse">
            <Flame className="w-3 h-3" />
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500'
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
          dot: 'bg-blue-500'
        };
      case 'Closed':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400'
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          No support tickets found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          No tickets matched your current search and filter criteria. Try adjusting filters or create a new support ticket.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg shadow transition-colors"
        >
          <span>Create New Ticket</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {tickets.map((ticket) => {
          const sla = getSLAStatus(ticket);
          const statusStyle = getStatusBadge(ticket.status);
          const initials = ticket.customer_name
            ? ticket.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : 'U';

          return (
            <div
              key={ticket.ticket_id}
              onClick={() => onSelectTicket(ticket.ticket_id)}
              className="p-4 sm:px-6 hover:bg-slate-50/90 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Column: ID, Customer, Subject */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Avatar with initials */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {initials}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Ticket ID with quick copy */}
                    <button
                      onClick={(e) => handleCopyId(e, ticket.ticket_id)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900 px-2 py-0.5 rounded border border-primary-200 dark:border-primary-800/80 transition-colors"
                      title="Click to copy Ticket ID"
                    >
                      {ticket.ticket_id}
                      {copiedId === ticket.ticket_id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-primary-400 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>

                    {/* Priority Badge */}
                    {getPriorityBadge(ticket.priority)}

                    {/* Category Tag */}
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {ticket.category || 'Technical'}
                    </span>

                    {/* SLA Status Flag */}
                    {sla.status === 'BREACHED' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                        {sla.remaining}
                      </span>
                    )}
                  </div>

                  {/* Ticket Subject / Title */}
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {ticket.subject}
                  </h4>

                  {/* Customer Name & Email snippet */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {ticket.customer_name}
                    </span>
                    <span>•</span>
                    <span className="truncate">{ticket.customer_email}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Status Selector, Date, Notes & Arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                
                {/* Inline Status Dropdown */}
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={ticket.status}
                    onChange={(e) => onQuickStatusChange(ticket.ticket_id, e.target.value)}
                    className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors ${statusStyle.bg}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Notes count indicator */}
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium" title={`${ticket.notes_count || 0} notes on ticket`}>
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{ticket.notes_count || 0}</span>
                </div>

                {/* Relative timestamp */}
                <div className="flex items-center gap-1 text-xs text-slate-400 min-w-[70px] justify-end" title={new Date(ticket.created_at).toLocaleString()}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimeAgo(ticket.created_at)}</span>
                </div>

                {/* Open drawer chevron */}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all hidden sm:block" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
