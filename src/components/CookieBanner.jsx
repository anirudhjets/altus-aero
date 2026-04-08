import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const accepted = localStorage.getItem('altus_cookie_consent')
        if (!accepted) {
            // Small delay so it doesn't flash immediately on load
            const t = setTimeout(() => setVisible(true), 1200)
            return () => clearTimeout(t)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('altus_cookie_consent', 'accepted')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'calc(100% - 48px)',
            maxWidth: '640px',
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
            flexWrap: 'wrap',
            animation: 'slideUp 0.35s ease forwards',
        }}>
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

            <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.6,
                margin: 0,
                flex: 1,
                minWidth: '200px',
            }}>
                We use essential cookies to keep you signed in and track usage locally on your device. No advertising cookies.{' '}
                <Link to="/privacy" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                    Privacy Policy
                </Link>
            </p>

            <button
                onClick={handleAccept}
                style={{
                    background: '#D4AF37',
                    color: '#0a0a0a',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                GOT IT
            </button>
        </div>
    )
}