import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, RotateCcw, Download, ArrowRight, X } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  tickets,
  onSelectTicket,
  onOpenCreateModal,
  onResetSeed,
  onExportCSV
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTickets = tickets.filter(t => 
    t.ticket_id.toLowerCase().includes(query.toLowerCase()) ||
    t.customer_name.toLowerCase().includes(query.toLowerCase()) ||
    t.subject.toLowerCase().includes(query.toLowerCase()) ||
    t.customer_email.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tickets, customer, or execute command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
            Esc
          </kbd>
        </div>

        {/* Action Commands */}
        <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick Actions
          </span>
          <div className="space-y-1 mt-1">
            <button
              onClick={() => { onClose(); onOpenCreateModal(); }}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary-500" />
                <span className="font-semibold">Create New Support Ticket</span>
              </div>
              <span className="text-[11px] text-slate-400">Press 'N'</span>
            </button>

            <button
              onClick={() => { onClose(); onExportCSV(); }}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold">Export Active Tickets to CSV</span>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onResetSeed(); }}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">Reload / Reset Evaluator Demo Data</span>
              </div>
            </button>
          </div>
        </div>

        {/* Ticket Search Results */}
        <div className="p-2 max-h-64 overflow-y-auto text-xs">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Tickets ({filteredTickets.length})
          </span>
          <div className="space-y-1 mt-1">
            {filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No matching tickets found
              </div>
            ) : (
              filteredTickets.map((t) => (
                <button
                  key={t.ticket_id}
                  onClick={() => {
                    onClose();
                    onSelectTicket(t.ticket_id);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                        {t.ticket_id}
                      </span>
                      <span className="font-semibold truncate text-slate-900 dark:text-white">
                        {t.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {t.customer_name} ({t.customer_email})
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
