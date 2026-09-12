import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, CheckCircle, XCircle, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import api from '../../config/api';

export default function AdminUserManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form states
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [modalError, setModalError] = useState('');
  const [resetModalError, setResetModalError] = useState('');
  const [overridePassword, setOverridePassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/admins');
      if (res.data && Array.isArray(res.data.admins)) {
        setAdmins(res.data.admins);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching admin accounts:", err);
      setError(err.response?.data?.message || "Failed to load admin accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    if (!newAdmin.name.trim()) {
      setModalError('Full name is required.');
      setSubmitting(false);
      return;
    }
    if (!newAdmin.email.trim()) {
      setModalError('Email address is required.');
      setSubmitting(false);
      return;
    }
    if (newAdmin.password.length < 6) {
      setModalError('Password must be at least 6 characters long.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/auth/create-admin', newAdmin);
      notify('success', res.data.message || 'Admin account created successfully!');
      setShowCreateModal(false);
      setModalError('');
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create admin account.';
      setModalError(msg);
      notify('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (admin, newRole) => {
    if (admin.role === newRole) return;
    try {
      const res = await api.put(`/auth/admins/${admin.id}/role`, { role: newRole });
      notify('success', res.data.message || `Role updated to ${newRole === 'super_admin' ? 'Super Admin' : 'Admin'}`);
      fetchAdmins();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleResetPasswordOverride = async (e) => {
    e.preventDefault();
    if (!selectedAdmin || !overridePassword) return;
    setSubmitting(true);
    try {
      const res = await api.post('/auth/reset-admin-password', {
        userId: selectedAdmin.id,
        newPassword: overridePassword,
      });
      notify('success', res.data.message || 'Password updated successfully!');
      setShowResetModal(false);
      setSelectedAdmin(null);
      setOverridePassword('');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      const res = await api.put(`/auth/admins/${admin.id}/toggle`);
      notify('success', res.data.message || 'Account status updated.');
      fetchAdmins();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update account status.');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure you want to delete admin account ${admin.email}?`)) return;
    try {
      const res = await api.delete(`/auth/admins/${admin.id}`);
      notify('success', res.data.message || 'Admin account deleted.');
      fetchAdmins();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="text-blue-600" size={22} />
            Super Admin User Management
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage administrative user roles, access states, and credentials across the organization.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black font-bold text-white text-xs transition-all cursor-pointer shadow-sm"
        >
          <Plus size={16} /> New Admin Account
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-2xl text-sm font-medium border flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
            Loading administrative accounts...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No administrative users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{admin.name}</div>
                      <div className="text-xs text-slate-400">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={admin.role}
                        onChange={(e) => handleRoleChange(admin, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all ${
                          admin.role === 'super_admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300'
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        admin.is_active !== 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.is_active !== 0 ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {admin.is_active !== 0 ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(admin.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedAdmin(admin); setShowResetModal(true); setResetModalError(''); }}
                          title="Override Password"
                          className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          title={admin.is_active !== 0 ? 'Deactivate Account' : 'Activate Account'}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          {admin.is_active !== 0 ? <XCircle size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          title="Delete Account"
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Admin Account */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Create New Administrative Account</h3>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{modalError}</span>
              </div>
            )}
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input
                  type="text" required value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                <input
                  type="email" required value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="sarah@srjglobal.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                <input
                  type="password" required minLength={6} value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                >
                  <option value="admin">Admin (CMS & Operations)</option>
                  <option value="super_admin">Super Admin (Full Rights + User Management)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-black cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Super Admin Password Override */}
      {showResetModal && selectedAdmin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Override Password for {selectedAdmin.name}</h3>
            <p className="text-xs text-slate-500">
              As Super Admin, you can manually set a new password for this administrative user.
            </p>
            <form onSubmit={handleResetPasswordOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">New Password</label>
                <input
                  type="password" required minLength={6} value={overridePassword}
                  onChange={(e) => setOverridePassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button" onClick={() => { setShowResetModal(false); setSelectedAdmin(null); setOverridePassword(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-black cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
