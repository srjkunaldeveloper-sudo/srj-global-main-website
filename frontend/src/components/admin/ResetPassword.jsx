import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../config/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token: token.trim(),
        newPassword,
      });

      if (response.data && response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data?.message || 'Password reset failed.');
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || 'Invalid or expired token. Please request a new reset link.');
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
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Set New Password</h2>
          <p className="text-slate-400 text-xs font-medium">
            Enter your reset token and your new account password below.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>Password reset successfully! You can now log in with your new credentials.</span>
            </div>

            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste reset token here"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
