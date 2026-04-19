import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const steps = [
    {
        label: 'INTEL',
        desc: 'Live market signals with broker context on every data point.',
    },
    {
        label: 'FLEET',
        desc: 'Every aircraft — full specs, range maps, and how to position each one.',
    },
    {
        label: 'TRACK',
        desc: 'Live flight intelligence with route demand context built in.',
    },
    {
        label: 'PLAN',
        desc: 'Deal cost planning with client framing on every output.',
    },
]

export default function Welcome() {
    const navigate = useNavigate()
    const { user, loading, hasOnboarded, setHasOnboarded } = useAuth()

    useEffect(() => {
        if (loading) return
        if (!user) { navigate('/login', { replace: true }); return }
        if (hasOnboarded === true) { navigate('/app/dashboard', { replace: true }) }
    }, [user, loading, hasOnboarded, navigate])

    const handleEnter = async () => {
        try {
            await supabase.from('profiles').update({ has_onboarded: true }).eq('id', user.id)
            setHasOnboarded(true)
        } catch { /* silent */ }
        navigate('/app/dashboard', { replace: true })
    }

    if (loading || hasOnboarded === null) return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid rgba(10,191,188,0.15)', borderTop: '2px solid #0ABFBC', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Grid background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage:
                        'linear-gradient(rgba(10,191,188,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,191,188,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }}
            />

            {/* Radial glow */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(10,60,58,0.12) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    width: '100%',
                    maxWidth: '560px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '52px',
                    }}
                >
                    <svg viewBox="0 0 300 220" style={{ display: 'block', width: '150px', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
  <line x1="150" y1="35" x2="150" y2="13" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
  <polygon points="150,35 202,65 202,125 150,155 98,125 98,65" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
  <line x1="118" y1="125" x2="133" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="150" y1="125" x2="133" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="126" y1="92" x2="141" y2="92" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  <line x1="150" y1="60" x2="150" y2="125" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="150" y1="125" x2="167" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="182" y1="125" x2="167" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="159" y1="92" x2="174" y2="92" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  <text x="150" y="185" textAnchor="middle" fill="white" fontFamily="DM Sans, sans-serif" fontWeight="200" fontSize="16" letterSpacing="10">ALTUS AERO</text>
  <line x1="118" y1="202" x2="182" y2="202" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
</svg>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(34px, 8vw, 56px)',
                        color: '#ffffff',
                        letterSpacing: '0.05em',
                        lineHeight: 1.05,
                        marginBottom: '18px',
                    }}
                >
                    WELCOME TO ALTUS AERO
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.42)',
                        lineHeight: 1.7,
                        maxWidth: '420px',
                        margin: '0 auto 52px',
                    }}
                >
                    Your broker intelligence terminal is live. Market data, fleet knowledge, and deal planning — built for brokers who educate before they sell.
                </motion.p>

                {/* Platform orientation grid */}
                <div
                    className="grid-cols-1 sm:grid-cols-2"
                    style={{
                        display: 'grid',
                        gap: '10px',
                        marginBottom: '44px',
                        textAlign: 'left',
                    }}
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.45,
                                delay: 0.8 + i * 0.08,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '12px',
                                padding: '18px',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: 'Bebas Neue, sans-serif',
                                    fontSize: '13px',
                                    color: '#0ABFBC',
                                    letterSpacing: '0.18em',
                                    marginBottom: '7px',
                                }}
                            >
                                {step.label}
                            </p>
                            <p
                                style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.38)',
                                    lineHeight: 1.6,
                                }}
                            >
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <button
                        onClick={handleEnter}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.84')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        style={{
                            background: '#0ABFBC',
                            color: '#0a0a0a',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '17px 0',
                            width: '100%',
                            maxWidth: '340px',
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '16px',
                            letterSpacing: '0.18em',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        ENTER THE PLATFORM
                    </button>

                    <p
                        style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.18)',
                            marginTop: '16px',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Teach first. Sell second.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}