import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js';
import './seed.js';

import authRoutes from './routes/auth.js';
import classesRoutes from './routes/classes.js';
import bookingsRoutes from './routes/bookings.js';
import trainersRoutes from './routes/trainers.js';
import plansRoutes from './routes/plans.js';
import enquiriesRoutes from './routes/enquiries.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.SERVER_PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Gym API server running on http://localhost:${PORT}`);
});
