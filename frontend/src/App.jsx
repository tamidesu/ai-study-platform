import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NoteList from './pages/Notes/NoteList'
import NoteCreate from './pages/Notes/NoteCreate'
import NoteDetail from './pages/Notes/NoteDetail'
import NoteEdit from './pages/Notes/NoteEdit'
import AIPage from './pages/AI'
import Profile from './pages/Profile'
import AdminPanel from './pages/Admin'
import NotFound from './pages/NotFound'

import { ThemeProvider } from './store/ThemeContext'
import { ToastProvider } from './store/ToastContext'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected - any authenticated user */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><NoteList /></ProtectedRoute>} />
                <Route path="/notes/new" element={<ProtectedRoute><NoteCreate /></ProtectedRoute>} />
                <Route path="/notes/:id" element={<ProtectedRoute><NoteDetail /></ProtectedRoute>} />
                <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteEdit /></ProtectedRoute>} />
                <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin only */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}