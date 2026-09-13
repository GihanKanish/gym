import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function enrich(row) {
  const plan = row.plan_id ? db.prepare('SELECT id, name FROM membership_plans WHERE id = ?').get(row.plan_id) : null;
  return { ...row, plan_name: plan?.name || null };
}

router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  const where = status ? 'WHERE status = ?' : '';
  const params = status ? [status] : [];
  const rows = db.prepare(`SELECT * FROM enquiries ${where} ORDER BY created_at DESC`).all(...params);
  res.json(rows.map(enrich));
});

router.post('/', (req, res) => {
  const { name, phone, email, plan_id, message } = req.body || {};
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'name, phone, and email are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }
  const result = db
    .prepare('INSERT INTO enquiries (name, phone, email, plan_id, message, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, phone, email, plan_id || null, message || '', 'new');
  const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(enrich(enquiry));
});

router.patch('/:id', requireAuth, (req, res) => {
  const { status } = req.body || {};
  const allowed = ['new', 'contacted', 'converted'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }
  const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Enquiry not found' });
  db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
  res.json(enrich(updated));
});

export default router;
