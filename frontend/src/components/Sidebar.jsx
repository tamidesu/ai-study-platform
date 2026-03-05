import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useTheme } from '../store/ThemeContext'
import api from '../api/axios'
import {
    LayoutDashboard,
    Files,
    Sparkles,
    UserCircle,
    Settings,
    Home,
    LogOut,
    Moon,
    Sun,
    GraduationCap
} from 'lucide-react'

const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-display font-medium rounded-xl transition-all duration-300 group ${isActive
                ? 'text-primary-400 bg-primary-500/10 shadow-[0_0_15px_-3px_rgba(124,58,237,0.15)] ring-1 ring-primary-500/20'
                : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800/50'
            }`
        }
    >
        {({ isActive }) => (
            <>
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary-300'}`} />
                <span>{children}</span>
            </>
        )}
    </NavLink>
)

export default function Sidebar({ isOpen, setIsOpen }) {
    const { user, logout, isAdmin } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token')
            if (refresh) await api.post('/auth/logout/', { refresh })
        } catch { /* ignore */ }
        logout()
        navigate('/')
    }

    const navClass = `fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-ink-700/50 transform transition-transform duration-300 ease-in-out flex flex-col rounded-none lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={navClass}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-3 group shrink-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] group-hover:scale-105 transition-all duration-300">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl text-ink-50 tracking-tight">
                            Study<span className="text-primary-400">AI</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {user ? (
                        <>
                            <NavItem to="/dashboard" icon={LayoutDashboard}>
                                Dashboard
                            </NavItem>
                            <NavItem to="/notes" icon={Files}>
                                My Notes
                            </NavItem>
                            <NavItem to="/ai" icon={Sparkles}>
                                AI Generator
                            </NavItem>
                            <NavItem to="/profile" icon={UserCircle}>
                                Profile
                            </NavItem>
                            {isAdmin && (
                                <div className="pt-4 mt-4 border-t border-white/5">
                                    <NavItem to="/admin" icon={Settings}>
                                        Admin Panel
                                    </NavItem>
                                </div>
                            )}
                        </>
                    ) : (
                        <NavItem to="/" icon={Home}>
                            Welcome Home
                        </NavItem>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/5 space-y-2 bg-gradient-to-b from-transparent to-ink-900/50">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-ink-300 hover:text-primary-300 hover:bg-primary-500/10 rounded-xl transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                            )}
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                    </button>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Log out</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    )
}
