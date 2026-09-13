import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ClassCard from '../components/ClassCard.jsx';
import BookingModal from '../components/BookingModal.jsx';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get('/classes')
      .then(setClasses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl text-white mb-3">Our Classes</h1>
      <p className="text-zinc-400 max-w-2xl mb-10">
        From high-intensity intervals to restorative yoga, find the class that matches your goals. Spots are
        limited &mdash; book early to lock yours in.
      </p>

      {loading && <p className="text-zinc-500">Loading classes...</p>}
      {error && <p className="text-rose-400">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => (
          <ClassCard key={cls.id} cls={cls} onBook={setSelected} />
        ))}
      </div>

      {selected && <BookingModal cls={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
