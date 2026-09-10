import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  totalResults
}) {
  const statuses = [
    { id: 'All', label: 'All Tickets' },
    { id: 'Open', label: 'Open' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Closed', label: 'Closed' }
  ];

  const priorities = ['All', 'Urgent', 'High', 'Medium', 'Low'];
  const categories = ['All', 'Technical', 'Billing', 'Feature Request', 'Account', 'General'];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-md mb-6 space-y-3 transition-all">
      {/* Top row: Prominent Glowing Search & Status Segment Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Prominent High-Visibility Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, name, email, subject, or message..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
          />

          {/* Action buttons inside search */}
          <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-300 dark:border-primary-800">
              Live Filter
            </span>
          </div>
        </div>

        {/* Status Filter Segment Pills */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto border border-slate-200 dark:border-slate-700/60">
          {statuses.map((s) => {
            const isActive = statusFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Refinements & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Priority dropdown */}
          <div className="flex items-center gap-1">
            <label className="text-slate-500 dark:text-slate-400">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Priorities' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Category dropdown */}
          <div className="flex items-center gap-1">
            <label className="text-slate-500 dark:text-slate-400">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-bold ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-extrabold text-slate-900 dark:text-white px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{totalResults}</span> {totalResults === 1 ? 'ticket' : 'tickets'}
        </div>
      </div>
    </div>
  );
}
