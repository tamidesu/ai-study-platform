import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { useToast } from '../../store/ToastContext'
import ReactMarkdown from 'react-markdown'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'

export default function NoteDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    try {
      await api.delete(`/notes/${id}/`)
      toast('Note deleted', 'success')
      navigate('/notes')
    } catch {
      toast('Failed to delete note', 'error')
      setConfirmOpen(false)
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
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Note Permanently"
        message="This action cannot be undone. The note will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

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
              <button onClick={() => setConfirmOpen(true)} className="btn-danger text-xs px-3 py-1.5">
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
          <div className="prose prose-invert prose-headings:text-ink-50 prose-p:text-ink-200 prose-strong:text-ink-100 prose-code:text-spark-300 prose-code:bg-ink-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-ink-900 prose-pre:border prose-pre:border-ink-700/50 prose-li:text-ink-200 prose-a:text-primary-400 max-w-none font-body text-sm leading-relaxed">
            <ReactMarkdown>{note.content}</ReactMarkdown>
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
