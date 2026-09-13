import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { toISODate, weekDates } from '../utils/dates.js';

const router = express.Router();

router.get('/summary', requireAuth, (req, res) => {
  const today = toISODate(new Date());
  const todayDow = new Date().getDay();

  const todaysClasses = db
    .prepare('SELECT * FROM classes WHERE day_of_week = ? ORDER BY start_time')
    .all(todayDow)
    .map((c) => {
      const confirmed = db
        .prepare("SELECT COUNT(*) as c FROM bookings WHERE class_id = ? AND date = ? AND status = 'confirmed'")
        .get(c.id, today).c;
      const trainer = c.trainer_id ? db.prepare('SELECT name FROM trainers WHERE id = ?').get(c.trainer_id) : null;
      return { ...c, date: today, confirmed, spots_left: Math.max(0, c.capacity - confirmed), trainer_name: trainer?.name || 'TBA' };
    });

  const pendingCount = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").get().c;

  const dates = weekDates(0);
  const weekClasses = db.prepare('SELECT * FROM classes').all();
  const occupancy = weekClasses.map((c) => {
    const date = dates[c.day_of_week];
    const confirmed = db
      .prepare("SELECT COUNT(*) as c FROM bookings WHERE class_id = ? AND date = ? AND status = 'confirmed'")
      .get(c.id, date).c;
    return {
      id: c.id,
      name: c.name,
      date,
      day_of_week: c.day_of_week,
      start_time: c.start_time,
      capacity: c.capacity,
      confirmed,
      occupancy_pct: c.capacity ? Math.round((confirmed / c.capacity) * 100) : 0,
    };
  });

  const newEnquiries = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'new'").get().c;

  res.json({
    today,
    todaysClasses,
    pendingCount,
    newEnquiries,
    weekOccupancy: occupancy,
  });
});

export default router;
