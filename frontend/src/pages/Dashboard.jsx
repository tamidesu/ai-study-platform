import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../api/axios'

const StatCard = ({ label, value, icon, color }) => (
  <div className="card p-5 border-l-4 border-transparent hover:border-l-current flex items-center gap-4 transition-all duration-300" style={{ borderLeftColor: 'inherit' }}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${color}`}>
      {icon}
    </div>
    <div>
      <div className="font-display font-bold text-3xl text-ink-50">{value ?? '—'}</div>
      <div className="text-ink-400 text-xs font-display uppercase tracking-widest mt-1">{label}</div>
    </div>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nRes, aRes] = await Promise.all([
          api.get('/notes/'),
          api.get('/ai/history/'),
        ])
        setNotes(nRes.data.results || nRes.data)
        setAiHistory(aRes.data.results || aRes.data)
      } catch { /* silently fail */ }
      setLoading(false)
    }
    fetchData()
  }, [])

  const recentNotes = notes.slice(0, 3)

  return (
    <div className="page-container animate-fade-in relative z-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-secondary-500 text-sm font-display font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span> OVERVIEW
        </p>
        <h1 className="section-title text-4xl sm:text-5xl">
          Welcome back, <span className="text-primary-500">{user?.username}</span> 👋
        </h1>
        <p className="text-ink-300 mt-2 max-w-xl">
          Here is a summary of your study sessions, generated notes, and recent AI queries.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard
          label="Total Notes"
          value={loading ? '...' : notes.length}
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          color="bg-primary-500/10 text-primary-500"
        />
        <StatCard
          label="AI Requests"
          value={loading ? '...' : aiHistory.length}
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-secondary-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="bg-secondary-500/10 text-secondary-500"
        />
        <StatCard
          label="Account Role"
          value={user?.role === 'admin' ? 'Admin' : 'Student'}
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-orange-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          color="bg-orange-500/10 text-orange-500"
        />
        <StatCard
          label="Status"
          value="Active"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-emerald-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-emerald-500/10 text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-ink-50 text-xl tracking-tight">Recent Notes</h2>
            <Link to="/notes" className="btn-ghost !text-xs !px-3 font-semibold text-primary-500 hover:text-primary-400">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="card p-4 h-24 skeleton rounded-2xl" />)}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="card p-10 text-center border-dashed border-2 bg-surface/30">
              <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-ink-50 mb-1">No notes yet</h3>
              <p className="text-ink-400 text-sm mb-6 max-w-xs mx-auto">Get started by creating your first study note manually or use the AI generator.</p>
              <Link to="/notes/new" className="btn-primary">Create your first note</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentNotes.map(note => (
                <Link key={note.id} to={`/notes/${note.id}`} className="card-hover p-5 block group gradient-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50" />
                        <h3 className="font-display font-bold text-ink-50 text-base truncate group-hover:text-primary-400 transition-colors">{note.title}</h3>
                      </div>
                      <p className="text-ink-400 text-sm line-clamp-2 pr-8">{note.content || 'Empty note...'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="badge-ink whitespace-nowrap">
                        {new Date(note.updated_at || note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick AI Generator Panel */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-ink-50 text-xl tracking-tight">AI Assistant</h2>
          </div>

          <div className="card p-6 border-t-4 border-t-primary-500 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="glow-dot animate-pulse" />
              <span className="text-xs font-display font-bold text-primary-400 uppercase tracking-widest">System Ready</span>
            </div>

            <h3 className="text-ink-50 font-display font-bold mb-2 relative z-10">Stuck on a topic?</h3>
            <p className="text-ink-400 text-sm mb-6 leading-relaxed relative z-10">
              Ask about any study topic, get detailed step-by-step explanations, specific examples, or mini-tests instantly.
            </p>
            <Link to="/ai" className="btn-primary w-full justify-center shadow-primary-500/25 relative z-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Open AI Generator
            </Link>
          </div>

          {/* Recent AI requests */}
          {aiHistory.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-display font-semibold text-ink-500 uppercase tracking-widest">Recent Prompts</p>
              </div>
              <div className="space-y-3">
                {aiHistory.slice(0, 3).map(req => (
                  <div key={req.id} className="card p-4 hover:border-ink-500/50 transition-colors">
                    <p className="text-ink-300 text-sm line-clamp-2 italic">"{req.prompt}"</p>
                    <div className="mt-2 text-right">
                      <span className={`badge ${req.status === 'success' ? 'badge-primary' : 'badge-red'} text-[10px]`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
