const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'crm.db');
const db = new Database(DB_PATH);

// Enable Foreign Key support and WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  // 1. TICKETS TABLE
  // id (pk)
  // ticket_id (unique, e.g., TKT-1001)
  // customer_name (text)
  // customer_email (text)
  // subject (text)
  // description (text)
  // status (Open/In Progress/Closed)
  // priority (Low/Medium/High/Urgent)
  // category (Technical/Billing/Feature Request/Account/General)
  // created_at (timestamp)
  // updated_at (timestamp)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Closed')),
      priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
      category TEXT NOT NULL DEFAULT 'Technical' CHECK (category IN ('Technical', 'Billing', 'Feature Request', 'Account', 'General')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id ON tickets(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
  `);

  // 2. NOTES TABLE
  // id (pk)
  // ticket_id (fk to tickets.ticket_id)
  // note_text (text)
  // author_name (text)
  // is_internal (1 for internal note, 0 for public reply)
  // created_at (timestamp)
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      note_text TEXT NOT NULL,
      author_name TEXT DEFAULT 'Support Agent',
      is_internal INTEGER DEFAULT 1 CHECK (is_internal IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_ticket_id ON notes(ticket_id);
  `);

  // Check if we need initial seed
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM tickets');
  const { count } = countStmt.get();
  if (count === 0) {
    seedInitialData();
  }
}

function generateNextTicketId() {
  const row = db.prepare(`
    SELECT ticket_id FROM tickets 
    ORDER BY id DESC LIMIT 1
  `).get();

  if (!row) {
    return 'TKT-1001';
  }

  const match = row.ticket_id.match(/TKT-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `TKT-${nextNum}`;
  }
  return `TKT-${Date.now().toString().slice(-4)}`;
}

function seedInitialData() {
  const sampleTickets = [
    {
      ticket_id: 'TKT-1001',
      customer_name: 'Sarah Connor',
      customer_email: 'sarah.connor@cyberdyne.io',
      subject: 'Webhook timeouts during peak ingestion load',
      description: 'Our backend services noticed our webhooks failing with 504 Gateway Timeouts whenever inbound event volume spikes over 1,200 events/sec. Please investigate whether rate limits or queuing delays are occurring on the edge gateway.',
      status: 'Open',
      priority: 'Urgent',
      category: 'Technical',
      created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(), // 4 hours ago
      notes: [
        {
          note_text: 'Investigating Cloudflare edge proxy logs. Scaling worker node replica pool from 4 to 8.',
          author_name: 'Alex Vance (Lead DevOps)',
          is_internal: 1,
          created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
        }
      ]
    },
    {
      ticket_id: 'TKT-1002',
      customer_name: 'Michael Scott',
      customer_email: 'michael.scott@dundermifflin.com',
      subject: 'Invoice #4029 duplicate charge inquiry',
      description: 'Hi team, our finance manager noticed we were billed twice for the Enterprise Annual tier on July 1st. Could you verify the transaction records and initiate a credit refund?',
      status: 'In Progress',
      priority: 'High',
      category: 'Billing',
      created_at: new Date(Date.now() - 3600 * 1000 * 26).toISOString(), // 26 hours ago
      notes: [
        {
          note_text: 'Checked Stripe billing dashboard. Confirmed duplicate authorization due to retry on payment gateway.',
          author_name: 'Elena Rostova (Billing Ops)',
          is_internal: 1,
          created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
        },
        {
          note_text: 'Dear Michael, we have identified the duplicate charge and initiated an instant refund of $1,200 back to your card ending in 4112.',
          author_name: 'Elena Rostova (Billing Ops)',
          is_internal: 0,
          created_at: new Date(Date.now() - 3600 * 1000 * 10).toISOString()
        }
      ]
    },
    {
      ticket_id: 'TKT-1003',
      customer_name: 'Devon Miles',
      customer_email: 'devon@foundation2000.org',
      subject: 'Feature Request: SCIM v2.0 protocol for Okta user provisioning',
      description: 'We are expanding our team to 450+ members and require automated user provisioning and group synchronization via SCIM 2.0. Is this currently supported or on the Q3 roadmap?',
      status: 'Open',
      priority: 'Medium',
      category: 'Feature Request',
      created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      notes: []
    },
    {
      ticket_id: 'TKT-1004',
      customer_name: 'Aisha Patel',
      customer_email: 'aisha.patel@novasystems.tech',
      subject: 'SSL Certificate renewal failure on custom domain portal',
      description: 'Our custom white-labeled support portal domain portal.novasystems.tech is throwing an NET::ERR_CERT_DATE_INVALID warning. Auto-renewal with Let\'s Encrypt failed yesterday.',
      status: 'Closed',
      priority: 'High',
      category: 'Technical',
      created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      notes: [
        {
          note_text: 'Renewed DNS challenge token manually via Cloudflare DNS API.',
          author_name: 'Marcus Chen',
          is_internal: 1,
          created_at: new Date(Date.now() - 3600 * 1000 * 40).toISOString()
        },
        {
          note_text: 'Hi Aisha, the SSL certificate has been reissued and propagated globally. The portal is now secure and operational.',
          author_name: 'Marcus Chen',
          is_internal: 0,
          created_at: new Date(Date.now() - 3600 * 1000 * 38).toISOString()
        }
      ]
    },
    {
      ticket_id: 'TKT-1005',
      customer_name: 'Liam Neeson',
      customer_email: 'liam@actionmail.com',
      subject: 'Cannot access MFA recovery codes after phone reset',
      description: 'I recently upgraded my mobile device and lost my Google Authenticator seeds. I need help verifying my identity to regain administrative access to our tenant.',
      status: 'In Progress',
      priority: 'Urgent',
      category: 'Account',
      created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      notes: [
        {
          note_text: 'Requested secondary identity confirmation via corporate domain DNS TXT record.',
          author_name: 'Security Desk',
          is_internal: 1,
          created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
        }
      ]
    },
    {
      ticket_id: 'TKT-1006',
      customer_name: 'Emma Watson',
      customer_email: 'emma.w@heforshe.org',
      subject: 'Dark mode contrast issues in reporting analytics table',
      description: 'The secondary text headers in the analytics export view are low contrast in dark theme (hex #4A5568 against #1A202C). Fails WCAG AA standards for accessibility.',
      status: 'Open',
      priority: 'Low',
      category: 'General',
      created_at: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
      notes: []
    }
  ];

  const insertTicket = db.prepare(`
    INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, category, created_at, updated_at)
    VALUES (@ticket_id, @customer_name, @customer_email, @subject, @description, @status, @priority, @category, @created_at, @created_at)
  `);

  const insertNote = db.prepare(`
    INSERT INTO notes (ticket_id, note_text, author_name, is_internal, created_at)
    VALUES (@ticket_id, @note_text, @author_name, @is_internal, @created_at)
  `);

  const runSeed = db.transaction((tickets) => {
    for (const t of tickets) {
      insertTicket.run(t);
      if (t.notes && t.notes.length > 0) {
        for (const n of t.notes) {
          insertNote.run({
            ticket_id: t.ticket_id,
            note_text: n.note_text,
            author_name: n.author_name || 'Support Agent',
            is_internal: n.is_internal !== undefined ? n.is_internal : 1,
            created_at: n.created_at || new Date().toISOString()
          });
        }
      }
    }
  });

  runSeed(sampleTickets);
}

// ========================
// DB QUERY HELPER METHODS
// ========================

function getAllTickets({ status, search, priority, category }) {
  let query = `
    SELECT 
      t.id,
      t.ticket_id,
      t.customer_name,
      t.customer_email,
      t.subject,
      t.description,
      t.status,
      t.priority,
      t.category,
      t.created_at,
      t.updated_at,
      (SELECT COUNT(*) FROM notes n WHERE n.ticket_id = t.ticket_id) AS notes_count
    FROM tickets t
    WHERE 1=1
  `;
  const params = {};

  if (status && status !== 'All') {
    query += ` AND t.status = @status`;
    params.status = status;
  }

  if (priority && priority !== 'All') {
    query += ` AND t.priority = @priority`;
    params.priority = priority;
  }

  if (category && category !== 'All') {
    query += ` AND t.category = @category`;
    params.category = category;
  }

  if (search && search.trim() !== '') {
    query += ` AND (
      t.ticket_id LIKE @search OR
      t.customer_name LIKE @search OR
      t.customer_email LIKE @search OR
      t.subject LIKE @search OR
      t.description LIKE @search
    )`;
    params.search = `%${search.trim()}%`;
  }

  query += ` ORDER BY 
    CASE t.priority
      WHEN 'Urgent' THEN 1
      WHEN 'High' THEN 2
      WHEN 'Medium' THEN 3
      WHEN 'Low' THEN 4
      ELSE 5
    END ASC,
    t.created_at DESC
  `;

  return db.prepare(query).all(params);
}

function getTicketById(ticket_id) {
  const ticket = db.prepare(`
    SELECT * FROM tickets WHERE ticket_id = ?
  `).get(ticket_id);

  if (!ticket) return null;

  const notes = db.prepare(`
    SELECT * FROM notes 
    WHERE ticket_id = ? 
    ORDER BY created_at ASC, id ASC
  `).all(ticket_id);

  return {
    ...ticket,
    notes
  };
}

function createTicket({ customer_name, customer_email, subject, description, priority = 'Medium', category = 'Technical' }) {
  const ticket_id = generateNextTicketId();
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, category, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?, ?)
  `);

  insert.run(ticket_id, customer_name, customer_email, subject, description, priority, category, now, now);

  return {
    ticket_id,
    customer_name,
    customer_email,
    subject,
    description,
    status: 'Open',
    priority,
    category,
    created_at: now,
    updated_at: now,
    notes: []
  };
}

function updateTicket(ticket_id, { status, notes }) {
  const existing = db.prepare(`SELECT * FROM tickets WHERE ticket_id = ?`).get(ticket_id);
  if (!existing) return null;

  const now = new Date().toISOString();

  const updateTx = db.transaction(() => {
    if (status && status !== existing.status) {
      db.prepare(`
        UPDATE tickets 
        SET status = ?, updated_at = ? 
        WHERE ticket_id = ?
      `).run(status, now, ticket_id);

      // Add an internal audit note when status changes
      db.prepare(`
        INSERT INTO notes (ticket_id, note_text, author_name, is_internal, created_at)
        VALUES (?, ?, 'System Audit', 1, ?)
      `).run(ticket_id, `Status updated from "${existing.status}" to "${status}"`, now);
    } else {
      db.prepare(`
        UPDATE tickets 
        SET updated_at = ? 
        WHERE ticket_id = ?
      `).run(now, ticket_id);
    }

    if (notes && typeof notes === 'string' && notes.trim().length > 0) {
      db.prepare(`
        INSERT INTO notes (ticket_id, note_text, author_name, is_internal, created_at)
        VALUES (?, ?, 'Support Agent', 1, ?)
      `).run(ticket_id, notes.trim(), now);
    }
  });

  updateTx();

  return getTicketById(ticket_id);
}

function addNote(ticket_id, { note_text, author_name = 'Support Agent', is_internal = 1 }) {
  const ticket = db.prepare(`SELECT id FROM tickets WHERE ticket_id = ?`).get(ticket_id);
  if (!ticket) return null;

  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO notes (ticket_id, note_text, author_name, is_internal, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insert.run(ticket_id, note_text, author_name, is_internal ? 1 : 0, now);

  // Touch ticket's updated_at
  db.prepare(`UPDATE tickets SET updated_at = ? WHERE ticket_id = ?`).run(now, ticket_id);

  return {
    id: result.lastInsertRowid,
    ticket_id,
    note_text,
    author_name,
    is_internal: is_internal ? 1 : 0,
    created_at: now
  };
}

function getStats() {
  const total = db.prepare(`SELECT COUNT(*) as count FROM tickets`).get().count;
  const open = db.prepare(`SELECT COUNT(*) as count FROM tickets WHERE status = 'Open'`).get().count;
  const inProgress = db.prepare(`SELECT COUNT(*) as count FROM tickets WHERE status = 'In Progress'`).get().count;
  const closed = db.prepare(`SELECT COUNT(*) as count FROM tickets WHERE status = 'Closed'`).get().count;
  const urgent = db.prepare(`SELECT COUNT(*) as count FROM tickets WHERE status != 'Closed' AND priority = 'Urgent'`).get().count;

  return {
    total,
    open,
    inProgress,
    closed,
    urgent
  };
}

function resetDemoData() {
  db.exec(`
    DELETE FROM notes;
    DELETE FROM tickets;
  `);
  seedInitialData();
  return { success: true, message: 'Demo data reset successfully' };
}

// Initialize tables on load
initSchema();

module.exports = {
  db,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addNote,
  getStats,
  resetDemoData
};
