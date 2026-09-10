import React from 'react';
import { 
  Headphones, 
  Plus, 
  Download, 
  RotateCcw, 
  Search, 
  Sun, 
  Moon, 
  Sparkles,
  LayoutDashboard,
  Globe,
  X,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ 
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  onOpenCreateModal, 
  onOpenCommandPalette, 
  onExportCSV, 
  onResetSeed, 
  isResetting,
  darkMode, 
  setDarkMode,
  ticketCount
}) {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-200 bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & View Mode Switcher */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/25 ring-2 ring-primary-400/20 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    OmniDesk
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/30">
                    CRM
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Datastraw Assessment
                </p>
              </div>
            </button>

            {/* Navigation View Switcher (Landing Page vs CRM App) */}
            <div className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold">
              <button
                onClick={() => setActiveView('landing')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeView === 'landing'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Showcase Landing</span>
              </button>
              <button
                onClick={() => setActiveView('app')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeView === 'app'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Live CRM App</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              </button>
            </div>
          </div>

          {/* Central Prominent Always-Visible Search Bar (When in App View) */}
          {activeView === 'app' && (
            <div className="flex-1 max-w-md hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-primary-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Instant Search (ID, customer, email, text)..."
                  className="w-full pl-9 pr-16 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                    <kbd className="text-[10px] font-semibold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500">
                      Ctrl K
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {activeView === 'landing' ? (
              <button
                onClick={() => setActiveView('app')}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-md shadow-primary-500/25 active:scale-95 transition-all"
              >
                <span>Open CRM Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Export CSV */}
                <button
                  onClick={onExportCSV}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Export filtered tickets to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                {/* Reset Demo Data */}
                <button
                  onClick={onResetSeed}
                  disabled={isResetting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-800/70 transition-colors disabled:opacity-50"
                  title="Reload / Reset Evaluator Demo Data"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Reset Demo Data</span>
                </button>

                {/* Dark / Light Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* New Ticket Button */}
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-md shadow-primary-500/25 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Ticket</span>
                  <kbd className="hidden xl:inline-block ml-1 text-[10px] bg-white/20 px-1 rounded font-normal">
                    N
                  </kbd>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
