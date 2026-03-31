import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required.')
      setLoading(false)
      return
    }

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/app/dashboard')
      }
    } else {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created. Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ffffff', letterSpacing: '0.15em' }}>ALTUS</span>
            <span style={{
              background: '#D4AF37',
              color: '#0a0a0a',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '12px',
              padding: '2px 8px',
              letterSpacing: '0.1em'
            }}>AERO</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', letterSpacing: '0.05em' }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '32px'
        }}>

          <div style={{ display: 'flex', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '4px' }}>
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMessage('') }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: mode === m ? '#1e3a8a' : 'transparent',
                  color: mode === m ? '#ffffff' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s'
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '8px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '8px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#f87171',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#D4AF37',
              fontSize: '13px'
            }}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#1e3a8a80' : '#D4AF37',
              color: loading ? '#ffffff' : '#0a0a0a',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '14px',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.12em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'PLEASE WAIT...' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#4b5563', fontSize: '12px' }}>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Back to homepage</a>
        </p>
      </div>
    </div>
  )
}
