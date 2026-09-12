import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import api from '../../config/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [debugToken, setDebugToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (response.data && response.data.debugResetToken) {
        setDebugToken(response.data.debugResetToken);
      }
    } catch (err) {
      console.error("Forgot password request error:", err);
      // Anti-user enumeration: even on error, show general messaging unless network crash
      setError(err.response?.data?.message || 'Unable to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.04)] relative z-10">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Reset Password</h2>
          <p className="text-slate-400 text-xs font-medium">
            Enter your account email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>If an account exists for that email, reset instructions have been sent.</span>
            </div>

            {debugToken && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Development Fast-Track Token:</span>
                <p className="break-all text-slate-500">{debugToken}</p>
                <button
                  onClick={() => navigate(`/admin/reset-password?token=${debugToken}`)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline block"
                >
                  Proceed to Reset Page →
                </button>
              </div>
            )}

            <button
              onClick={() => { setSubmitted(false); setEmail(''); setDebugToken(null); }}
              className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
            >
              Request Another Reset
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs text-center font-medium">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
