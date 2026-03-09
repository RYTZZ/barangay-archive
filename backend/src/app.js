const express = require('express');
const session = require('express-session');
const { requireAdmin, loginAdmin, logoutAdmin } = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const path = require('path');
const https = require('https');
const http = require('http');
const ordinanceRoutes = require('./routes/ordinances');
const officialsRoutes = require('./routes/officials');

const app = express();

// ── Session setup ───────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'zone2secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 86400000 },
}));

// ── Admin authentication routes ─────────────────────────────────────────────
app.post('/api/admin/login', loginAdmin);
app.post('/api/admin/logout', logoutAdmin);
app.use('/api/admin', adminRoutes);

// ── CORS ─────────────────────────────────────────────────────────────────────
// FRONTEND_URL can be a comma-separated list of allowed origins
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/ordinances', ordinanceRoutes);
app.use('/api/officials', officialsRoutes);

// ── Download proxy ────────────────────────────────────────────────────────────
// GET /api/download?url=<cloudinary_url>&filename=<original_name>
// Streams the remote file back to the browser with proper Content-Disposition
// so the correct filename is used regardless of cross-origin restrictions.
app.get('/api/download', (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: 'Missing url parameter.' });
  }

  // Only allow Cloudinary URLs (security: prevent open redirect / SSRF)
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL.' });
  }
  if (!parsed.hostname.endsWith('cloudinary.com')) {
    return res.status(403).json({ success: false, message: 'URL not allowed.' });
  }

  const safeName = (filename || 'document')
    .trim()
    .replace(/[^a-zA-Z0-9.\-_() ]/g, '_');

  const client = parsed.protocol === 'https:' ? https : http;

  client.get(url, (upstream) => {
    if (upstream.statusCode !== 200) {
      res.status(upstream.statusCode || 502).json({
        success: false,
        message: `Upstream returned ${upstream.statusCode}.`,
      });
      upstream.resume();
      return;
    }

    res.setHeader('Content-Type', upstream.headers['content-type'] || 'application/octet-stream');
    if (upstream.headers['content-length']) {
      res.setHeader('Content-Length', upstream.headers['content-length']);
    }
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    upstream.pipe(res);
  }).on('error', (err) => {
    console.error('Download proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ success: false, message: 'Failed to fetch file.' });
    }
  });
});

// ── Serve local uploads (fallback when GCS is not configured) ─────────────────
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
