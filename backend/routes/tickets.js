const express = require('express');
const router = express.Router();
const db = require('../db');

// Validate email helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

/**
 * @route   POST /api/tickets
 * @desc    Create a new support ticket
 * @access  Public / Agent
 */
router.post('/tickets', (req, res) => {
  try {
    const { customer_name, customer_email, subject, description, priority, category } = req.body;

    // Required fields validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!customer_email || !customer_email.trim() || !isValidEmail(customer_email)) {
      return res.status(400).json({ error: 'A valid customer email is required' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Subject / issue title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    const chosenPriority = validPriorities.includes(priority) ? priority : 'Medium';

    const validCategories = ['Technical', 'Billing', 'Feature Request', 'Account', 'General'];
    const chosenCategory = validCategories.includes(category) ? category : 'Technical';

    const newTicket = db.createTicket({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      subject: subject.trim(),
      description: description.trim(),
      priority: chosenPriority,
      category: chosenCategory
    });

    res.status(201).json({
      success: true,
      ticket_id: newTicket.ticket_id,
      created_at: newTicket.created_at,
      ticket: newTicket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket', details: error.message });
  }
});

/**
 * @route   GET /api/tickets
 * @desc    List all tickets with search and status filtering
 * @access  Public / Agent
 */
router.get('/tickets', (req, res) => {
  try {
    const { status, search, priority, category } = req.query;

    const tickets = db.getAllTickets({
      status,
      search,
      priority,
      category
    });

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
  }
});

/**
 * @route   GET /api/stats
 * @desc    Summary statistics for KPI metric widgets
 */
router.get('/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

/**
 * @route   GET /api/tickets/:ticket_id
 * @desc    Get detailed ticket view including notes timeline
 */
router.get('/tickets/:ticket_id', (req, res) => {
  try {
    const { ticket_id } = req.params;
    const ticket = db.getTicketById(ticket_id);

    if (!ticket) {
      return res.status(404).json({ error: `Ticket '${ticket_id}' not found` });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket', details: error.message });
  }
});

/**
 * @route   PUT /api/tickets/:ticket_id
 * @desc    Update ticket status and/or append notes
 */
router.put('/tickets/:ticket_id', (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes } = req.body;

    if (status && !['Open', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Open, In Progress, or Closed' });
    }

    const updated = db.updateTicket(ticket_id, { status, notes });

    if (!updated) {
      return res.status(404).json({ error: `Ticket '${ticket_id}' not found` });
    }

    res.json({
      success: true,
      updated_at: updated.updated_at,
      ticket: updated
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket', details: error.message });
  }
});

/**
 * @route   POST /api/tickets/:ticket_id/notes
 * @desc    Add a note or reply to a ticket
 */
router.post('/tickets/:ticket_id/notes', (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { note_text, author_name, is_internal } = req.body;

    if (!note_text || !note_text.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }

    const note = db.addNote(ticket_id, {
      note_text: note_text.trim(),
      author_name: author_name || 'Support Agent',
      is_internal: is_internal !== undefined ? is_internal : 1
    });

    if (!note) {
      return res.status(404).json({ error: `Ticket '${ticket_id}' not found` });
    }

    res.status(201).json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note', details: error.message });
  }
});

/**
 * @route   POST /api/seed
 * @desc    Reset and reseed demo dataset
 */
router.post('/seed', (req, res) => {
  try {
    const result = db.resetDemoData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset demo data', details: error.message });
  }
});

module.exports = router;
