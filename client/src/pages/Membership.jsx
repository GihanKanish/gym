import { useEffect, useState } from 'react';
import { api } from '../api.js';
import EnquiryModal from '../components/EnquiryModal.jsx';

export default function Membership() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/plans').then(setPlans).catch(() => {});
  }, []);

  function openEnquiry(plan) {
    setSelectedPlan(plan);
    setShowModal(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl text-white mb-3">Membership Plans</h1>
      <p className="text-zinc-400 max-w-2xl mb-10">
        Simple, transparent pricing. No hidden fees. Choose the plan that fits your commitment level.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <div
            key={p.id}
            className={`rounded-2xl p-7 flex flex-col border ${
              i === 1
                ? 'bg-gradient-to-b from-ember-500/10 to-ink-800 border-ember-500/40 md:scale-105'
                : 'bg-ink-800 border-ink-700'
            }`}
          >
            {i === 1 && (
              <span className="self-start bg-ember-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
                Most Popular
              </span>
            )}
            <h3 className="font-display text-2xl text-white">{p.name}</h3>
            <p className="mt-3">
              <span className="text-4xl font-bold text-volt-500">${p.price}</span>
              <span className="text-zinc-500"> / {p.duration}</span>
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="text-zinc-300 text-sm flex gap-2">
                  <span className="text-volt-500 font-bold">&#10003;</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => openEnquiry(p)}
              className="mt-6 bg-volt-500 hover:bg-volt-400 text-ink-950 font-bold py-3 rounded-full w-full"
            >
              Enquire Now
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-14">
        <p className="text-zinc-500 mb-3">Not sure which plan is right for you?</p>
        <button
          onClick={() => openEnquiry(null)}
          className="border-2 border-white/20 hover:border-volt-500 text-white font-bold px-7 py-3 rounded-full uppercase tracking-wide text-sm"
        >
          Ask Us Anything
        </button>
      </div>

      {showModal && <EnquiryModal plan={selectedPlan} onClose={() => setShowModal(false)} />}
    </div>
  );
}
