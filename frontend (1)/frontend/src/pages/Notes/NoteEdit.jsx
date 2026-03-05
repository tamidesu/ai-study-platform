import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function NoteEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/notes/${id}/`).then(res => {
      setForm({ title: res.data.title, content: res.data.content || '' })
      setLoading(false)
    }).catch(() => {
      setErrors({ submit: 'Note not found' })
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.title.trim()) err.title = 'Title is required'
    if (form.title.length > 200) err.title = 'Max 200 characters'
    if (Object.keys(err).length) { setErrors(err); return }
    setErrors({})
    setSaving(true)
    try {
      await api.put(`/notes/${id}/`, form)
      navigate(`/notes/${id}`)
    } catch (e) {
      const d = e.response?.data || {}
      setErrors({ submit: d.detail || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="page-container max-w-3xl">
      <div className="card p-8 skeleton h-64" />
    </div>
  )

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-ink-500 mb-6">
        <Link to="/notes" className="hover:text-ink-300 transition-colors">Notes</Link>
        <span>/</span>
        <Link to={`/notes/${id}`} className="hover:text-ink-300 transition-colors truncate max-w-xs">{form.title}</Link>
        <span>/</span>
        <span className="text-ink-300">Edit</span>
      </div>

      <h1 className="section-heading mb-6">Edit Note</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              maxLength={200}
              className={`input-field text-lg font-display ${errors.title ? 'border-red-500/50' : ''}`}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              rows={14}
              className="input-field resize-none font-mono text-sm leading-relaxed"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round"/>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
            <Link to={`/notes/${id}`} className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
