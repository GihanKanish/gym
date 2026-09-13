import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api.js';
import Pill from '../../components/Pill.jsx';
import { STATUS_COLORS, formatDate, formatTime } from '../../utils.js';

export default function BookingsManage() {
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', class_id: '', date: '' });
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.class_id) params.set('class_id', filters.class_id);
    if (filters.date) params.set('date', filters.date);
    try {
      const data = await api.get(`/bookings?${params.toString()}`, true);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    api.get('/classes').then(setClasses).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id, status) {
    setActingId(id);
    try {
      await api.patch(`/bookings/${id}`, { status }, true);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <h1 className="font-display text-2xl md:text-3xl text-white mb-6">Class Bookings</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-white text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filters.class_id}
          onChange={(e) => setFilters({ ...filters, class_id: e.target.value })}
          className="bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-white text-sm"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-white text-sm"
        />
        {(filters.status || filters.class_id || filters.date) && (
          <button
            onClick={() => setFilters({ status: '', class_id: '', date: '' })}
            className="text-zinc-400 hover:text-white text-sm px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-zinc-500">No bookings match these filters.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4 md:flex md:items-center md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold">{b.customer_name}</p>
                  <Pill className={STATUS_COLORS[b.status]}>{b.status}</Pill>
                </div>
                <p className="text-zinc-400 text-sm">{b.class_name} &middot; {formatDate(b.date)}</p>
                <p className="text-zinc-500 text-xs mt-1">{b.phone} &middot; {b.email}</p>
              </div>
              {b.status === 'pending' && (
                <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
                  <button
                    disabled={actingId === b.id}
                    onClick={() => updateStatus(b.id, 'confirmed')}
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full"
                  >
                    Confirm
                  </button>
                  <button
                    disabled={actingId === b.id}
                    onClick={() => updateStatus(b.id, 'declined')}
                    className="flex-1 md:flex-none bg-ink-700 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full"
                  >
                    Decline
                  </button>
                </div>
              )}
              {b.status === 'confirmed' && (
                <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
                  <button
                    disabled={actingId === b.id}
                    onClick={() => updateStatus(b.id, 'cancelled')}
                    className="bg-ink-700 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
