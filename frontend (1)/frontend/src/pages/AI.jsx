import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'

const HistoryItem = ({ item, onDelete, onSave }) => (
  <div className="card p-4 space-y-3 animate-slide-up">
    <div className="flex items-start justify-between gap-2">
      <p className="text-ink-300 text-sm font-medium line-clamp-2">{item.prompt}</p>
      <span className={`badge flex-shrink-0 ${item.status === 'success' ? 'badge-green' : 'badge-red'}`}>
        {item.status}
      </span>
    </div>
    {item.result && (
      <div className="bg-ink-900/50 rounded-lg p-3 text-ink-400 text-xs leading-relaxed line-clamp-3 font-mono">
        {item.result}
      </div>
    )}
    <div className="flex items-center gap-2 pt-1">
      {item.status === 'success' && !item.saved_to_note && (
        <button onClick={() => onSave(item.id)} className="btn-ghost text-xs text-spark-400 hover:text-spark-300 hover:bg-spark-500/10 p-1.5">
          💾 Save as Note
        </button>
      )}
      {item.saved_to_note && (
        <Link to={`/notes/${item.saved_to_note}`} className="btn-ghost text-xs text-cyan-400 hover:text-cyan-300 p-1.5">
          📄 View Note
        </Link>
      )}
      <button onClick={() => onDelete(item.id)} className="ml-auto p-1.5 text-ink-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  </div>
)

export default function AIPage() {
  const [params] = useSearchParams()
  const [prompt, setPrompt] = useState(params.get('topic') ? `Explain: ${params.get('topic')}` : '')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [charCount, setCharCount] = useState(0)
  const resultRef = useRef(null)

  useEffect(() => {
    api.get('/ai/history/').then(res => {
      setHistory(res.data.results || res.data)
      setHistoryLoading(false)
    }).catch(() => setHistoryLoading(false))
  }, [])

  useEffect(() => {
    setCharCount(prompt.length)
  }, [prompt])

  const handleGenerate = async () => {
    if (prompt.length < 10) { alert('Prompt must be at least 10 characters'); return }
    if (prompt.length > 1000) { alert('Prompt is too long (max 1000 chars)'); return }
    setLoading(true)
    setResult('')
    try {
      const { data } = await api.post('/ai/generate/', { prompt })
      setResult(data.result)
      // Refresh history
      const hRes = await api.get('/ai/history/')
      setHistory(hRes.data.results || hRes.data)
    } catch (e) {
      setResult('Error: ' + (e.response?.data?.detail || 'Something went wrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return
    try {
      await api.delete(`/ai/history/${id}/`)
      setHistory(prev => prev.filter(h => h.id !== id))
    } catch { alert('Failed to delete') }
  }

  const handleSave = async (id) => {
    try {
      await api.post(`/ai/save/${id}/`)
      const hRes = await api.get('/ai/history/')
      setHistory(hRes.data.results || hRes.data)
    } catch { alert('Failed to save as note') }
  }

  const SUGGESTIONS = [
    'Explain Big O notation with examples',
    'Create a mini-test on Python basics',
    'Summarize photosynthesis for a student',
    'Give me 5 key facts about World War II',
  ]

  return (
    <div className="page-container max-w-5xl animate-fade-in relative z-10">
      <div className="mb-8">
        <p className="text-secondary-500 text-sm font-display font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse"></span> GENERATOR
        </p>
        <h1 className="section-title text-4xl">AI Study Assistant</h1>
        <p className="text-ink-400 text-sm mt-2 max-w-lg">
          Stuck on a concept? Ask for detailed explanations, examples, or request a mini-quiz to test your knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main generation area */}
        <div className="lg:col-span-3 space-y-6">

          {/* Output / Result area first (like a chat) */}
          {(result || loading) && (
            <div className="card p-6 min-h-[200px] border-secondary-500/30 bg-surface/80" ref={resultRef}>
              <div className="flex items-center gap-3 mb-6 border-b border-ink-700/50 pb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary-500/20 text-secondary-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-sm font-display font-bold uppercase tracking-widest text-ink-200">
                  {loading ? 'Generating Response...' : 'AI Explanation'}
                </span>
              </div>

              {loading ? (
                <div className="space-y-4 px-2">
                  <div className="skeleton h-4 rounded w-full" />
                  <div className="skeleton h-4 rounded w-11/12" />
                  <div className="skeleton h-4 rounded w-4/5" />
                  <div className="skeleton h-4 rounded w-5/6" />
                  <div className="skeleton h-4 rounded w-2/3" />
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className={`text-ink-100 text-base leading-relaxed whitespace-pre-wrap font-body p-2 ${loading ? 'typing-cursor' : ''}`}>
                    {result}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input block */}
          <div className="card p-5 gradient-border bg-surface/90 shadow-xl shadow-ink-900/50 mt-auto">
            <div className="flex flex-col relative">
              <textarea
                rows={3}
                className="w-full bg-transparent border-none text-ink-50 placeholder-ink-500 resize-none focus:ring-0 p-2 text-base font-body"
                placeholder="Message AI Assistant... (e.g. 'Explain recursion with a simple Python example')"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate() }}
              />

              <div className="flex items-center justify-between mt-4 border-t border-ink-700/30 pt-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${charCount > 900 ? 'text-amber-500' : charCount < 10 && charCount > 0 ? 'text-red-400' : 'text-ink-500'}`}>
                    {charCount}/1000
                  </span>

                  {/* Suggestions dropdown or quick pills */}
                  <div className="hidden md:flex gap-2 ml-4 border-l border-ink-700/50 pl-4">
                    {SUGGESTIONS.slice(0, 2).map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(s)}
                        className="text-[11px] px-2.5 py-1 bg-ink-800 text-ink-400 hover:text-ink-200 hover:bg-ink-700 rounded-lg transition-colors truncate max-w-[150px]"
                        title={s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-ink-500 text-xs hidden sm:inline-block bg-ink-800 px-2 py-1 rounded">Ctrl + Enter</span>
                  <button
                    onClick={handleGenerate}
                    disabled={loading || charCount < 10 || charCount > 1000}
                    className="btn-primary !px-6 shadow-primary-500/25 disabled:bg-ink-700 disabled:text-ink-500 disabled:shadow-none"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5 h-full max-h-[calc(100vh-12rem)] flex flex-col bg-surface/60">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-ink-700/50">
              <h2 className="font-display font-bold text-ink-50 text-sm uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                History
              </h2>
              <span className="badge-ink">{history.length}</span>
            </div>

            {historyLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
              </div>
            ) : history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10">
                <div className="w-12 h-12 rounded-full bg-ink-800 flex items-center justify-center mb-3 text-ink-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-ink-400 text-xs max-w-[150px]">Your previous AI conversations will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-2 -mr-2 custom-scrollbar flex-1 pb-4">
                {history.map(item => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
