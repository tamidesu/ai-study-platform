import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const Feature = ({ icon, title, desc }) => (
  <div className="card p-6 animate-slide-up">
    <div className="w-12 h-12 rounded-xl bg-spark-500/15 border border-spark-500/20 flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-ink-50 mb-2">{title}</h3>
    <p className="text-ink-400 text-sm leading-relaxed">{desc}</p>
  </div>
)

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="text-center pt-16 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spark-500/10 border border-spark-500/20 text-spark-300 text-xs font-display font-semibold mb-8">
          <div className="glow-dot animate-pulse" />
          Powered by Llama 3.1 via Groq
        </div>

        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-ink-50 leading-[1.1] mb-6">
          Learn smarter with{' '}
          <span className="relative">
            <span className="bg-gradient-to-r from-spark-300 via-spark-400 to-glow-cyan bg-clip-text text-transparent">
              AI assistance
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M0 8 Q75 0 150 8 Q225 16 300 8" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </span>
        </h1>

        <p className="text-ink-400 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Create study notes, get AI-generated explanations and mini-tests,
          and build your personal knowledge base — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                Start for free →
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        <Feature
          icon="📝"
          title="Smart Notes"
          desc="Create, organize, and manage your study notes with a clean, distraction-free editor."
        />
        <Feature
          icon="🤖"
          title="AI Study Assistant"
          desc="Ask questions, get explanations, generate examples and mini-tests powered by Llama 3.1."
        />
        <Feature
          icon="📚"
          title="Knowledge Base"
          desc="Save AI responses directly as notes and build your personal knowledge library over time."
        />
      </div>

      {/* Stats strip */}
      <div className="card p-8 grid grid-cols-3 divide-x divide-ink-700/50">
        {[
          { value: 'Llama 3.1', label: 'AI Model' },
          { value: '< 1s', label: 'Response time' },
          { value: 'JWT', label: 'Secure auth' },
        ].map((s) => (
          <div key={s.label} className="text-center px-6">
            <div className="font-display font-bold text-2xl text-spark-300 mb-1">{s.value}</div>
            <div className="text-ink-500 text-xs font-display uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
