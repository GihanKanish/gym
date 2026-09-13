import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api.js';
import Pill from '../../components/Pill.jsx';
import { DAY_NAMES, DIFFICULTY_COLORS, formatTime } from '../../utils.js';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const BLANK = { name: '', trainer_id: '', day_of_week: 1, start_time: '18:00', duration_minutes: 60, capacity: 20, difficulty_level: 'All Levels' };

function ClassFormModal({ initial, trainers, onClose, onSaved }) {
  const [form, setForm] = useState(initial || BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initial?.id;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        trainer_id: form.trainer_id ? Number(form.trainer_id) : null,
        day_of_week: Number(form.day_of_week),
        duration_minutes: Number(form.duration_minutes),
        capacity: Number(form.capacity),
      };
      if (isEdit) await api.put(`/classes/${initial.id}`, payload, true);
      else await api.post('/classes', payload, true);
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
        <h3 className="font-display text-xl text-white mb-4">{isEdit ? 'Edit Class' : 'Add Class'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Class Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Trainer</label>
            <select
              value={form.trainer_id || ''}
              onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
            >
              <option value="">Unassigned</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Day</label>
              <select
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
              >
                {DAY_NAMES.map((d, i) => (
                  <option key={d} value={i}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Start Time</label>
              <input
                required
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Duration (min)</label>
              <input
                required
                type="number"
                min="15"
                step="5"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Capacity</label>
              <input
                required
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Difficulty Level</label>
            <select
              value={form.difficulty_level}
              onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
              className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-rose-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-ink-700 text-white font-bold py-3.5 rounded-full">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-volt-500 hover:bg-volt-400 disabled:opacity-60 text-ink-950 font-bold py-3.5 rounded-full">
              {saving ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClassesManage() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null); // null | 'new' | classObj

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cls, trn] = await Promise.all([api.get('/classes'), api.get('/trainers')]);
      setClasses(cls);
      setTrainers(trn);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!confirm('Delete this class? This cannot be undone.')) return;
    await api.del(`/classes/${id}`, true);
    load();
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl md:text-3xl text-white">Class Schedule</h1>
        <button
          onClick={() => setModalState('new')}
          className="bg-volt-500 hover:bg-volt-400 text-ink-950 font-bold text-sm px-5 py-2.5 rounded-full"
        >
          + Add Class
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading classes...</p>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div key={c.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold">{c.name}</p>
                  <Pill className={DIFFICULTY_COLORS[c.difficulty_level]}>{c.difficulty_level}</Pill>
                </div>
                <p className="text-zinc-400 text-sm">
                  {DAY_NAMES[c.day_of_week]} &middot; {formatTime(c.start_time)} &middot; {c.duration_minutes} min &middot; cap {c.capacity}
                </p>
                <p className="text-zinc-500 text-xs mt-1">Trainer: {c.trainer_name}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setModalState(c)}
                  className="bg-ink-700 hover:bg-ink-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-ink-700 hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState && (
        <ClassFormModal
          initial={modalState === 'new' ? null : modalState}
          trainers={trainers}
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
