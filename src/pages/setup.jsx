import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Setup() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    if (!username.trim()) {
      setError('Please enter a username.')
      return
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError('Only letters, numbers, and underscores allowed.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { username: username.trim() }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/app/dashboard')
    }
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ffffff', letterSpacing: '0.15em' }}>ALTUS</span>
            <span style={{ background: '#D4AF37', color: '#0a0a0a', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', padding: '2px 8px', letterSpacing: '0.1em' }}>AERO</span>
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '8px' }}>CHOOSE YOUR USERNAME</h2>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>This is how you will appear inside the platform.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '8px' }}>USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. anirudh_jets"
              maxLength={20}
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
            <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '6px' }}>Letters, numbers, underscores only. Max 20 characters.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#f87171', fontSize: '13px' }}>
              {error}
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
            {loading ? 'SAVING...' : 'ENTER THE PLATFORM'}
          </button>
        </div>
      </div>
    </div>
  )
}
