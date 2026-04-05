import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  background: '#0d0d0d',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
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
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  // If user is already authenticated (including after Google OAuth callback),
  // redirect them away from this page immediately.
  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [user, navigate])

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
      options: {
        // Must also be added to Supabase dashboard → Authentication → URL Configuration → Redirect URLs
        redirectTo: `${window.location.origin}/welcome`,
      },
    })
    if (err) {
      setError(err.message || 'Google sign in failed.')
      setLoading(false)
    }
    // If successful, browser navigates away — no further code runs here
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') tab === 'signin' ? handleSignIn() : handleSignUp()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% -10%, rgba(30,58,138,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'color 0.2s',
          letterSpacing: '0.1em',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
      >
        ← BACK TO SITE
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '30px', color: '#D4AF37', letterSpacing: '0.2em' }}>
            ALTUS
          </span>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', background: '#D4AF37', color: '#0a0a0a', padding: '3px 9px', letterSpacing: '0.1em', borderRadius: '4px' }}>
            AERO
          </span>
        </div>

        <div
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '18px',
            padding: '32px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#0a0a0a',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px',
              gap: '4px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {[
              { id: 'signin', label: 'SIGN IN' },
              { id: 'signup', label: 'SIGN UP' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tab === t.id ? '#1a1a1a' : 'transparent',
                  color: tab === t.id ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  border: tab === t.id ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {tab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: '#f87171',
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: 'rgba(248,113,113,0.07)',
                  border: '1px solid rgba(248,113,113,0.15)',
                  borderRadius: '8px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: '#4ade80',
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: 'rgba(74,222,128,0.07)',
                  border: '1px solid rgba(74,222,128,0.15)',
                  borderRadius: '8px',
                }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={tab === 'signin' ? handleSignIn : handleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '14px',
              background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '10px',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '15px',
              letterSpacing: '0.15em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {loading
              ? 'PLEASE WAIT...'
              : tab === 'signin'
                ? 'SIGN IN'
                : 'CREATE ACCOUNT'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.015 17.64 11.707 17.64 9.2z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.18)',
            lineHeight: 1.6,
          }}
        >
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}