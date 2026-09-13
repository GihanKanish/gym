import express from 'express';
import { db } from '../db.js';

const router = express.Router();

function parsePlan(row) {
  return { ...row, features: JSON.parse(row.features || '[]') };
}

router.get('/', (req, res) => {
  const plans = db.prepare('SELECT * FROM membership_plans ORDER BY price').all();
  res.json(plans.map(parsePlan));
});

router.get('/:id', (req, res) => {
  const plan = db.prepare('SELECT * FROM membership_plans WHERE id = ?').get(req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json(parsePlan(plan));
});

export default router;
