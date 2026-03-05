import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4">
      <div className="animate-slide-up">
        <div className="font-display font-extrabold text-8xl text-spark-500/20 mb-4">404</div>
        <h1 className="font-display font-bold text-3xl text-ink-50 mb-3">Page not found</h1>
        <p className="text-ink-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
