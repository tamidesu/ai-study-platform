import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const TABS = ['Users', 'Notes', 'AI Logs']

export default function AdminPanel() {
  const [tab, setTab] = useState('Users')
  const [users, setUsers] = useState([])
  const [notes, setNotes] = useState([])
  const [aiLogs, setAiLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, nRes, aRes] = await Promise.all([
          api.get('/admin/users/'),
          api.get('/admin/notes/'),
          api.get('/admin/ai-requests/'),
        ])
        setUsers(uRes.data.results || uRes.data)
        setNotes(nRes.data.results || nRes.data)
        setAiLogs(aRes.data.results || aRes.data)
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchAll()
  }, [])

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block/`, { is_blocked: !isBlocked })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: !isBlocked } : u))
    } catch { alert('Failed to update user') }
  }

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await api.delete(`/admin/notes/${id}/`)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch { alert('Failed to delete') }
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">👑</span>
          <h1 className="section-heading">Admin Panel</h1>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Users', value: users.length, color: 'badge-cyan' },
            { label: 'Notes', value: notes.length, color: 'badge-purple' },
            { label: 'AI Requests', value: aiLogs.length, color: 'badge-green' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="font-display font-bold text-xl text-ink-50">{loading ? '...' : s.value}</div>
              <div className="text-ink-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-ink-800/50 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-display font-medium rounded-lg transition-all ${tab === t ? 'bg-spark-500 text-white shadow-lg shadow-spark-500/20' : 'text-ink-400 hover:text-ink-200'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="card p-4 h-16 skeleton" />)}
        </div>
      ) : (
        <>
          {/* Users */}
          {tab === 'Users' && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest border-b border-ink-700/50">
                <div className="col-span-12 sm:col-span-3">User</div>
                <div className="col-span-12 sm:col-span-3">Role & Status</div>
                <div className="col-span-12 sm:col-span-3">Joined</div>
                <div className="col-span-12 sm:col-span-3 text-right">Actions</div>
              </div>
              <AnimatePresence>
                {users.map((u, i) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="card p-4 grid grid-cols-12 gap-4 items-center bg-surface/60 hover:bg-surface/90 transition-colors"
                  >
                    <div className="col-span-12 sm:col-span-3">
                      <div className="font-display font-bold text-ink-100">{u.username}</div>
                      <div className="text-ink-500 text-xs truncate pr-4">{u.email}</div>
                    </div>
                    <div className="col-span-12 sm:col-span-3 flex flex-wrap gap-2">
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-cyan'}`}>{u.role}</span>
                      <span className={`badge ${u.is_blocked ? 'badge-red' : 'badge-green'}`}>{u.is_blocked ? 'Blocked' : 'Active'}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-3 text-ink-400 text-sm">
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-12 sm:col-span-3 flex justify-end">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleBlock(u.id, u.is_blocked)}
                          className={`btn-ghost text-xs px-3 py-1.5 ${u.is_blocked ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                        >
                          {u.is_blocked ? 'Unblock' : 'Block User'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Notes */}
          {tab === 'Notes' && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest border-b border-ink-700/50">
                <div className="col-span-12 sm:col-span-5">Title</div>
                <div className="col-span-12 sm:col-span-3">Owner</div>
                <div className="col-span-12 sm:col-span-2">Created</div>
                <div className="col-span-12 sm:col-span-2 text-right">Actions</div>
              </div>
              <AnimatePresence>
                {notes.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="card p-4 grid grid-cols-12 gap-4 items-center bg-surface/60 hover:bg-surface/90 transition-colors"
                  >
                    <div className="col-span-12 sm:col-span-5 font-medium text-ink-100 truncate pr-4">
                      {n.title}
                    </div>
                    <div className="col-span-12 sm:col-span-3 text-ink-400 text-sm truncate pr-4">
                      {n.owner_username || n.owner}
                    </div>
                    <div className="col-span-12 sm:col-span-2 text-ink-500 text-sm">
                      {new Date(n.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="btn-danger text-xs px-3 py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* AI Logs */}
          {tab === 'AI Logs' && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest border-b border-ink-700/50">
                <div className="col-span-12 sm:col-span-2">User</div>
                <div className="col-span-12 sm:col-span-4">Prompt</div>
                <div className="col-span-12 sm:col-span-3">Model</div>
                <div className="col-span-12 sm:col-span-2">Status</div>
                <div className="col-span-12 sm:col-span-1">Date</div>
              </div>
              <AnimatePresence>
                {aiLogs.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="card p-4 grid grid-cols-12 gap-4 items-center bg-surface/60 hover:bg-surface/90 transition-colors"
                  >
                    <div className="col-span-12 sm:col-span-2 text-ink-300 text-sm truncate pr-2">
                      {r.user_username || r.user}
                    </div>
                    <div className="col-span-12 sm:col-span-4 text-ink-400 text-sm truncate pr-4" title={r.prompt}>
                      {r.prompt}
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <span className="badge-ink font-mono text-xs">{r.model_used}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <span className={`badge ${r.status === 'success' ? 'badge-green' : 'badge-red'}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="col-span-12 sm:col-span-1 text-ink-500 text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  )
}
