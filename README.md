# IronCore Gym

A full-stack gym website with class scheduling/booking and an owner/trainer admin dashboard.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (file-based, `server/data/gym.db`, created automatically)

## Quick Start

```bash
npm install
npm run dev
```

This installs dependencies for both the client and server (npm workspaces) and starts them together:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5050](http://localhost:5050/api/health)

The Vite dev server proxies `/api/*` requests to the backend, so you only need to open `http://localhost:5173`.

On first run, the database is created and seeded automatically with sample data (see below). To re-seed manually at any time:

```bash
npm run seed
```

(Seeding is a no-op if the database already has data — delete `server/data/gym.db*` first if you want a full reset.)

## Demo Credentials

**Admin / trainer dashboard login** — go to `/admin/login` (or click "Staff Login" in the site footer):

```
Username: admin
Password: admin123
```

## What's Included

### Customer-facing site
- **Home** — hero, about, facilities, membership overview, trainer profiles, testimonials, hours/location/contact
- **Classes** (`/classes`) — all classes with trainer, day/time, duration, difficulty, live spots-left
- **Book a Class** (`/schedule`) — weekly calendar grid; click a class to request a spot (name, phone, email). Requests are submitted as `pending` and shown with a confirmation message
- **Membership** (`/membership`) — Monthly / Quarterly / Annual plans with an "Enquire Now" contact form (no payment processing)

### Admin / trainer dashboard (`/admin`, login required)
- **Dashboard** — today's classes, pending request count, new enquiries, this week's occupancy at a glance
- **Bookings** — confirm/decline pending requests (confirming instantly reduces spots for that class/date), filter by class/date/status, cancel confirmed bookings
- **Classes** — add/edit/delete classes (trainer, day, time, duration, capacity, difficulty)
- **Trainers** — add/edit/delete trainer profiles (name, bio, photo URL)
- **Enquiries** — view membership enquiries, mark as contacted/converted
- Mobile-first layout with a bottom tab bar and large tap targets, so a trainer can manage bookings from a phone between sessions
- The pending-bookings badge refreshes every 30 seconds

## Sample Seed Data

- 4 trainers (Maya Chen, Jordan Blake, Sofia Ramirez, Marcus Webb)
- 9 classes across the week (Yoga, HIIT, Zumba, Strength Training, Spin)
- 3 membership plans (Monthly $49, Quarterly $129, Annual $449)
- 1 admin login (`admin` / `admin123`)

## Project Structure

```
GYM/
├── server/                 # Express + SQLite API
│   ├── src/
│   │   ├── routes/         # auth, classes, bookings, trainers, plans, enquiries, dashboard
│   │   ├── middleware/      # JWT auth
│   │   ├── utils/           # date helpers
│   │   ├── db.js            # SQLite connection + schema
│   │   ├── seed.js          # sample data
│   │   └── index.js         # app entry
│   └── data/gym.db          # SQLite file (created at runtime, gitignored)
├── client/                 # React + Vite + Tailwind
│   └── src/
│       ├── pages/            # public pages + admin/ subfolder
│       ├── components/
│       └── context/          # auth context (JWT stored in localStorage)
└── package.json             # npm workspaces root — runs both apps together
```

## Database Schema

- `classes (id, name, trainer_id, day_of_week, start_time, duration_minutes, capacity, difficulty_level)`
- `bookings (id, customer_name, phone, email, class_id, date, status, created_at)` — status: `pending | confirmed | declined | cancelled`
- `trainers (id, name, bio, photo_url)`
- `membership_plans (id, name, price, duration, features)` — features stored as JSON
- `enquiries (id, name, phone, email, plan_id, message, status, created_at)` — status: `new | contacted | converted`
- `admin_user (id, username, password_hash)` — password hashed with bcrypt

## Notes

- Capacity is enforced against **confirmed** bookings only — a pending request doesn't hold a spot until the admin confirms it, and the admin dashboard shows real-time spots-left per class/date.
- Notifications are in-app only for v1 (dashboard badge + polling) — no SMS/email, as noted in the spec as a v2 item.
- The backend port defaults to `5050` (set `SERVER_PORT` to change it); the frontend dev port is `5173` (Vite config).
