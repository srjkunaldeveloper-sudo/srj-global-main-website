import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user || { name: 'Admin' }));
        navigate('/admin');
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden font-sans">
      {/* Subtle minimalist gradient background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.04)] relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">SRJ Global</h2>
          <p className="text-slate-400 text-sm font-medium">Control Panel Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@srjglobal.com"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
