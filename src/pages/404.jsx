import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.07,
                backgroundImage:
                    'linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(30,58,138,0.1) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, maxWidth: '480px' }}>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '48px' }}
                >
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: '#D4AF37', letterSpacing: '0.2em' }}>ALTUS</span>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '10px', background: '#D4AF37', color: '#0a0a0a', padding: '3px 8px', letterSpacing: '0.1em', borderRadius: '4px' }}>AERO</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: 'rgba(212,175,55,0.5)',
                        letterSpacing: '0.2em',
                        marginBottom: '16px',
                    }}>ERROR 404</p>

                    <h1 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(52px, 14vw, 96px)',
                        color: 'rgba(255,255,255,0.06)',
                        letterSpacing: '0.05em',
                        lineHeight: 1,
                        marginBottom: '8px',
                        userSelect: 'none',
                    }}>404</h1>

                    <h2 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(22px, 5vw, 32px)',
                        color: '#ffffff',
                        letterSpacing: '0.06em',
                        marginBottom: '16px',
                    }}>PAGE NOT FOUND</h2>

                    <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.35)',
                        lineHeight: 1.7,
                        maxWidth: '340px',
                        margin: '0 auto 40px',
                    }}>
                        This route doesn't exist in the flight plan. Head back to where you need to be.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '13px 24px',
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: '13px',
                                letterSpacing: '0.12em',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                        >
                            GO BACK
                        </button>

                        <Link
                            to={user ? '/app/dashboard' : '/'}
                            style={{
                                background: '#D4AF37',
                                color: '#0a0a0a',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '13px 24px',
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: '13px',
                                letterSpacing: '0.12em',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'inline-block',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {user ? 'GO TO DASHBOARD' : 'GO TO HOME'}
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}