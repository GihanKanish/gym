import { useState } from 'react';
import { api } from '../api.js';
import { DAY_NAMES, formatDate, formatTime } from '../utils.js';

export default function BookingModal({ cls, date, onClose }) {
  const [form, setForm] = useState({ customer_name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const displayDate = date || cls.next_date;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        ...form,
        class_id: cls.id,
        date: displayDate,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-ink-900 border border-ink-700 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-volt-500/15 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-volt-500">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-white mb-2">Request Sent!</h3>
            <p className="text-zinc-400 text-sm">
              Your spot request has been sent, we&rsquo;ll confirm shortly. Check your email for updates.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-volt-500 hover:bg-volt-400 text-ink-950 font-bold px-6 py-3 rounded-full w-full"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-xl text-white">{cls.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {DAY_NAMES[cls.day_of_week]}, {formatDate(displayDate)} &middot; {formatTime(cls.start_time)}
                </p>
                <p className="text-zinc-500 text-xs mt-1">with {cls.trainer_name}</p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white p-1" aria-label="Close">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Full Name</label>
                <input
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Phone</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
                  placeholder="jane@example.com"
                />
              </div>

              {error && <p className="text-rose-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ember-500 hover:bg-ember-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full mt-2"
              >
                {submitting ? 'Sending...' : 'Request This Spot'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
