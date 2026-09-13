import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function enrich(booking) {
  const cls = db.prepare('SELECT id, name, day_of_week, start_time, capacity FROM classes WHERE id = ?').get(booking.class_id);
  return { ...booking, class_name: cls?.name || 'Unknown class', class_capacity: cls?.capacity ?? null };
}

router.get('/', requireAuth, (req, res) => {
  const { status, class_id, date } = req.query;
  const clauses = [];
  const params = [];
  if (status) {
    clauses.push('status = ?');
    params.push(status);
  }
  if (class_id) {
    clauses.push('class_id = ?');
    params.push(class_id);
  }
  if (date) {
    clauses.push('date = ?');
    params.push(date);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM bookings ${where} ORDER BY created_at DESC`).all(...params);
  res.json(rows.map(enrich));
});

router.post('/', (req, res) => {
  const { customer_name, phone, email, class_id, date } = req.body || {};
  if (!customer_name || !phone || !email || !class_id || !date) {
    return res.status(400).json({ error: 'customer_name, phone, email, class_id, and date are all required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(class_id);
  if (!cls) return res.status(404).json({ error: 'Class not found' });

  const confirmed = db
    .prepare("SELECT COUNT(*) as c FROM bookings WHERE class_id = ? AND date = ? AND status = 'confirmed'")
    .get(class_id, date).c;
  if (confirmed >= cls.capacity) {
    return res.status(409).json({ error: 'This class is full for the selected date' });
  }

  const result = db
    .prepare(
      `INSERT INTO bookings (customer_name, phone, email, class_id, date, status) VALUES (?, ?, ?, ?, ?, 'pending')`
    )
    .run(customer_name, phone, email, class_id, date);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(enrich(booking));
});

router.patch('/:id', requireAuth, (req, res) => {
  const { status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'declined', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (status === 'confirmed') {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(booking.class_id);
    const confirmed = db
      .prepare("SELECT COUNT(*) as c FROM bookings WHERE class_id = ? AND date = ? AND status = 'confirmed' AND id != ?")
      .get(booking.class_id, booking.date, booking.id).c;
    if (cls && confirmed >= cls.capacity) {
      return res.status(409).json({ error: 'Cannot confirm — this class is already full for that date' });
    }
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json(enrich(updated));
});

export default router;
