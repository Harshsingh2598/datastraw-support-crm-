const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ticketsRouter = require('./routes/tickets');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/assets')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api', ticketsRouter);
app.use('/api/ai', aiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Datastraw Support CRM (OmniDesk API)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all route for Single Page Application client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API route ${req.path} not found` });
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="font-family:system-ui;padding:40px;background:#0f172a;color:#f8fafc;text-align:center;">
            <h1>OmniDesk Support CRM API is Running</h1>
            <p>Frontend production bundle is building or running in Vite dev mode on port 5173.</p>
            <p>Access the API at <a href="/api/tickets" style="color:#38bdf8;">/api/tickets</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Datastraw Support CRM Backend Online`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📄 API Endpoints: http://localhost:${PORT}/api/tickets`);
  console.log(`=============================================`);
});
