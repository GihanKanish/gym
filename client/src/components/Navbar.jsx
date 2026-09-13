import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/classes', label: 'Classes' },
  { to: '/schedule', label: 'Book a Class' },
  { to: '/membership', label: 'Membership' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink-950/95 backdrop-blur border-b border-ink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-xl md:text-2xl tracking-tight text-white" onClick={() => setOpen(false)}>
          IRON<span className="text-volt-500">CORE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-semibold text-sm uppercase tracking-wide transition-colors ${
                  isActive ? 'text-volt-500' : 'text-zinc-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/schedule"
            className="bg-ember-500 hover:bg-ember-600 text-white font-bold text-sm uppercase tracking-wide px-5 py-2.5 rounded-full transition-colors"
          >
            Book Now
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-ink-900 border-t border-ink-700 px-4 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-semibold uppercase tracking-wide py-3.5 px-2 rounded-lg text-base ${
                  isActive ? 'text-volt-500 bg-ink-800' : 'text-zinc-200'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
