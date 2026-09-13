import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  const trainers = db.prepare('SELECT * FROM trainers ORDER BY name').all();
  res.json(trainers);
});

router.get('/:id', (req, res) => {
  const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
  if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
  res.json(trainer);
});

router.post('/', requireAuth, (req, res) => {
  const { name, bio, photo_url } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const result = db.prepare('INSERT INTO trainers (name, bio, photo_url) VALUES (?, ?, ?)').run(name, bio || '', photo_url || '');
  const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(trainer);
});

router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Trainer not found' });
  const { name, bio, photo_url } = req.body || {};
  db.prepare('UPDATE trainers SET name = ?, bio = ?, photo_url = ? WHERE id = ?').run(
    name ?? existing.name,
    bio ?? existing.bio,
    photo_url ?? existing.photo_url,
    req.params.id
  );
  const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
  res.json(trainer);
});

router.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Trainer not found' });
  db.prepare('DELETE FROM trainers WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
