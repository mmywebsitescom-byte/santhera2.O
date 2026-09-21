import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const CONTENT_FILE = path.join(__dirname, 'content.json');
const DEFAULT_ADMIN_PASSWORD = 'Techxera@gmail.2026';
const DEFAULT_ADMIN_EMAIL = 'techxerahack@gmail.com';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.lloiyxagwcbsunhsbvip:Raghab%4020062026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

export const dbPool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 8,
  idleTimeoutMillis: 30000,
});

dbPool.on('error', (err) => {
  console.warn('PostgreSQL pool background event:', err.message);
});

function getAdminPassword(): string {
  const content = readContent();
  if (content.adminSettings && typeof content.adminSettings === 'object') {
    const pass = (content.adminSettings as Record<string, unknown>).passcode;
    if (typeof pass === 'string' && pass.trim()) {
      return pass.trim();
    }
  }
  return DEFAULT_ADMIN_PASSWORD;
}

function getAdminEmail(): string {
  const content = readContent();
  if (content.adminSettings && typeof content.adminSettings === 'object') {
    const em = (content.adminSettings as Record<string, unknown>).email;
    if (typeof em === 'string' && em.trim()) {
      return em.trim().toLowerCase();
    }
  }
  return DEFAULT_ADMIN_EMAIL;
}

app.use(express.json({ limit: '10mb' }));

// CORS headers
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

function readContent(): Record<string, unknown> {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      return {};
    }
    const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading content file:', err);
    return {};
  }
}

function writeContent(data: Record<string, unknown>) {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing content file:', err);
    throw err;
  }
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  const currentPass = getAdminPassword();
  if (!auth || auth !== `Bearer ${currentPass}`) {
    res.status(401).json({ error: 'Unauthorized: invalid or missing admin token' });
    return;
  }
  next();
}

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
app.get('/api/content', (_req, res) => {
  const content = readContent();
  res.json(content);
});

// Direct PostgreSQL health check endpoint
app.get('/api/db-status', async (_req, res) => {
  try {
    const result = await dbPool.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        now() as server_time,
        version() as version;
    `);
    const tables = await dbPool.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
    `);
    res.json({
      connected: true,
      database: result.rows[0].database,
      user: result.rows[0].user,
      serverTime: result.rows[0].server_time,
      version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1],
      tables: tables.rows.map((r: any) => r.table_name),
    });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  const currentPass = getAdminPassword();
  const currentEmail = getAdminEmail();

  const passwordMatches = password === currentPass;
  const emailMatches = !email || email.trim().toLowerCase() === currentEmail;

  if (passwordMatches && emailMatches) {
    res.json({ token: currentPass, success: true });
  } else {
    res.status(401).json({ error: 'Invalid email or password. Try again.', success: false });
  }
});

app.post('/api/admin/change-passcode', requireAdmin, (req, res) => {
  const { newPasscode } = req.body || {};
  if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
    res.status(400).json({ error: 'Passcode must be at least 4 characters long', success: false });
    return;
  }
  try {
    const data = readContent();
    data.adminSettings = { ...(data.adminSettings as object || {}), passcode: newPasscode.trim() };
    writeContent(data);
    res.json({ success: true, token: newPasscode.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update passcode', details: String(err) });
  }
});

app.post('/api/admin/registrations', requireAdmin, (req, res) => {
  try {
    const data = readContent();
    const regs = ((data.registrations as unknown[]) || []) as Array<Record<string, unknown>>;
    const newReg = {
      id: req.body.ticketId || `HV-26-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      ...req.body,
    };
    regs.unshift(newReg);
    data.registrations = regs;
    writeContent(data);
    res.json({ success: true, id: newReg.id, registration: newReg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create registration', details: String(err) });
  }
});

app.post('/api/registrations', (req, res) => {
  try {
    const data = readContent();
    const regs = ((data.registrations as unknown[]) || []) as Array<Record<string, unknown>>;
    const newReg = {
      id: req.body.ticketId || `HV-26-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      ...req.body,
    };
    regs.unshift(newReg);
    data.registrations = regs;
    writeContent(data);
    res.json({ success: true, id: newReg.id, registration: newReg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save registration', details: String(err) });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────
app.get('/api/admin/registrations', requireAdmin, (_req, res) => {
  const data = readContent();
  res.json(data.registrations || []);
});

// Update an entire section (e.g. hero, eventInfo, faq, prizes, etc.)
app.put('/api/admin/content/:section', requireAdmin, (req, res) => {
  try {
    const { section } = req.params;
    const data = readContent();
    data[section] = req.body;
    writeContent(data);
    res.json({ success: true, section, data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section', details: String(err) });
  }
});

// Update the ENTIRE content in one call (for full JSON editor / raw mode)
app.put('/api/admin/content', requireAdmin, (req, res) => {
  try {
    const updated = req.body;
    if (typeof updated !== 'object' || updated === null || Array.isArray(updated)) {
      res.status(400).json({ error: 'Invalid content format. Must be an object.' });
      return;
    }
    const current = readContent();
    // Preserve registrations if not passed in
    if (!updated.registrations && current.registrations) {
      updated.registrations = current.registrations;
    }
    writeContent(updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entire content', details: String(err) });
  }
});

app.put('/api/admin/registrations/:id', requireAdmin, (req, res) => {
  try {
    const data = readContent();
    const regs = ((data.registrations as Array<Record<string, unknown>>) || []);
    const index = regs.findIndex((r) => r.id === req.params.id || r.ticketId === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    regs[index] = { ...regs[index], ...req.body, updatedAt: new Date().toISOString() };
    data.registrations = regs;
    writeContent(data);
    res.json({ success: true, registration: regs[index] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update registration', details: String(err) });
  }
});

app.delete('/api/admin/registrations/:id', requireAdmin, (req, res) => {
  try {
    const data = readContent();
    const regs = ((data.registrations as Array<Record<string, unknown>>) || []);
    data.registrations = regs.filter((r) => r.id !== req.params.id && r.ticketId !== req.params.id);
    writeContent(data);
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete registration', details: String(err) });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Hackverse Admin API running at http://localhost:${PORT}`);
  console.log(`📁 Content file: ${CONTENT_FILE}`);
  console.log(`🔑 Admin password: ${getAdminPassword()}\n`);
});

// Port 4000 API server is active


