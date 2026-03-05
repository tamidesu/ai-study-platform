import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useToast } from '../../store/ToastContext'
import ConfirmModal from '../../components/ConfirmModal'

export default function NoteList() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const toast = useToast()

  useEffect(() => {
    api.get('/notes/').then(res => {
      setNotes(res.data.results || res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  )

  const requestDelete = (id, e) => {
    e.preventDefault()
    setConfirmId(id)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${confirmId}/`)
      setNotes(prev => prev.filter(n => n.id !== confirmId))
      toast('Note deleted successfully', 'success')
    } catch {
      toast('Failed to delete note', 'error')
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className="page-container animate-fade-in relative z-10">
      <ConfirmModal
        isOpen={confirmId !== null}
        title="Delete Note"
        message="This action cannot be undone. The note will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-primary-500 text-sm font-display font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> LIBRARY
          </p>
          <h1 className="section-title text-4xl">My Notes</h1>
          <p className="text-ink-400 text-sm mt-2 max-w-md">
            Manage your study materials, generated explanations, and saved insights. {loading ? '' : `You have ${notes.length} note${notes.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <Link to="/notes/new" className="btn-primary shadow-primary-500/25 py-3 whitespace-nowrap">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create New Note
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-ink-400 group-focus-within:text-primary-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search through titles and content..."
            className="input-field pl-12 py-3.5 bg-surface/50 backdrop-blur-sm border-ink-600/30 text-base"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="card p-6 h-48 skeleton rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-ink-700/50 rounded-3xl bg-surface/30 backdrop-blur-sm">
          <div className="w-20 h-20 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary-500/5">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="font-display font-bold text-ink-50 text-xl mb-3">
            {search ? 'No notes match your search' : 'Your library is empty'}
          </h3>
          <p className="text-ink-400 text-base mb-8 max-w-sm">
            {search ? 'Try adjusting your search terms to find what you are looking for.' : 'Start bulding your knowledge base by creating your first study note.'}
          </p>
          {!search && <Link to="/notes/new" className="btn-primary px-8 py-3">Get Started</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((note, i) => (
            <div
              key={note.id}
              className="card-hover p-6 flex flex-col group animate-slide-up gradient-border relative bg-surface/80"
              style={{ animationDelay: `${(i % 10) * 40}ms` }}
            >
              <Link to={`/notes/${note.id}`} className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display font-bold text-ink-50 text-lg leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {note.title}
                  </h3>
                </div>
                {note.content && (
                  <p className="text-ink-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {note.content}
                  </p>
                )}
              </Link>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary-500/50" />
                  <span className="text-ink-500 font-medium text-xs">
                    {new Date(note.updated_at || note.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex gap-1 -mr-2 bg-surface/90 backdrop-blur-md px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-ink-700/50 shadow-sm translate-x-2 group-hover:translate-x-0">
                  <Link
                    to={`/notes/${note.id}/edit`}
                    className="p-1.5 text-ink-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-md transition-colors"
                    onClick={e => e.stopPropagation()}
                    title="Edit Note"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" />
                      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <button
                    onClick={e => requestDelete(note.id, e)}
                    className="p-1.5 text-ink-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete Note"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
