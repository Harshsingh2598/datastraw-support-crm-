/**
 * Formats a date string into human-readable relative time ("2m ago", "3h ago", "2d ago")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Calculates SLA status for a ticket based on priority and elapsed time
 */
export function getSLAStatus(ticket) {
  if (ticket.status === 'Closed') {
    return { status: 'RESOLVED', label: 'Resolved', color: 'emerald' };
  }

  const created = new Date(ticket.created_at);
  const now = new Date();
  const elapsedHours = (now - created) / (1000 * 3600);

  // SLA Thresholds by priority (hours)
  const thresholds = {
    Urgent: 4,     // 4 hour SLA
    High: 12,      // 12 hour SLA
    Medium: 24,    // 24 hour SLA
    Low: 48        // 48 hour SLA
  };

  const limit = thresholds[ticket.priority] || 24;

  if (elapsedHours > limit) {
    return {
      status: 'BREACHED',
      label: 'SLA Breached',
      color: 'red',
      remaining: `${Math.round(elapsedHours - limit)}h overdue`
    };
  } else if (elapsedHours > limit * 0.7) {
    return {
      status: 'AT_RISK',
      label: 'SLA At Risk',
      color: 'amber',
      remaining: `${Math.round(limit - elapsedHours)}h left`
    };
  }

  return {
    status: 'HEALTHY',
    label: 'Within SLA',
    color: 'emerald',
    remaining: `${Math.round(limit - elapsedHours)}h left`
  };
}

/**
 * Exports ticket list into a downloadable CSV file
 */
export function exportToCSV(tickets, filename = 'datastraw_support_tickets.csv') {
  if (!tickets || !tickets.length) return;

  const headers = ['Ticket ID', 'Customer Name', 'Customer Email', 'Subject', 'Status', 'Priority', 'Category', 'Created At', 'Updated At'];
  
  const rows = tickets.map(t => [
    `"${t.ticket_id}"`,
    `"${(t.customer_name || '').replace(/"/g, '""')}"`,
    `"${(t.customer_email || '').replace(/"/g, '""')}"`,
    `"${(t.subject || '').replace(/"/g, '""')}"`,
    `"${t.status}"`,
    `"${t.priority}"`,
    `"${t.category}"`,
    `"${t.created_at}"`,
    `"${t.updated_at}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
