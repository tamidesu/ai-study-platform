import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import api from '../../api/axios'

export default function NoteDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/notes/${id}/`).then(res => {
      setNote(res.data)
      setLoading(false)
    }).catch(() => {
      setError('Note not found')
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently?')) return
    try {
      await api.delete(`/notes/${id}/`)
      navigate('/notes')
    } catch {
      alert('Failed to delete')
    }
  }

  if (loading) return (
    <div className="page-container max-w-3xl">
      <div className="card p-8 skeleton h-64" />
    </div>
  )

  if (error || !note) return (
    <div className="page-container text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="font-display font-bold text-2xl text-ink-50 mb-2">{error || 'Note not found'}</h2>
      <Link to="/notes" className="btn-primary mt-4">Back to Notes</Link>
    </div>
  )

  const canEdit = isAdmin || note.owner === user?.id

  return (
    <div className="page-container max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink-500 mb-6">
        <Link to="/notes" className="hover:text-ink-300 transition-colors">Notes</Link>
        <span>/</span>
        <span className="text-ink-300 truncate max-w-xs">{note.title}</span>
      </div>

      <div className="card p-8 animate-slide-up">
        {/* Note header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="font-display font-bold text-2xl text-ink-50 leading-snug flex-1">
            {note.title}
          </h1>
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/notes/${id}/edit`} className="btn-secondary text-xs px-3 py-1.5">
                ✏️ Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger text-xs px-3 py-1.5">
                🗑 Delete
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-ink-700/50">
          <span className="text-ink-500 text-xs">
            Created {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {note.updated_at !== note.created_at && (
            <span className="text-ink-600 text-xs">
              · Updated {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Content */}
        {note.content ? (
          <div className="text-ink-300 leading-relaxed whitespace-pre-wrap font-body text-sm">
            {note.content}
          </div>
        ) : (
          <p className="text-ink-600 italic text-sm">No content yet. Edit to add some notes.</p>
        )}

        {/* AI button */}
        <div className="mt-8 pt-6 border-t border-ink-700/50">
          <Link
            to={`/ai?topic=${encodeURIComponent(note.title)}`}
            className="btn-secondary"
          >
            🤖 Ask AI about this topic
          </Link>
        </div>
      </div>
    </div>
  )
}
