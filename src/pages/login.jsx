import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const EYEBROW = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#999999',
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'transparent',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '0',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

export default function Login() {
  const [tab, setTab] = useState('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (user) navigate('/app/dashboard', { replace: true })
  }, [user, authLoading, navigate])

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setSuccess('')
    setFullName('')
    setEmail('')
    setPassword('')
    setLoading(false)
  }

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await signIn(email, password)
      if (err) throw err
      navigate('/welcome', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your credentials.')
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!fullName || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (err) throw err
      navigate('/welcome', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/welcome` },
    })
    if (err) {
      setError(err.message || 'Google sign in failed.')
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') tab === 'signin' ? handleSignIn() : handleSignUp()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '80px 80px', pointerEvents: 'none',
      }} />

      {/* Back link */}
      <Link
        to="/"
        style={{ ...EYEBROW, position: 'absolute', top: '32px', left: '40px', color: '#444', textDecoration: 'none', transition: 'color 0.2s', fontSize: '10px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
        onMouseLeave={e => e.currentTarget.style.color = '#444'}
      >
        ← Back to site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '48px' }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#D4AF37', letterSpacing: '0.25em' }}>ALTUS</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', background: '#D4AF37', color: '#0a0a0a', padding: '3px 8px', letterSpacing: '0.15em', borderRadius: '2px' }}>AERO</span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ id: 'signin', label: 'SIGN IN' }, { id: 'signup', label: 'SIGN UP' }].map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              style={{
                flex: 1, padding: '12px', background: 'transparent', border: 'none',
                borderBottom: tab === t.id ? '1px solid #D4AF37' : '1px solid transparent',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px',
                color: tab === t.id ? '#D4AF37' : '#555',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
          <AnimatePresence>
            {tab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', background: '#0a0a0a' }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ background: '#0a0a0a' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          <div style={{ background: '#0a0a0a' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#f87171',
                marginTop: '12px', padding: '10px 14px',
                background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)',
                lineHeight: 1.5, letterSpacing: '0.05em',
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Primary CTA */}
        <button
          onClick={tab === 'signin' ? handleSignIn : handleSignUp}
          disabled={loading}
          style={{
            width: '100%', marginTop: '16px', padding: '14px',
            background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
            color: '#0a0a0a', border: 'none', borderRadius: '9999px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
            letterSpacing: '0.15em', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s', textTransform: 'uppercase',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {loading ? 'PLEASE WAIT...' : tab === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ ...EYEBROW, fontSize: '9px', color: '#333' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', background: 'transparent',
            color: '#999999', border: '1px solid #333', borderRadius: '9999px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.2s', textTransform: 'uppercase',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#999999' }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.015 17.64 11.707 17.64 9.2z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p style={{ ...EYEBROW, textAlign: 'center', marginTop: '24px', fontSize: '9px', color: '#333', lineHeight: 1.6 }}>
          By continuing you agree to our{' '}
          <Link to="/terms" style={{ color: '#555', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: '#555', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}