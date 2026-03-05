import { useState } from 'react'
import { useAuth } from '../store/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile/', form)
      login(data, {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
      })
      setSuccess('Profile updated successfully!')
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl animate-fade-in relative z-10">
      <div className="mb-8">
        <p className="text-secondary-500 text-sm font-display font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span> SETTINGS
        </p>
        <h1 className="section-title text-4xl">Profile</h1>
        <p className="text-ink-400 text-sm mt-2">Manage your account information and preferences.</p>
      </div>

      <div className="card p-8 border-t-4 border-t-primary-500 relative overflow-hidden bg-surface/80">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-ink-700/50 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-display font-bold text-white shadow-xl shadow-primary-500/30 ring-4 ring-bg">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-ink-50 mb-1">{user?.username}</h2>
            <div className="flex items-center gap-3">
              <p className="text-ink-400 text-sm">{user?.email}</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user?.role === 'admin' ? 'bg-secondary-500/10 text-secondary-500' : 'bg-primary-500/10 text-primary-500'}`}>
                {user?.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {success && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3 animate-slide-up">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 animate-slide-up">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input-field bg-surface/50"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input-field bg-surface/50"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ink-700/30 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary shadow-primary-500/25 px-8">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" /></svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
