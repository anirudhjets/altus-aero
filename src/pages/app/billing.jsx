import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const FREE_LIMIT = 20
const WINDOW_HOURS = 24

function getLiveUsage() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        return raw[monthKey] || { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
    } catch {
        return { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
    }
}

function getPlanLimitStatus() {
    try {
        const raw = JSON.parse(localStorage.getItem('altus_plan_limit') || '{}')
        const now = Date.now()
        const windowStart = raw.windowStart || now
        const windowEnd = windowStart + WINDOW_HOURS * 3600000
        if (now > windowEnd) return { count: 0, locked: false }
        const count = raw.count || 0
        return { count, locked: count >= FREE_LIMIT, resetsAt: count >= FREE_LIMIT ? windowEnd : null }
    } catch {
        return { count: 0, locked: false }
    }
}

const FREE_FEATURES = [
    'Dashboard with market intelligence and rotating broker insights',
    'Fleet — browse all 14 aircraft with full specifications',
    'Charter Cost Calculator — 20 calculations per 24 hours',
    'Charter vs Ownership Calculator — unlimited',
    'Market Intel — 24-hour delayed signals',
    'Flight tracking — previous day data',
]

const PRO_FEATURES = [
    'Everything in Free',
    'Charter Cost Calculator — unlimited calculations, no cooldown',
    'Fleet — Broker Insight on every aircraft',
    'Fleet — Cockpit Brief per aircraft',
    'Fleet — side-by-side comparison (up to 3 aircraft)',
    'Intel — live real-time market signals',
    'Intel — Broker Context on every signal',
    'Track — live real-time flight intelligence',
    'Track — interactive map with live positions',
    'Plan — Client Framing on every calculation',
    'Plan — Route Optimisation suggestions',
    'AI Advisor — powered by Claude (coming soon)',
]

export default function Billing() {
    const { user, plan, signOut } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [annual, setAnnual] = useState(false)
    const [usage, setUsage] = useState({ sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 })
    const [limitStatus, setLimitStatus] = useState(getPlanLimitStatus)

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

    useEffect(() => {
        setUsage(getLiveUsage())
        setLimitStatus(getPlanLimitStatus())
        const iv = setInterval(() => {
            setUsage(getLiveUsage())
            setLimitStatus(getPlanLimitStatus())
        }, 5000)
        return () => clearInterval(iv)
    }, [])

    useEffect(() => {
        if (searchParams.get('plan') === 'pro' && !isPro) {
            setTimeout(() => {
                const el = document.getElementById('upgrade-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 400)
        }
    }, [searchParams, isPro])

    const handleRazorpay = () => {
        window.open('mailto:anirudh.jets@gmail.com?subject=Altus Aero Pro Upgrade&body=I would like to upgrade to Pro. Please send payment details.', '_blank')
    }

    const calcsRemaining = Math.max(0, FREE_LIMIT - (limitStatus.count || 0))
    const isCalcLocked = !isPro && limitStatus.locked

    return (
        <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">

            <div>
                <p className="section-label">SUBSCRIPTION</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">BILLING</h1>
                <p className="font-body text-gray-400 text-sm mt-1">Your plan, usage, and subscription management.</p>
            </div>

            {/* Current Plan */}
            <div className="glass p-5 md:p-6">
                <p className="section-label mb-4">CURRENT PLAN</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', lineHeight: 1, color: isPro ? '#D4AF37' : '#6b7280' }}>
                            {isPro ? 'PRO' : 'FREE'}
                        </p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                            {isPro ? 'Full platform access · All features active' : 'Core features · Upgrade to unlock everything'}
                        </p>
                        {isPro && plan === 'pro' && (
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#fff', marginTop: '8px' }}>
                                ₹2,499<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}> /month</span>
                            </p>
                        )}
                        {isProPreview && plan !== 'pro' && (
                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(212,175,55,0.5)', marginTop: '6px' }}>
                                Viewing as Pro · Preview mode active from dashboard
                            </p>
                        )}
                    </div>
                    <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', padding: '6px 14px', borderRadius: '6px',
                        color: isPro ? '#4ade80' : '#6b7280',
                        background: isPro ? 'rgba(74,222,128,0.08)' : 'rgba(107,114,128,0.08)',
                        border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.2)'}`,
                    }}>
                        {isPro ? 'Active' : 'Free tier'}
                    </span>
                </div>
            </div>

            {/* Live Usage */}
            <div className="glass p-5 md:p-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                        <p className="section-label mb-0.5">USAGE THIS MONTH</p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{currentMonth}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4ade80', letterSpacing: '0.08em' }}>LIVE</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Sessions', value: String(usage.sessions || 1), sub: 'platform logins' },
                        { label: 'Days Active', value: String(usage.days?.length || 1), sub: 'unique days this month' },
                        {
                            label: 'Routes Planned',
                            value: isPro ? String(usage.routesPlanned || 0) : `${limitStatus.count || 0} / ${FREE_LIMIT}`,
                            sub: isPro ? 'unlimited' : isCalcLocked ? 'limit reached — resets in 24h' : `${calcsRemaining} remaining today`,
                            highlight: !isPro && isCalcLocked,
                        },
                        { label: 'Fleet Views', value: String(usage.fleetViews || 0), sub: 'aircraft profiles opened' },
                    ].map((u, i) => (
                        <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#0d0d0d', border: `1px solid ${u.highlight ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{u.label}</p>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: u.highlight ? '#f87171' : '#D4AF37', lineHeight: 1 }}>{u.value}</p>
                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: u.highlight ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.2)', marginTop: '4px' }}>{u.sub}</p>
                        </div>
                    ))}
                </div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.15)', marginTop: '12px' }}>
                    Usage tracked locally on this device. Free users get {FREE_LIMIT} charter calculations per 24-hour window. Ownership calculator is always unlimited.
                </p>
            </div>

            {/* Upgrade section */}
            {(!isPro || isProPreview) ? (
                <div id="upgrade-section" className="space-y-4">
                    <div className="glass p-5 md:p-6">
                        <p className="section-label mb-4">CHOOSE YOUR PLAN</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: !annual ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>Monthly</span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                style={{ width: '44px', height: '24px', borderRadius: '12px', position: 'relative', border: 'none', cursor: 'pointer', background: annual ? '#D4AF37' : '#1c1c1c', transition: 'background 0.2s' }}
                            >
                                <span style={{ position: 'absolute', top: '4px', left: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#0a0a0a', transform: annual ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: annual ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>
                                Annual <span style={{ color: '#4ade80' }}>— save 20%</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Free */}
                            <div style={{ padding: '20px', borderRadius: '14px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#fff', letterSpacing: '0.05em', marginBottom: '4px' }}>Free</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', color: '#fff', marginBottom: '16px' }}>
                                    ₹0<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}> / forever</span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '16px' }}>
                                    {FREE_FEATURES.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ color: '#D4AF37', flexShrink: 0, marginTop: '1px' }}>✓</span>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{f}</p>
                                        </li>
                                    ))}
                                </ul>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>CURRENT PLAN</p>
                            </div>

                            {/* Pro */}
                            <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.3)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#fff', letterSpacing: '0.05em' }}>Pro</p>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', background: '#D4AF37', color: '#0a0a0a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>RECOMMENDED</span>
                                </div>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', color: '#fff', marginBottom: '2px' }}>
                                    ₹{annual ? '1,999' : '2,499'}<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}> /mo</span>
                                </p>
                                {annual && (
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4ade80', marginBottom: '4px' }}>₹23,988 billed annually — you save ₹6,000</p>
                                )}
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                                    {annual ? 'Billed once a year' : 'Cancel any time'}
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
                                    {PRO_FEATURES.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ color: '#D4AF37', flexShrink: 0, marginTop: '1px' }}>✓</span>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{f}</p>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={handleRazorpay}
                                    style={{ width: '100%', padding: '13px', background: '#D4AF37', color: '#0a0a0a', border: 'none', borderRadius: '10px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', letterSpacing: '0.15em', cursor: 'pointer', transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {annual ? 'UPGRADE — ₹23,988/yr' : 'UPGRADE — ₹2,499/mo'}
                                </button>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '10px' }}>
                                    Payment via Razorpay · Secure · Cancel any time
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass p-5 md:p-6 space-y-5">
                    <p className="section-label">MANAGE SUBSCRIPTION</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                            <div>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#fff', fontWeight: 500 }}>Billing and Invoices</p>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>View payment history and download invoices</p>
                            </div>
                            <button onClick={() => window.open('mailto:anirudh.jets@gmail.com?subject=Billing%20Query', '_blank')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #1c1c1c', color: 'rgba(255,255,255,0.5)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.1em', cursor: 'pointer' }}>
                                CONTACT
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                            <div>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#fff', fontWeight: 500 }}>Cancel Subscription</p>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Access continues until the end of your billing period</p>
                            </div>
                            <button onClick={() => window.open('mailto:anirudh.jets@gmail.com?subject=Cancel%20Subscription', '_blank')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #7f1d1d', color: '#f87171', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.1em', cursor: 'pointer' }}>
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ padding: '16px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '6px' }}>A NOTE ON FREE FOREVER</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                    The Free plan will always exist. You can learn the aircraft, run cost calculations, and study the market without paying anything. Pro is for brokers who are actively pitching clients and need the depth that converts a conversation into a deal.
                </p>
            </div>
        </div>
    )
}