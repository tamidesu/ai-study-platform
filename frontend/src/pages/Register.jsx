import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../api/axios'

// ✅ Снаружи — пересоздаваться не будет
const Field = ({ name, label, type = 'text', placeholder, value, onChange, error }) => (
    <div>
      <label className="label">{label}</label>
      <input
          type={type}
          required
          className={`input-field ${error ? 'border-red-500/50' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
)

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', username: '', password: '', password2: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (name) => (e) => setForm({ ...form, [name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 chars'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 chars'
    if (form.password !== form.password2) e.password2 = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setErrors({})
    setLoading(true)
    try {
      const { email, username, password } = form
      await api.post('/auth/register/', { email, username, password })
      const { data: tokenData } = await api.post('/auth/login/', { email, password })
      localStorage.setItem('access_token', tokenData.access)
      localStorage.setItem('refresh_token', tokenData.refresh)
      const profileRes = await api.get('/auth/profile/')
      login(profileRes.data, { access: tokenData.access, refresh: tokenData.refresh })
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data) {
        const d = err.response.data
        const mapped = {}
        for (const k of Object.keys(d)) {
          mapped[k] = Array.isArray(d[k]) ? d[k][0] : d[k]
        }
        setErrors(mapped)
      } else {
        setErrors({ non_field_errors: err.response?.data?.detail || 'An error occurred during registration.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-ink-50 mb-2">Create account</h1>
            <p className="text-ink-400 text-sm">Join StudyAI and start learning smarter</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.non_field_errors && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {errors.non_field_errors}
                  </div>
              )}

              <Field name="email" label="Email" type="email" placeholder="you@example.com"
                     value={form.email} onChange={handleChange('email')} error={errors.email} />
              <Field name="username" label="Username" placeholder="johndoe"
                     value={form.username} onChange={handleChange('username')} error={errors.username} />
              <Field name="password" label="Password" type="password" placeholder="Min 8 characters"
                     value={form.password} onChange={handleChange('password')} error={errors.password} />
              <Field name="password2" label="Confirm Password" type="password" placeholder="Repeat password"
                     value={form.password2} onChange={handleChange('password2')} error={errors.password2} />

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
                {loading ? (
                    <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </span>
                ) : 'Create account →'}
              </button>
            </form>
          </div>

          <p className="text-center text-ink-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
  )
}