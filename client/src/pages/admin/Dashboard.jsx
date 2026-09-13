import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { formatTime } from '../../utils.js';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api.get('/dashboard/summary', true);
        if (active) setSummary(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div className="p-4 md:p-8 text-zinc-500">Loading dashboard...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <h1 className="font-display text-2xl md:text-3xl text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/bookings" className="bg-ink-800 border border-ink-700 rounded-2xl p-5 hover:border-volt-500/40">
          <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold">Pending Requests</p>
          <p className="text-4xl font-display text-ember-500 mt-2">{summary.pendingCount}</p>
        </Link>
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold">Today&rsquo;s Classes</p>
          <p className="text-4xl font-display text-volt-500 mt-2">{summary.todaysClasses.length}</p>
        </div>
        <Link to="/admin/enquiries" className="bg-ink-800 border border-ink-700 rounded-2xl p-5 hover:border-volt-500/40 col-span-2 md:col-span-1">
          <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold">New Enquiries</p>
          <p className="text-4xl font-display text-sky-400 mt-2">{summary.newEnquiries}</p>
        </Link>
      </div>

      <h2 className="text-white font-bold text-lg mb-3">Today&rsquo;s Classes</h2>
      <div className="space-y-2 mb-8">
        {summary.todaysClasses.length === 0 && <p className="text-zinc-500 text-sm">No classes scheduled today.</p>}
        {summary.todaysClasses.map((c) => (
          <div key={c.id} className="bg-ink-800 border border-ink-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{c.name}</p>
              <p className="text-zinc-500 text-sm">{formatTime(c.start_time)} &middot; {c.trainer_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-400">{c.confirmed}/{c.capacity}</p>
              <p className="text-zinc-500 text-xs">{c.spots_left} left</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-lg mb-3">This Week&rsquo;s Occupancy</h2>
      <div className="bg-ink-800 border border-ink-700 rounded-2xl overflow-hidden">
        {summary.weekOccupancy.map((c, i) => (
          <div
            key={c.id}
            className={`flex items-center gap-4 p-4 ${i !== summary.weekOccupancy.length - 1 ? 'border-b border-ink-700' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{c.name}</p>
              <p className="text-zinc-500 text-xs">{formatTime(c.start_time)}</p>
            </div>
            <div className="flex-1 max-w-[140px]">
              <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.occupancy_pct >= 90 ? 'bg-rose-500' : c.occupancy_pct >= 60 ? 'bg-amber-500' : 'bg-volt-500'}`}
                  style={{ width: `${Math.min(100, c.occupancy_pct)}%` }}
                />
              </div>
            </div>
            <p className="text-zinc-400 text-sm w-16 text-right shrink-0">{c.confirmed}/{c.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
