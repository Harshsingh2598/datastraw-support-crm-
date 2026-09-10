import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function StatsGrid({ stats, activeStatus, onSelectStatus }) {
  const cards = [
    {
      id: 'All',
      title: 'Total Tickets',
      count: stats.total || 0,
      subtext: 'Across all channels',
      icon: Inbox,
      color: 'primary',
      bgGlow: 'from-primary-500/10 to-indigo-500/5',
      borderColor: activeStatus === 'All' ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-200 dark:border-slate-800'
    },
    {
      id: 'Open',
      title: 'Open Issues',
      count: stats.open || 0,
      subtext: stats.open > 0 ? 'Awaiting initial triage' : 'Inbox zero reached',
      icon: AlertTriangle,
      color: 'amber',
      badge: stats.urgent > 0 ? `${stats.urgent} Urgent` : null,
      bgGlow: 'from-amber-500/10 to-yellow-500/5',
      borderColor: activeStatus === 'Open' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800'
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      count: stats.inProgress || 0,
      subtext: 'Actively being investigated',
      icon: Clock,
      color: 'blue',
      bgGlow: 'from-blue-500/10 to-sky-500/5',
      borderColor: activeStatus === 'In Progress' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
    },
    {
      id: 'Closed',
      title: 'Resolved / Closed',
      count: stats.closed || 0,
      subtext: stats.total > 0 ? `${Math.round(((stats.closed || 0) / stats.total) * 100)}% resolution rate` : '100% resolved',
      icon: CheckCircle2,
      color: 'emerald',
      bgGlow: 'from-emerald-500/10 to-teal-500/5',
      borderColor: activeStatus === 'Closed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeStatus === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectStatus(card.id)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden group bg-white dark:bg-slate-900/70 hover:shadow-md hover:-translate-y-0.5 ${card.borderColor}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGlow} opacity-60 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {card.count}
                  </span>
                  {card.badge && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse">
                      <Flame className="w-3 h-3" />
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {card.subtext}
                </p>
              </div>

              <div className={`p-2.5 rounded-xl ${
                card.color === 'primary' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' :
                card.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' :
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            {/* Micro indicator */}
            <div className="relative z-10 mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
              <span>{isActive ? 'Active filter' : 'Filter by this'}</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
