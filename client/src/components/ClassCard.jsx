import Pill from './Pill.jsx';
import { DAY_NAMES, DIFFICULTY_COLORS, formatTime } from '../utils.js';

export default function ClassCard({ cls, onBook }) {
  const full = cls.spots_left <= 0;
  const low = cls.spots_left > 0 && cls.spots_left <= 4;

  return (
    <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5 flex flex-col gap-4 hover:border-volt-500/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-white leading-tight">{cls.name}</h3>
          <p className="text-zinc-400 text-sm mt-1">with {cls.trainer_name}</p>
        </div>
        <Pill className={DIFFICULTY_COLORS[cls.difficulty_level] || DIFFICULTY_COLORS['All Levels']}>
          {cls.difficulty_level}
        </Pill>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300">
        <span>{DAY_NAMES[cls.day_of_week]}</span>
        <span>&middot;</span>
        <span>{formatTime(cls.start_time)}</span>
        <span>&middot;</span>
        <span>{cls.duration_minutes} min</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-ink-700">
        <span
          className={`text-sm font-semibold ${
            full ? 'text-rose-400' : low ? 'text-amber-400' : 'text-emerald-400'
          }`}
        >
          {full ? 'Full' : `${cls.spots_left} spots left`}
        </span>
        {onBook && (
          <button
            onClick={() => onBook(cls)}
            disabled={full}
            className="bg-volt-500 hover:bg-volt-400 disabled:bg-ink-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-ink-950 font-bold text-sm px-4 py-2 rounded-full transition-colors"
          >
            {full ? 'Full' : 'Book Spot'}
          </button>
        )}
      </div>
    </div>
  );
}
