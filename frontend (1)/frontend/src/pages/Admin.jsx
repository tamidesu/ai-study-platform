import { useEffect, useState } from 'react'
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
            className={`px-4 py-2 text-sm font-display font-medium rounded-lg transition-all ${
              tab === t ? 'bg-spark-500 text-white shadow-lg shadow-spark-500/20' : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="card p-4 h-16 skeleton" />)}
        </div>
      ) : (
        <>
          {/* Users */}
          {tab === 'Users' && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-ink-700/50">
                    <tr>
                      {['Username', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/30">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-ink-700/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink-100">{u.username}</td>
                        <td className="px-4 py-3 text-ink-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-cyan'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.is_blocked ? 'badge-red' : 'badge-green'}`}>
                            {u.is_blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-500 text-xs">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => toggleBlock(u.id, u.is_blocked)}
                              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                                u.is_blocked
                                  ? 'text-green-400 border-green-500/30 hover:bg-green-500/10'
                                  : 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                              }`}
                            >
                              {u.is_blocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {tab === 'Notes' && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-ink-700/50">
                    <tr>
                      {['Title', 'Owner', 'Created', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/30">
                    {notes.map(n => (
                      <tr key={n.id} className="hover:bg-ink-700/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink-100 max-w-xs truncate">{n.title}</td>
                        <td className="px-4 py-3 text-ink-400">{n.owner_username || n.owner}</td>
                        <td className="px-4 py-3 text-ink-500 text-xs">{new Date(n.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteNote(n.id)} className="text-xs text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Logs */}
          {tab === 'AI Logs' && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-ink-700/50">
                    <tr>
                      {['User', 'Prompt', 'Model', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-ink-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/30">
                    {aiLogs.map(r => (
                      <tr key={r.id} className="hover:bg-ink-700/20 transition-colors">
                        <td className="px-4 py-3 text-ink-300">{r.user_username || r.user}</td>
                        <td className="px-4 py-3 text-ink-400 max-w-xs truncate">{r.prompt}</td>
                        <td className="px-4 py-3 text-ink-500 font-mono text-xs">{r.model_used}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${r.status === 'success' ? 'badge-green' : 'badge-red'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
