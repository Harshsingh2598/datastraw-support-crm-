import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateTicketModal({
  isOpen,
  onClose,
  onTicketCreated
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium',
    category: 'Technical'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.customer_name.trim()) errs.customer_name = 'Customer name is required';
    if (!formData.customer_email.trim()) {
      errs.customer_email = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      errs.customer_email = 'Enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Issue subject/title is required';
    if (!formData.description.trim()) errs.description = 'Issue description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create ticket');

      onTicketCreated(data.ticket);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create New Support Ticket
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-generates sequential ID and assigns SLA target
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Alex Morgan"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.customer_name
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
                }`}
              />
              {errors.customer_name && (
                <p className="text-[11px] text-red-500 mt-1">{errors.customer_name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="alex.morgan@company.com"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.customer_email
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
                }`}
              />
              {errors.customer_email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.customer_email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Issue Subject / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Brief summary of the issue or inquiry"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.subject
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
              }`}
            />
            {errors.subject && (
              <p className="text-[11px] text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Row 3: Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="Low">Low (48h SLA)</option>
                <option value="Medium">Medium (24h SLA)</option>
                <option value="High">High (12h SLA)</option>
                <option value="Urgent">Urgent (4h SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="Technical">Technical Support</option>
                <option value="Billing">Billing & Invoicing</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Account">Account Access</option>
                <option value="General">General Inquiries</option>
              </select>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Issue Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide comprehensive details, error logs, or user impact..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-md shadow-primary-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Generating Ticket...' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
