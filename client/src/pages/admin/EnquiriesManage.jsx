import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api.js';
import Pill from '../../components/Pill.jsx';
import { STATUS_COLORS, formatDate } from '../../utils.js';

export default function EnquiriesManage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    try {
      setEnquiries(await api.get(`/enquiries${params}`, true));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id, status) {
    setActingId(id);
    try {
      await api.patch(`/enquiries/${id}`, { status }, true);
      await load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <h1 className="font-display text-2xl md:text-3xl text-white mb-6">Membership Enquiries</h1>

      <div className="flex gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-white text-sm"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-zinc-500">No enquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4 md:flex md:items-center md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold">{e.name}</p>
                  <Pill className={STATUS_COLORS[e.status]}>{e.status}</Pill>
                  {e.plan_name && <Pill className="bg-ink-700 text-zinc-300 border-ink-600">{e.plan_name} Plan</Pill>}
                </div>
                <p className="text-zinc-500 text-xs">{e.phone} &middot; {e.email}</p>
                {e.message && <p className="text-zinc-400 text-sm mt-2 italic">&ldquo;{e.message}&rdquo;</p>}
                <p className="text-zinc-600 text-xs mt-1">{formatDate(e.created_at.slice(0, 10))}</p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
                {e.status !== 'contacted' && (
                  <button
                    disabled={actingId === e.id}
                    onClick={() => updateStatus(e.id, 'contacted')}
                    className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-ink-950 font-bold text-sm px-4 py-2.5 rounded-full"
                  >
                    Mark Contacted
                  </button>
                )}
                {e.status !== 'converted' && (
                  <button
                    disabled={actingId === e.id}
                    onClick={() => updateStatus(e.id, 'converted')}
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-full"
                  >
                    Mark Converted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
