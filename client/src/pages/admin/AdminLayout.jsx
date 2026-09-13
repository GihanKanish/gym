import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'home', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'calendar' },
  { to: '/admin/classes', label: 'Classes', icon: 'grid' },
  { to: '/admin/trainers', label: 'Trainers', icon: 'user' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'mail' },
];

const ICONS = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
};

function Icon({ name }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function AdminLayout() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function poll() {
      try {
        const data = await api.get('/dashboard/summary', true);
        if (active) setPendingCount(data.pendingCount);
      } catch {
        /* ignore transient poll errors */
      }
    }
    poll();
    const interval = setInterval(poll, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-ink-950 font-sans flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-ink-700 bg-ink-900 p-5">
        <div className="font-display text-xl text-white mb-8">
          IRON<span className="text-volt-500">CORE</span>
          <p className="text-zinc-500 text-xs font-sans font-normal mt-1">Staff Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm relative ${
                  isActive ? 'bg-volt-500 text-ink-950' : 'text-zinc-300 hover:bg-ink-800'
                }`
              }
            >
              <Icon name={item.icon} />
              {item.label}
              {item.to === '/admin/bookings' && pendingCount > 0 && (
                <span className="ml-auto bg-ember-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-700 pt-4">
          <p className="text-zinc-500 text-xs mb-3">Signed in as {username || 'admin'}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-zinc-400 hover:text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-ink-800"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-ink-900 border-b border-ink-700 h-14 flex items-center justify-between px-4">
        <span className="font-display text-white text-lg">
          IRON<span className="text-volt-500">CORE</span>
        </span>
        <button onClick={handleLogout} className="text-zinc-400 text-sm font-semibold">
          Log Out
        </button>
      </div>

      <div className="flex-1 md:pb-0 pb-20 pt-14 md:pt-0 overflow-x-hidden">
        <Outlet context={{ pendingCount }} />
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-900 border-t border-ink-700 flex">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative ${
                isActive ? 'text-volt-500' : 'text-zinc-500'
              }`
            }
          >
            <Icon name={item.icon} />
            <span className="text-[10px] font-semibold">{item.label}</span>
            {item.to === '/admin/bookings' && pendingCount > 0 && (
              <span className="absolute top-1 right-1/4 bg-ember-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
