import bcrypt from 'bcryptjs';
import { db } from './db.js';

const trainerCount = db.prepare('SELECT COUNT(*) as c FROM trainers').get().c;

if (trainerCount === 0) {
  console.log('Seeding database...');

  const insertTrainer = db.prepare('INSERT INTO trainers (name, bio, photo_url) VALUES (?, ?, ?)');
  const t1 = insertTrainer.run('Maya Chen', 'Certified yoga & mobility coach with 8 years of experience helping members build strength and flexibility.', 'https://i.pravatar.cc/300?img=47');
  const t2 = insertTrainer.run('Jordan Blake', 'Former competitive athlete turned HIIT and strength coach. Loves pushing people past their limits, safely.', 'https://i.pravatar.cc/300?img=12');
  const t3 = insertTrainer.run('Sofia Ramirez', 'High-energy Zumba and dance-fitness instructor. Makes every class feel like a party.', 'https://i.pravatar.cc/300?img=32');
  const t4 = insertTrainer.run('Marcus Webb', 'Strength & conditioning specialist focused on powerlifting fundamentals and injury prevention.', 'https://i.pravatar.cc/300?img=51');

  const insertClass = db.prepare(`INSERT INTO classes (name, trainer_id, day_of_week, start_time, duration_minutes, capacity, difficulty_level) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  // day_of_week: 0=Sunday, 1=Monday, ... 6=Saturday
  insertClass.run('Vinyasa Yoga', t1.lastInsertRowid, 1, '07:00', 60, 20, 'Beginner');
  insertClass.run('HIIT Blast', t2.lastInsertRowid, 1, '18:00', 45, 20, 'Advanced');
  insertClass.run('Zumba Party', t3.lastInsertRowid, 2, '19:00', 50, 25, 'All Levels');
  insertClass.run('Strength Training', t4.lastInsertRowid, 3, '17:30', 60, 15, 'Intermediate');
  insertClass.run('Spin Class', t2.lastInsertRowid, 4, '06:30', 45, 20, 'Intermediate');
  insertClass.run('Power Yoga', t1.lastInsertRowid, 4, '18:30', 60, 20, 'Intermediate');
  insertClass.run('HIIT Blast', t2.lastInsertRowid, 5, '18:00', 45, 20, 'Advanced');
  insertClass.run('Zumba Party', t3.lastInsertRowid, 6, '10:00', 50, 25, 'All Levels');
  insertClass.run('Strength Training', t4.lastInsertRowid, 0, '09:00', 60, 15, 'Beginner');

  const insertPlan = db.prepare('INSERT INTO membership_plans (name, price, duration, features) VALUES (?, ?, ?, ?)');
  insertPlan.run('Monthly', 49, '1 month', JSON.stringify([
    'Full gym floor access', 'Unlimited group classes', 'Locker room access', 'Cancel anytime',
  ]));
  insertPlan.run('Quarterly', 129, '3 months', JSON.stringify([
    'Everything in Monthly', '1 free personal training session', 'Guest pass x2', 'Save 12% vs monthly',
  ]));
  insertPlan.run('Annual', 449, '12 months', JSON.stringify([
    'Everything in Quarterly', '4 free personal training sessions', 'Nutrition consultation', 'Save 24% vs monthly', 'Free merch pack',
  ]));

  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_user (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);

  console.log('Seed complete.');
  console.log('Admin login -> username: admin | password: admin123');
} else {
  console.log('Database already has data, skipping seed.');
}
