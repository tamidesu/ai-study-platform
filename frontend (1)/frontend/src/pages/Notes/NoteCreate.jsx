import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function NoteCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.title.trim()) err.title = 'Title is required'
    if (form.title.length > 200) err.title = 'Max 200 characters'
    if (Object.keys(err).length) { setErrors(err); return }
    setErrors({})
    setLoading(true)
    try {
      const { data } = await api.post('/notes/', form)
      navigate(`/notes/${data.id}`)
    } catch (e) {
      const d = e.response?.data || {}
      setErrors({ submit: d.detail || d.title?.[0] || 'Failed to create note' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink-500 mb-6">
        <Link to="/notes" className="hover:text-ink-300 transition-colors">Notes</Link>
        <span>/</span>
        <span className="text-ink-300">New</span>
      </div>

      <h1 className="section-heading mb-6">Create Note</h1>

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
              required
              maxLength={200}
              className={`input-field text-lg font-display ${errors.title ? 'border-red-500/50' : ''}`}
              placeholder="e.g. Sorting Algorithms"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <div className="flex justify-between mt-1.5">
              {errors.title
                ? <p className="text-red-400 text-xs">{errors.title}</p>
                : <span />
              }
              <span className="text-ink-600 text-xs">{form.title.length}/200</span>
            </div>
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              rows={12}
              className="input-field resize-none font-mono text-sm leading-relaxed"
              placeholder="Write your study notes here..."
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round"/>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Note'}
            </button>
            <Link to="/notes" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
