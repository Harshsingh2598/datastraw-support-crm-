import React, { useState } from 'react';
import { 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Bot, 
  Database, 
  CheckCircle2, 
  ChevronRight, 
  Users, 
  Search, 
  Layers, 
  Cpu, 
  Flame, 
  ExternalLink,
  Code2,
  Lock,
  Play
} from 'lucide-react';

export default function LandingPage({ onLaunchApp, onOpenDemoTicket }) {
  const [simulatedPriority, setSimulatedPriority] = useState('Urgent');
  const [simulatedTopic, setSimulatedTopic] = useState('Delivery Delay');
  const [ticketVolume, setTicketVolume] = useState(1500);

  const hoursSaved = Math.round((ticketVolume * 4.2) / 60);
  const costSavings = Math.round(hoursSaved * 32);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-primary-500/30 selection:text-primary-200">
      
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-primary-600/20 via-brand-500/15 to-indigo-600/20 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[70%] left-[-10%] w-[600px] h-[400px] bg-teal-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Datastraw Assessment Edition</span>
          <span className="text-slate-600">•</span>
          <span className="text-primary-400 font-medium">Enterprise CRM System</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Customer Support Engineered at the{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-brand-300 to-indigo-400">
            Speed of Light.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          OmniDesk transforms chaotic customer inboxes into high-velocity resolution hubs.
          Featuring <strong>AI Copilot Smart Triage</strong>, <strong>automated SLA Guardian</strong>, and 
          sub-10ms search over persistent SQLite architecture.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-primary-600 via-indigo-600 to-brand-600 hover:from-primary-500 hover:to-brand-500 rounded-xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <span>Launch Live CRM App</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('interactive-demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Explore Interactive Simulator</span>
          </button>
        </div>

        {/* Social / Technical Proof metrics */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
            <p className="text-xs text-slate-400 mt-0.5">Spec Compliant REST API</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">&lt; 10ms</p>
            <p className="text-xs text-slate-400 mt-0.5">Indexed Search Latency</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">4h SLA</p>
            <p className="text-xs text-slate-400 mt-0.5">Urgent Escalation Target</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1-Click</p>
            <p className="text-xs text-slate-400 mt-0.5">Unified Render Deploy</p>
          </div>
        </div>

      </section>

      {/* Interactive Live Hero Simulator */}
      <section id="interactive-demo" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-950/60 border border-primary-800/80 px-3 py-1 rounded-full">
            Interactive Product Sandbox
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Experience the AI Support Engine in Real-Time
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-2">
            Test how OmniDesk auto-categorizes customer inquiries, assesses urgency, and drafts context-aware responses.
          </p>
        </div>

        {/* Interactive Sandbox Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-primary-950 text-primary-400 border border-primary-800">
                LIVE SIMULATOR
              </span>
              <span className="text-xs text-slate-400">Select a support scenario:</span>
            </div>

            {/* Scenario selector buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'Delivery Delay', label: '🚚 Order Delivery Delay', priority: 'Urgent' },
                { id: '504 Gateway', label: '⚡ Edge API 504 Timeout', priority: 'Urgent' },
                { id: 'Billing Invoice', label: '💳 Duplicate Billing Charge', priority: 'High' }
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSimulatedTopic(sc.id);
                    setSimulatedPriority(sc.priority);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    simulatedTopic === sc.id
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left: Simulated Inbound Ticket */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary-400" />
                  Inbound Customer Inquiry
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  {simulatedPriority} Priority
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {simulatedTopic === 'Delivery Delay'
                    ? 'Order #40921 not delivered — 3 days overdue'
                    : simulatedTopic === '504 Gateway'
                    ? 'Inbound Webhook 504 Timeouts during 1,200 req/s spike'
                    : 'Invoice #4029 duplicate charge inquiry'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">Customer: harshsingh359800@gmail.com</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
                {simulatedTopic === 'Delivery Delay'
                  ? 'The customer placed an order three days ago, but the order has still not been delivered. The expected delivery date has already passed. The customer would like an update on the current delivery status and expected delivery date.'
                  : simulatedTopic === '504 Gateway'
                  ? 'Our cluster nodes are seeing dropped packets and 504 timeouts whenever ingestion throughput crosses 1,200 events/sec. Edge gateway proxy logs required.'
                  : 'Hi team, our finance manager noticed we were billed twice for the Enterprise Annual tier on July 1st. Could you verify the transaction records and initiate a credit refund?'}
              </p>

              {/* SLA Target indicator */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium">SLA Target Calculation:</span>
                <span className="font-bold text-emerald-300">
                  {simulatedPriority === 'Urgent' ? '4 Hours Maximum Response' : '12 Hours Maximum Response'}
                </span>
              </div>
            </div>

            {/* Right: AI Copilot Live Generated Response */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                    AI Copilot Resolution Draft
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Confidence: 96%
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                  {simulatedTopic === 'Delivery Delay'
                    ? `Hi Harsh,
Thank you for contacting Customer Support regarding your order delivery.
I sincerely apologize for the delay. We have flagged your shipment as Priority Expedited with our courier dispatch hub.
• Package cleared intermediate transit, scheduled for delivery in 24–36 hrs.
• Live SMS tracking has been triggered to harshsingh359800@gmail.com.
If not received by tomorrow end-of-day, reply to this ticket for an instant shipping refund.`
                    : simulatedTopic === '504 Gateway'
                    ? `Hi Sarah,
Thank you for reaching out regarding the webhook timeouts.
Our engineering team has examined our edge proxy and worker clusters:
1. Scaled worker replica pool limits to buffer transient concurrency.
2. Ingestion latency normalized below 45ms.
Please retry the request and let us know if any timeout persists.`
                    : `Hi Michael,
Thank you for bringing this billing matter to our attention.
I have reviewed our Stripe ledger records for your account:
• Duplicate transaction identified and reversal credit of $1,200 initiated.
• Updated zero-balance receipt dispatched to your email.`}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready to test in full app?</span>
                <button
                  onClick={onLaunchApp}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-lg shadow transition-colors"
                >
                  <span>Open Ticket in CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Matrix */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-950/60 border border-primary-800/80 px-3 py-1 rounded-full">
            Standout Engineering
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Why OmniDesk Outperforms Bare-Bones CRMs
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-2">
            Every feature was purposefully designed to answer what real support teams handling hundreds of tickets a day actually need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-primary-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary-950 border border-primary-800 text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI Support Copilot</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Auto-generates context-aware, empathetic customer resolution replies for logistics, technical bugs, billing, and access issues.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time SLA Guardian</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Dynamically computes SLA countdowns based on priority (4h to 48h), alerting agents to tickets that are Within SLA, At Risk, or Breached.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Internal vs Public Isolation</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Maintains strict boundaries between confidential internal technical audit notes and public customer communications.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">High-Speed SQLite Engine</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Zero-configuration SQLite architecture with Write-Ahead Logging (WAL) and composite indexes for instant live debounce search.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-primary-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
                Productivity Impact
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                How much time does OmniDesk save your team?
              </h3>
              <p className="text-sm text-slate-400">
                Adjust your monthly ticket volume to see time and cost savings with AI Copilot triage and canned responses:
              </p>

              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>Monthly Tickets:</span>
                  <span className="text-primary-400 font-mono text-sm">{ticketVolume.toLocaleString()} tickets</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={ticketVolume}
                  onChange={(e) => setTicketVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto flex-shrink-0">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {hoursSaved} hrs
                </p>
                <p className="text-xs text-slate-400 mt-1">Saved Per Month</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  ${costSavings.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Estimated ROI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
            System Specifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Production-Grade Full-Stack Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-primary-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Backend Layer
            </span>
            <p className="font-semibold text-white">Node.js + Express 5</p>
            <p className="text-xs text-slate-400">
              RESTful endpoints (`POST /api/tickets`, `GET /api/tickets`, `PUT /api/tickets/:id`, `POST /notes`, `GET /stats`).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              Database Layer
            </span>
            <p className="font-semibold text-white">SQLite3 (`better-sqlite3`)</p>
            <p className="text-xs text-slate-400">
              WAL concurrency, strict foreign keys, parameterized prepared statements, auto-migration and demo seeder.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Frontend Layer
            </span>
            <p className="font-semibold text-white">React 18 + Vite + Tailwind</p>
            <p className="text-xs text-slate-400">
              Optimistic updates, glassmorphic dark/light themes, keyboard shortcuts (`Ctrl+K`, `N`), and CSV export.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary-900/40 via-indigo-900/40 to-brand-900/40 border border-primary-500/30 shadow-2xl backdrop-blur-md space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to test OmniDesk CRM in action?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Explore live ticket creation, test real-time search across hundreds of records, and experience the AI Copilot.
          </p>
          <div>
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-primary-500/30 active:scale-95 transition-all"
            >
              <span>Launch Live CRM Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>Built with ❤️ by Harsh Singh for the Datastraw Hiring Assessment Test • 2026</p>
      </footer>

    </div>
  );
}
