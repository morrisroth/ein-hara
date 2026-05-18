require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ein-hara-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'moris.roth@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

// Hash password once at startup
const ADMIN_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 12);

// Ensure data directory exists
const dataDir = path.dirname(process.env.DB_PATH || './data/analytics.db');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(process.env.DB_PATH || './data/analytics.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    session_id TEXT,
    screen TEXT,
    element TEXT,
    ip TEXT,
    user_agent TEXT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    pkg_id TEXT,
    pkg_name TEXT,
    price INTEGER,
    names TEXT,
    phone TEXT,
    email TEXT,
    concerns TEXT,
    as_gift INTEGER,
    payment TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS heartbeats (
    session_id TEXT PRIMARY KEY,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    screen TEXT,
    ip TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);
`);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

app.post('/api/track', (req, res) => {
  const { type, sessionId, screen, element, referrer, url } = req.body;
  const ip = getIp(req);
  const ua = req.headers['user-agent'] || '';
  const data = (referrer || url) ? JSON.stringify({ referrer, url }) : null;
  db.prepare(
    `INSERT INTO events (type, session_id, screen, element, ip, user_agent, data) VALUES (?,?,?,?,?,?,?)`
  ).run(type, sessionId, screen || null, element || null, ip, ua, data);
  res.json({ ok: true });
});

app.post('/api/heartbeat', (req, res) => {
  const { sessionId, screen } = req.body;
  const ip = getIp(req);
  db.prepare(`
    INSERT INTO heartbeats (session_id, screen, ip, last_seen) VALUES (?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(session_id) DO UPDATE SET screen=excluded.screen, ip=excluded.ip, last_seen=CURRENT_TIMESTAMP
  `).run(sessionId, screen || 'unknown', ip);
  res.json({ ok: true });
});

app.post('/api/submit', (req, res) => {
  const { sessionId, pkgId, pkgName, price, names, phone, email, concerns, asGift, payment } = req.body;
  const ip = getIp(req);
  db.prepare(`
    INSERT INTO submissions (session_id, pkg_id, pkg_name, price, names, phone, email, concerns, as_gift, payment, ip)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(sessionId, pkgId, pkgName, price, JSON.stringify(names || []), phone, email, concerns || '', asGift ? 1 : 0, payment, ip);
  res.json({ ok: true });
});

// ── Admin Auth ────────────────────────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, ADMIN_HASH);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// ── Admin Stats ───────────────────────────────────────────────────────────────

app.get('/api/admin/stats', authMiddleware, (req, res) => {
  const g = (sql, ...args) => db.prepare(sql).get(...args);
  const a = (sql, ...args) => db.prepare(sql).all(...args);

  const summary = {
    totalVisitors:    g(`SELECT COUNT(DISTINCT session_id) c FROM events WHERE type='pageload'`).c,
    totalPageviews:   g(`SELECT COUNT(*) c FROM events WHERE type='pageview'`).c,
    totalClicks:      g(`SELECT COUNT(*) c FROM events WHERE type='click'`).c,
    totalSubmissions: g(`SELECT COUNT(*) c FROM submissions`).c,
    todayVisitors:    g(`SELECT COUNT(DISTINCT session_id) c FROM events WHERE type='pageload' AND date(created_at)=date('now')`).c,
    todaySubmissions: g(`SELECT COUNT(*) c FROM submissions WHERE date(created_at)=date('now')`).c,
    activeNow:        g(`SELECT COUNT(*) c FROM heartbeats WHERE last_seen > datetime('now','-3 minutes')`).c,
    revenueTotal:     g(`SELECT COALESCE(SUM(price),0) c FROM submissions`).c,
    revenueToday:     g(`SELECT COALESCE(SUM(price),0) c FROM submissions WHERE date(created_at)=date('now')`).c,
  };

  const dailyVisitors = a(`
    SELECT date(created_at) date, COUNT(DISTINCT session_id) count
    FROM events WHERE type='pageload' AND created_at > datetime('now','-30 days')
    GROUP BY date(created_at) ORDER BY date
  `);

  const dailyRevenue = a(`
    SELECT date(created_at) date, SUM(price) count
    FROM submissions WHERE created_at > datetime('now','-30 days')
    GROUP BY date(created_at) ORDER BY date
  `);

  const screenViews = a(`
    SELECT screen, COUNT(*) count FROM events
    WHERE type='pageview' AND screen IS NOT NULL
    GROUP BY screen ORDER BY count DESC
  `);

  const clicksByElement = a(`
    SELECT element, COUNT(*) count FROM events
    WHERE type='click' AND element IS NOT NULL
    GROUP BY element ORDER BY count DESC LIMIT 10
  `);

  const pkgBreakdown = a(`
    SELECT pkg_name, COUNT(*) count, SUM(price) revenue
    FROM submissions GROUP BY pkg_name ORDER BY count DESC
  `);

  const topCountries = a(`
    SELECT ip, COUNT(*) count FROM events
    WHERE type='pageload' GROUP BY ip ORDER BY count DESC LIMIT 10
  `);

  res.json({ summary, dailyVisitors, dailyRevenue, screenViews, clicksByElement, pkgBreakdown, topCountries });
});

app.get('/api/admin/submissions', authMiddleware, (req, res) => {
  const page = Math.max(0, parseInt(req.query.page) || 0);
  const limit = 50;
  const search = req.query.search ? `%${req.query.search}%` : null;
  const rows = search
    ? db.prepare(`SELECT * FROM submissions WHERE phone LIKE ? OR email LIKE ? OR names LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(search, search, search, limit, page * limit)
    : db.prepare(`SELECT * FROM submissions ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, page * limit);
  const total = search
    ? db.prepare(`SELECT COUNT(*) c FROM submissions WHERE phone LIKE ? OR email LIKE ? OR names LIKE ?`).get(search, search, search).c
    : db.prepare(`SELECT COUNT(*) c FROM submissions`).get().c;
  res.json({ submissions: rows, total });
});

app.get('/api/admin/events', authMiddleware, (req, res) => {
  const page = Math.max(0, parseInt(req.query.page) || 0);
  const type = req.query.type;
  const limit = 100;
  const rows = type
    ? db.prepare(`SELECT * FROM events WHERE type=? ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(type, limit, page * limit)
    : db.prepare(`SELECT * FROM events ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, page * limit);
  const total = type
    ? db.prepare(`SELECT COUNT(*) c FROM events WHERE type=?`).get(type).c
    : db.prepare(`SELECT COUNT(*) c FROM events`).get().c;
  res.json({ events: rows, total });
});

// SSE: real-time visitors (accepts token via ?t= since EventSource can't set headers)
app.get('/api/admin/realtime', (req, res) => {
  const token = req.query.t || (req.headers.authorization || '').replace('Bearer ', '');
  try { jwt.verify(token, JWT_SECRET); } catch { return res.status(401).end(); }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = () => {
    const active = db.prepare(`
      SELECT session_id, screen, ip, last_seen FROM heartbeats
      WHERE last_seen > datetime('now','-3 minutes') ORDER BY last_seen DESC
    `).all();
    res.write(`data: ${JSON.stringify(active)}\n\n`);
  };

  send();
  const interval = setInterval(send, 5000);
  req.on('close', () => clearInterval(interval));
});

// SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`ein-hara server running on port ${PORT}`));
