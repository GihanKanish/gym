import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { nextDateForDay, weekDates } from '../utils/dates.js';

const router = express.Router();

function withTrainer(classRow) {
  const trainer = classRow.trainer_id
    ? db.prepare('SELECT id, name, photo_url FROM trainers WHERE id = ?').get(classRow.trainer_id)
    : null;
  return { ...classRow, trainer_name: trainer?.name || 'TBA', trainer_photo: trainer?.photo_url || null };
}

function confirmedCount(classId, date) {
  return db
    .prepare("SELECT COUNT(*) as c FROM bookings WHERE class_id = ? AND date = ? AND status = 'confirmed'")
    .get(classId, date).c;
}

router.get('/', (req, res) => {
  const classes = db.prepare('SELECT * FROM classes ORDER BY day_of_week, start_time').all();
  const enriched = classes.map((c) => {
    const withT = withTrainer(c);
    const nextDate = nextDateForDay(c.day_of_week);
    const confirmed = confirmedCount(c.id, nextDate);
    return { ...withT, next_date: nextDate, spots_left: Math.max(0, c.capacity - confirmed) };
  });
  res.json(enriched);
});

// Weekly schedule grid: all classes annotated with each date in the requested week + availability.
router.get('/schedule', (req, res) => {
  const weekOffset = parseInt(req.query.weekOffset || '0', 10) || 0;
  const dates = weekDates(weekOffset);
  const classes = db.prepare('SELECT * FROM classes ORDER BY day_of_week, start_time').all();
  const enriched = classes.map((c) => {
    const withT = withTrainer(c);
    const date = dates[c.day_of_week];
    const confirmed = confirmedCount(c.id, date);
    return { ...withT, date, spots_left: Math.max(0, c.capacity - confirmed) };
  });
  res.json({ weekOffset, dates, classes: enriched });
});

router.get('/:id', (req, res) => {
  const c = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Class not found' });
  res.json(withTrainer(c));
});

router.get('/:id/availability', (req, res) => {
  const c = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Class not found' });
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
  const confirmed = confirmedCount(c.id, date);
  res.json({ capacity: c.capacity, confirmed, spots_left: Math.max(0, c.capacity - confirmed) });
});

router.post('/', requireAuth, (req, res) => {
  const { name, trainer_id, day_of_week, start_time, duration_minutes, capacity, difficulty_level } = req.body || {};
  if (!name || day_of_week === undefined || !start_time) {
    return res.status(400).json({ error: 'name, day_of_week, and start_time are required' });
  }
  const result = db
    .prepare(
      `INSERT INTO classes (name, trainer_id, day_of_week, start_time, duration_minutes, capacity, difficulty_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name, trainer_id || null, day_of_week, start_time, duration_minutes || 60, capacity || 20, difficulty_level || 'All Levels');
  const created = db.prepare('SELECT * FROM classes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(withTrainer(created));
});

router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Class not found' });
  const { name, trainer_id, day_of_week, start_time, duration_minutes, capacity, difficulty_level } = req.body || {};
  db.prepare(
    `UPDATE classes SET name = ?, trainer_id = ?, day_of_week = ?, start_time = ?, duration_minutes = ?, capacity = ?, difficulty_level = ?
     WHERE id = ?`
  ).run(
    name ?? existing.name,
    trainer_id ?? existing.trainer_id,
    day_of_week ?? existing.day_of_week,
    start_time ?? existing.start_time,
    duration_minutes ?? existing.duration_minutes,
    capacity ?? existing.capacity,
    difficulty_level ?? existing.difficulty_level,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  res.json(withTrainer(updated));
});

router.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Class not found' });
  db.prepare('DELETE FROM classes WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
