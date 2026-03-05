import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../api/axios'
import { useState } from 'react'

const NavItem = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative px-3 py-1.5 text-sm font-display font-medium rounded-lg transition-all duration-200 ${isActive
                ? 'text-spark-300 bg-spark-500/10'
                : 'text-ink-400 hover:text-ink-100 hover:bg-ink-700/50'
            }`
        }
    >
        {children}
    </NavLink>
)

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token')
            if (refresh) await api.post('/auth/logout/', { refresh })
        } catch { /* ignore */ }
        logout()
        navigate('/')
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-ink-700/50 bg-ink-900/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center shadow-lg shadow-spark-500/30 group-hover:shadow-spark-500/50 transition-shadow">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white w-5 h-5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-display font-bold text-lg text-ink-50 tracking-tight">
                            Study<span className="text-spark-400">AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {user ? (
                            <>
                                <NavItem to="/dashboard">Dashboard</NavItem>
                                <NavItem to="/notes">Notes</NavItem>
                                <NavItem to="/ai">AI Assistant</NavItem>
                                {isAdmin && <NavItem to="/admin">Admin</NavItem>}
                            </>
                        ) : (
                            <>
                                <NavItem to="/">Home</NavItem>
                            </>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <NavLink to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-ink-700/50 transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center text-xs font-display font-bold text-white">
                                        {user.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-ink-200 hidden lg:block">{user.username}</span>
                                </NavLink>
                                <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost">Log in</Link>
                                <Link to="/register" className="btn-primary">Get Started</Link>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden btn-ghost p-2"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                                {menuOpen
                                    ? <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                    : <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden py-3 pb-4 border-t border-ink-700/50 space-y-1 animate-fade-in">
                        {user ? (
                            <>
                                <NavItem to="/dashboard">Dashboard</NavItem>
                                <NavItem to="/notes">Notes</NavItem>
                                <NavItem to="/ai">AI Assistant</NavItem>
                                {isAdmin && <NavItem to="/admin">Admin</NavItem>}
                                <NavItem to="/profile">Profile</NavItem>
                            </>
                        ) : null}
                    </div>
                )}
            </div>
        </nav>
    )
}
