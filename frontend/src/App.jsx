import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StatsGrid from './components/StatsGrid';
import FilterBar from './components/FilterBar';
import TicketList from './components/TicketList';
import TicketDetailModal from './components/TicketDetailModal';
import CreateTicketModal from './components/CreateTicketModal';
import CommandPalette from './components/CommandPalette';
import { exportToCSV } from './utils/helpers';
import { CheckCircle2, AlertCircle, Sparkles, Globe, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' (Showcase) or 'app' (Live CRM)
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals & UI state
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync Dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch Tickets
  const fetchTickets = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (priorityFilter && priorityFilter !== 'All') params.append('priority', priorityFilter);
      if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
      if (searchQuery && searchQuery.trim() !== '') params.append('search', searchQuery.trim());

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading tickets from backend', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, categoryFilter, searchQuery]);

  // Fetch KPI Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Quick inline status change
  const handleQuickStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Ticket ${ticketId} updated to ${newStatus}`);
        fetchTickets();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update ticket status', 'error');
    }
  };

  // Reset / Seed Demo Data
  const handleResetSeed = async () => {
    try {
      setIsResetting(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        showToast('Demo support tickets reloaded successfully!');
        fetchTickets();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to reload demo dataset', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (tickets.length === 0) {
      showToast('No tickets to export in current view', 'info');
      return;
    }
    exportToCSV(tickets);
    showToast(`Exported ${tickets.length} tickets to CSV`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // 'N' for new ticket (when not typing in an input/textarea)
      if (e.key.toLowerCase() === 'n' && !isCreateModalOpen && !isCommandPaletteOpen && !selectedTicketId) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          setIsCreateModalOpen(true);
        }
      }
      // Escape closes modals
      if (e.key === 'Escape') {
        setIsCreateModalOpen(false);
        setIsCommandPaletteOpen(false);
        setSelectedTicketId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen, isCommandPaletteOpen, selectedTicketId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === 'error'
              ? 'bg-red-500 text-white border-red-600'
              : toast.type === 'info'
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-700 dark:border-slate-200'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onExportCSV={handleExportCSV}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        ticketCount={tickets.length}
      />

      {/* Conditional View: Interactive Landing Page or CRM App */}
      {activeView === 'landing' ? (
        <LandingPage
          onLaunchApp={() => setActiveView('app')}
          onOpenDemoTicket={(id) => {
            setActiveView('app');
            setSelectedTicketId(id);
          }}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Executive Metrics Grid */}
          <StatsGrid
            stats={stats}
            activeStatus={statusFilter}
            onSelectStatus={(status) => setStatusFilter(status)}
          />

          {/* Sticky High-Visibility Live Filter & Search Bar */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            totalResults={tickets.length}
          />

          {/* Support Tickets Dossier List */}
          <TicketList
            tickets={tickets}
            loading={loading}
            onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
            onQuickStatusChange={handleQuickStatusChange}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </main>
      )}

      {/* Slide-over Ticket Detail Drawer */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onTicketUpdated={() => {
            fetchTickets();
            fetchStats();
          }}
        />
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={(newTicket) => {
          showToast(`Ticket ${newTicket.ticket_id} created successfully!`);
          fetchTickets();
          fetchStats();
          setSelectedTicketId(newTicket.ticket_id);
        }}
      />

      {/* Quick Jump Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tickets={tickets}
        onSelectTicket={(ticketId) => setSelectedTicketId(ticketId)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onResetSeed={handleResetSeed}
        onExportCSV={handleExportCSV}
      />

    </div>
  );
}
