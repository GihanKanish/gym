import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-white">
            IRON<span className="text-volt-500">CORE</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Staff &amp; Trainer Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ink-800 border border-ink-700 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Username</label>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-volt-500"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          {error && <p className="text-rose-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-volt-500 hover:bg-volt-400 disabled:opacity-60 text-ink-950 font-bold py-3.5 rounded-full"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-4">
          Demo credentials: <span className="text-zinc-400">admin / admin123</span>
        </p>
      </div>
    </div>
  );
}
