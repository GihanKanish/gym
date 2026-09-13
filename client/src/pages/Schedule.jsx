import { useEffect, useState } from 'react';
import { api } from '../api.js';
import BookingModal from '../components/BookingModal.jsx';
import Pill from '../components/Pill.jsx';
import { DAY_SHORT, DIFFICULTY_COLORS, formatDate, formatTime } from '../utils.js';

export default function Schedule() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [data, setData] = useState({ dates: [], classes: [] });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/classes/schedule?weekOffset=${weekOffset}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [weekOffset]);

  const byDay = Array.from({ length: 7 }, (_, dow) =>
    data.classes.filter((c) => c.day_of_week === dow).sort((a, b) => a.start_time.localeCompare(b.start_time))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-5xl text-white mb-2">Weekly Schedule</h1>
          <p className="text-zinc-400">Tap a class to request your spot.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="bg-ink-800 border border-ink-700 hover:border-volt-500 text-white w-11 h-11 rounded-full flex items-center justify-center"
            aria-label="Previous week"
          >
            &larr;
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="bg-ink-800 border border-ink-700 hover:border-volt-500 text-zinc-300 px-4 h-11 rounded-full text-sm font-semibold"
          >
            This Week
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="bg-ink-800 border border-ink-700 hover:border-volt-500 text-white w-11 h-11 rounded-full flex items-center justify-center"
            aria-label="Next week"
          >
            &rarr;
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading schedule...</p>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-7 gap-3 min-w-[980px]">
            {byDay.map((dayClasses, dow) => (
              <div key={dow} className="flex flex-col gap-3">
                <div className="text-center">
                  <p className="text-white font-bold uppercase text-sm">{DAY_SHORT[dow]}</p>
                  <p className="text-zinc-500 text-xs">{data.dates[dow] ? formatDate(data.dates[dow]).split(', ')[1] : ''}</p>
                </div>
                {dayClasses.length === 0 && (
                  <div className="text-zinc-600 text-xs text-center py-6 border border-dashed border-ink-700 rounded-xl">
                    No classes
                  </div>
                )}
                {dayClasses.map((cls) => {
                  const full = cls.spots_left <= 0;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => !full && setSelected(cls)}
                      disabled={full}
                      className={`text-left bg-ink-800 border rounded-xl p-3 transition-colors ${
                        full ? 'border-ink-700 opacity-50 cursor-not-allowed' : 'border-ink-700 hover:border-volt-500'
                      }`}
                    >
                      <p className="text-white font-bold text-sm leading-tight">{cls.name}</p>
                      <p className="text-zinc-500 text-xs mt-1">{formatTime(cls.start_time)}</p>
                      <p className="text-zinc-500 text-xs">{cls.trainer_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Pill className={`${DIFFICULTY_COLORS[cls.difficulty_level]} text-[10px] px-2 py-0.5`}>
                          {cls.difficulty_level}
                        </Pill>
                        <span className={`text-xs font-semibold ${full ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {full ? 'Full' : `${cls.spots_left} left`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && <BookingModal cls={selected} date={selected.date} onClose={() => setSelected(null)} />}
    </div>
  );
}
