import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api.js';

const BLANK = { name: '', bio: '', photo_url: '' };

function TrainerFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initial?.id;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) await api.put(`/trainers/${initial.id}`, form, true);
      else await api.post('/trainers', form, true);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-ink-900 border border-ink-700 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl text-white mb-4">{isEdit ? 'Edit Trainer' : 'Add Trainer'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Photo URL</label>
            <input
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              placeholder="https://..."
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
            />
          </div>

          {error && <p className="text-rose-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-ink-700 text-white font-bold py-3.5 rounded-full">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-volt-500 hover:bg-volt-400 disabled:opacity-60 text-ink-950 font-bold py-3.5 rounded-full">
              {saving ? 'Saving...' : 'Save Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrainersManage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTrainers(await api.get('/trainers'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!confirm('Delete this trainer? Classes assigned to them will show as unassigned.')) return;
    await api.del(`/trainers/${id}`, true);
    load();
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl md:text-3xl text-white">Trainer Profiles</h1>
        <button
          onClick={() => setModalState('new')}
          className="bg-volt-500 hover:bg-volt-400 text-ink-950 font-bold text-sm px-5 py-2.5 rounded-full"
        >
          + Add Trainer
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading trainers...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {trainers.map((t) => (
            <div key={t.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-5 flex gap-4">
              <img src={t.photo_url} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 bg-ink-700" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-zinc-500 text-sm line-clamp-2 mt-1">{t.bio}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setModalState(t)} className="bg-ink-700 hover:bg-ink-600 text-white text-xs font-semibold px-4 py-2 rounded-full">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="bg-ink-700 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-full">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState && (
        <TrainerFormModal
          initial={modalState === 'new' ? null : modalState}
          onClose={() => setModalState(null)}
          onSaved={() => {
            setModalState(null);
            load();
          }}
        />
      )}
    </div>
  );
}
