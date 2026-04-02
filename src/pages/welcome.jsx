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
    const { user, hasOnboarded, setHasOnboarded } = useAuth()

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true })
            return
        }
        if (hasOnboarded === true) {
            navigate('/app/dashboard', { replace: true })
        }
    }, [user, hasOnboarded, navigate])

    const handleEnter = async () => {
        if (user) {
            await supabase
                .from('profiles')
                .upsert({ id: user.id, has_onboarded: true })
        }
        setHasOnboarded(true)
        navigate('/app/dashboard', { replace: true })
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '48px',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '36px',
                            color: '#D4AF37',
                            letterSpacing: '0.2em',
                        }}
                    >
                        ALTUS
                    </span>
                    <span
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '13px',
                            background: '#D4AF37',
                            color: '#0a0a0a',
                            padding: '3px 10px',
                            letterSpacing: '0.1em',
                        }}
                    >
                        AERO
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.3 }}
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(34px, 8vw, 54px)',
                        color: '#ffffff',
                        letterSpacing: '0.05em',
                        lineHeight: 1.05,
                        marginBottom: '20px',
                    }}
                >
                    WELCOME TO ALTUS AERO
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.65,
                        maxWidth: '420px',
                        margin: '0 auto 48px',
                    }}
                >
                    Your broker intelligence terminal is live. Market data, fleet knowledge, and deal planning tools — built for brokers who educate before they sell.
                </motion.p>

                {/* Platform orientation */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '40px',
                        textAlign: 'left',
                    }}
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + i * 0.07 }}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '16px',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: 'Bebas Neue, sans-serif',
                                    fontSize: '13px',
                                    color: '#D4AF37',
                                    letterSpacing: '0.15em',
                                    marginBottom: '6px',
                                }}
                            >
                                {step.label}
                            </p>
                            <p
                                style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.4)',
                                    lineHeight: 1.55,
                                }}
                            >
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.25 }}
                >
                    <button
                        onClick={handleEnter}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        style={{
                            background: '#D4AF37',
                            color: '#0a0a0a',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '16px 0',
                            width: '100%',
                            maxWidth: '340px',
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '15px',
                            letterSpacing: '0.15em',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        ENTER THE PLATFORM
                    </button>
                </motion.div>

            </div>
        </div>
    )
}