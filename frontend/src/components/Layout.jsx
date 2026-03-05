import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-ink-100 flex transition-colors duration-300 relative">
      {/* Ambient Orbs */}
      <div className="fixed w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] top-0 left-1/4 pointer-events-none z-0" />
      <div className="fixed w-80 h-80 bg-secondary-500/10 rounded-full blur-[80px] bottom-1/4 right-0 pointer-events-none z-0" />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-50" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300 z-10 relative">
        {/* Mobile Header / Top Nav replacement */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-ink-700/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-ink-400 hover:text-ink-100 rounded-lg hover:bg-ink-800/50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Search Bar / Input (Optional logic on pages) */}
            <div className="hidden sm:flex relative max-w-xs w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-ink-800/50 border border-ink-700 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all text-ink-100 placeholder-ink-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <div className="flex gap-2">
                <Link to="/login" className="btn-ghost text-sm py-1.5 px-3">Log in</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            ) : (
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-ink-100 group-hover:text-primary-400 transition-colors">{user.username}</p>
                  <p className="text-xs text-ink-400">{user.email}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        <footer className="border-t border-ink-700/50 py-4 px-6 relative z-10 bg-surface/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto">
            <p className="text-ink-500 text-xs text-center sm:text-left">
              © 2026 StudyAI — Platform Template
            </p>
            <div className="flex items-center gap-1.5 justify-center sm:justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-slow shadow-sm shadow-primary-500/50" />
              <span className="text-ink-500 text-[10px] uppercase font-bold tracking-wider">All systems operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
