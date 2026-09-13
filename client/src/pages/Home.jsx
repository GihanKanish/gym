import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const FACILITIES = [
  { title: 'Free Weights Zone', desc: 'Full range of dumbbells, barbells, and power racks.' },
  { title: 'Cardio Deck', desc: 'Treadmills, rowers, bikes, and stair climbers with city views.' },
  { title: 'Functional Turf', desc: 'Open turf area for sleds, battle ropes, and plyo work.' },
  { title: 'Recovery Lounge', desc: 'Stretch zone, foam rollers, and massage chairs.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', quote: 'IronCore changed how I train. The trainers actually watch your form and push you.', role: 'Member since 2023' },
  { name: 'Daniel M.', quote: 'Best HIIT class in the city, hands down. I look forward to Tuesdays now.', role: 'Member since 2022' },
  { name: 'Aisha K.', quote: 'The booking system makes it so easy to grab a spot before Zumba fills up.', role: 'Member since 2024' },
];

export default function Home() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/trainers').then(setTrainers).catch(() => {});
    api.get('/plans').then(setPlans).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 border-b border-ink-700">
        <div className="absolute inset-0 bg-gradient-to-br from-ember-500/10 via-transparent to-volt-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
          <p className="text-volt-500 font-bold uppercase tracking-widest text-sm mb-4">Springfield&rsquo;s Toughest Gym</p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-white leading-[1.05] text-shadow-glow">
            TRAIN LIKE YOU<br /><span className="text-ember-500">MEAN IT</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mt-6">
            Group classes, personal training, and a community that won&rsquo;t let you quit on yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/schedule" className="bg-ember-500 hover:bg-ember-600 text-white font-bold px-7 py-3.5 rounded-full uppercase tracking-wide text-sm">
              Book a Class
            </Link>
            <Link to="/membership" className="bg-transparent border-2 border-white/20 hover:border-volt-500 text-white font-bold px-7 py-3.5 rounded-full uppercase tracking-wide text-sm">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Built for Real Results</h2>
          <p className="text-zinc-400 leading-relaxed">
            IronCore Gym opened its doors with one mission: make elite-level training accessible to everyone in
            our community. With expert trainers, energetic group classes, and a fully equipped floor, we give you
            everything you need to hit your goals &mdash; whether that&rsquo;s your first pushup or your next PR.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {FACILITIES.map((f) => (
            <div key={f.title} className="bg-ink-800 border border-ink-700 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership overview */}
      <section className="bg-ink-900 border-y border-ink-700 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl text-white">Membership Plans</h2>
            <Link to="/membership" className="text-volt-500 font-semibold text-sm uppercase tracking-wide">
              See full details &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
                <h3 className="font-display text-xl text-white">{p.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-volt-500">${p.price}</span>
                  <span className="text-zinc-500 text-sm"> / {p.duration}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-zinc-400 text-sm flex gap-2">
                      <span className="text-volt-500">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-white mb-10">Meet Your Trainers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((t) => (
            <div key={t.id} className="text-center">
              <img
                src={t.photo_url}
                alt={t.name}
                className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-ink-700"
              />
              <h3 className="text-white font-bold mt-4">{t.name}</h3>
              <p className="text-zinc-500 text-sm mt-1 line-clamp-3">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink-900 border-y border-ink-700 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-10 text-center">What Our Members Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
                <p className="text-zinc-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white font-bold mt-4">{t.name}</p>
                <p className="text-zinc-500 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Hours / Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-3 gap-8">
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
          <h3 className="text-volt-500 font-bold uppercase text-sm tracking-wide mb-3">Location</h3>
          <p className="text-zinc-300">221 Foundry Street<br />Riverside District, Springfield</p>
        </div>
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
          <h3 className="text-volt-500 font-bold uppercase text-sm tracking-wide mb-3">Hours</h3>
          <p className="text-zinc-300">Mon &ndash; Fri: 5:00 AM &ndash; 10:00 PM<br />Sat &ndash; Sun: 7:00 AM &ndash; 8:00 PM</p>
        </div>
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
          <h3 className="text-volt-500 font-bold uppercase text-sm tracking-wide mb-3">Contact</h3>
          <p className="text-zinc-300">(555) 234-9981<br />hello@ironcoregym.com</p>
        </div>
      </section>
    </div>
  );
}
