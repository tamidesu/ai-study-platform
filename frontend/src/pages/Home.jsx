import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { motion } from 'framer-motion'
import { Sparkles, Brain, BookOpen, Clock, ShieldCheck, Zap } from 'lucide-react'

const Feature = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="glass-panel p-8 relative overflow-hidden group hover:border-spark-500/30 transition-colors"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-spark-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-spark-500/20 transition-colors" />
    <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-white/5 flex items-center justify-center text-spark-400 mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="font-display font-bold text-xl text-ink-50 mb-3">{title}</h3>
    <p className="text-ink-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
)

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page-container max-w-7xl overflow-hidden pt-8">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] animate-blob pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none" />

      <div className="relative z-10 text-center pt-20 pb-28 min-h-[70vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface/50 border border-white/10 text-spark-300 text-xs font-display font-semibold mb-10 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-spark-400 shadow-[0_0_8px_rgba(167,139,250,0.8)] animate-pulse" />
          Powered by Llama 3.1 via Groq
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl text-ink-50 leading-[1.1] mb-8 max-w-5xl mx-auto"
        >
          Learn smarter with <br className="hidden sm:block" />
          <span className="relative inline-block mt-2">
            <span className="bg-gradient-to-r from-spark-300 via-primary-400 to-secondary-400 bg-clip-text text-transparent">
              AI assistance
            </span>
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
              className="absolute -bottom-3 left-0 w-full overflow-visible"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path d="M0 8 Q75 0 150 8 Q225 16 300 8" stroke="currentColor" className="text-primary-500" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            </motion.svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-ink-300 text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Create structured notes, get AI-generated explanations and mini-tests,
          and build your personal knowledge base in an immersive environment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {user ? (
            <Link to="/dashboard" className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]">
                Start for free <Sparkles className="w-5 h-5 ml-2 inline-block" />
              </Link>
              <Link to="/login" className="px-10 py-4 rounded-xl font-display font-semibold text-ink-200 bg-surface/50 border border-white/5 hover:bg-white/5 hover:text-white transition-all duration-300 backdrop-blur-md">
                Sign in
              </Link>
            </>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <Feature icon={BookOpen} title="Smart Notes" desc="Create, organize, and manage your study notes with a beautiful, distraction-free glassmorphism editor." delay={0.1} />
        <Feature icon={Brain} title="AI Study Assistant" desc="Ask questions, get deep explanations, and generate targeted mini-tests instantly powered by cutting-edge LLMs." delay={0.2} />
        <Feature icon={Zap} title="Knowledge Base" desc="Save AI responses directly as notes with rich markdown support, building an infinitely expanding personal library." delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 glass-panel p-10 grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-white/10 shadow-2xl mb-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-accent-500/5 pointer-events-none" />
        {[
          { value: 'Llama 3.1', label: 'Core AI Model', icon: Brain },
          { value: '< 1s', label: 'Avg Response Time', icon: Clock },
          { value: 'JWT', label: 'Secure Authentication', icon: ShieldCheck },
        ].map((s, i) => (
          <div key={s.label} className={`text-center px-6 ${i !== 0 ? 'pt-8 sm:pt-0' : ''}`}>
            <div className="flex justify-center mb-3">
              <s.icon className="w-6 h-6 text-ink-500" />
            </div>
            <div className="font-display font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-spark-200 to-spark-400 mb-2">
              {s.value}
            </div>
            <div className="text-ink-400 text-sm font-display uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
