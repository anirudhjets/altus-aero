import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }

const FREE_LIMIT = 20
const WINDOW_HOURS = 24

function getLiveUsage() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        return raw[monthKey] || { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
    } catch { return { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 } }
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
    } catch { return { count: 0, locked: false } }
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
    const { user, plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [annual, setAnnual] = useState(false)
    const [usage, setUsage] = useState({ sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 })
    const [limitStatus, setLimitStatus] = useState(getPlanLimitStatus)
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

    useEffect(() => {
        setUsage(getLiveUsage()); setLimitStatus(getPlanLimitStatus())
        const iv = setInterval(() => { setUsage(getLiveUsage()); setLimitStatus(getPlanLimitStatus()) }, 5000)
        return () => clearInterval(iv)
    }, [])

    useEffect(() => {
        if (searchParams.get('plan') === 'pro' && !isPro) {
            setTimeout(() => { const el = document.getElementById('upgrade-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 400)
        }
    }, [searchParams, isPro])

    const handleRazorpay = () => {
        window.open('mailto:anirudh.jets@gmail.com?subject=Altus Aero Pro Upgrade&body=I would like to upgrade to Pro. Please send payment details.', '_blank')
    }

    const calcsRemaining = Math.max(0, FREE_LIMIT - (limitStatus.count || 0))
    const isCalcLocked = !isPro && limitStatus.locked

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '760px', margin: '0 auto' }}>

            {/* Header */}
            <div>
                <p style={EYEBROW}>Subscription</p>
                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginTop: '6px' }}>BILLING</h1>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', marginTop: '6px' }}>Your plan, usage, and subscription management.</p>
            </div>

            {/* Current Plan */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={EYEBROW}>Current Plan</p>
                </div>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', lineHeight: 1.0, color: isPro ? '#C8C8C8' : '#333' }}>{isPro ? 'PRO' : 'FREE'}</p>
                        <p style={{ ...MONO, fontSize: '10px', color: '#444', marginTop: '6px', letterSpacing: '0.08em' }}>
                            {isPro ? 'Full platform access · All features active' : 'Core features · Upgrade to unlock everything'}
                        </p>
                        {isPro && plan === 'pro' && (
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ffffff', marginTop: '8px', lineHeight: 1 }}>
                                ₹2,499<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#444' }}> /month</span>
                            </p>
                        )}
                        {isProPreview && plan !== 'pro' && (
                            <p style={{ ...MONO, fontSize: '9px', color: 'rgba(200,200,200,0.4)', marginTop: '6px', letterSpacing: '0.06em' }}>Viewing as Pro · Preview mode active</p>
                        )}
                    </div>
                    <span style={{
                        ...MONO, fontSize: '10px', letterSpacing: '0.12em', padding: '6px 16px', borderRadius: '9999px',
                        color: isPro ? '#4ade80' : '#444',
                        background: isPro ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                        {isPro ? 'ACTIVE' : 'FREE TIER'}
                    </span>
                </div>
            </div>

            {/* Live Usage */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={EYEBROW}>Usage This Month</p>
                        <p style={{ ...MONO, fontSize: '9px', color: '#333', marginTop: '3px' }}>{currentMonth}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.06)', borderRadius: '9999px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        <span style={{ ...MONO, fontSize: '9px', color: '#4ade80', letterSpacing: '0.12em' }}>LIVE</span>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)' }} className="grid grid-cols-2 sm:grid-cols-4">
                    {[
                        { label: 'Sessions', value: String(usage.sessions || 1), sub: 'logins' },
                        { label: 'Days Active', value: String(usage.days?.length || 1), sub: 'unique days' },
                        { label: 'Routes Planned', value: isPro ? String(usage.routesPlanned || 0) : `${limitStatus.count || 0}/${FREE_LIMIT}`, sub: isPro ? 'unlimited' : isCalcLocked ? 'limit reached' : `${calcsRemaining} remaining`, highlight: !isPro && isCalcLocked },
                        { label: 'Fleet Views', value: String(usage.fleetViews || 0), sub: 'aircraft profiles' },
                    ].map((u, i) => (
                        <div key={i} style={{ padding: '20px', background: '#0a0a0a' }}>
                            <p style={{ ...EYEBROW, marginBottom: '8px' }}>{u.label}</p>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: u.highlight ? '#f87171' : '#C8C8C8', lineHeight: 1 }}>{u.value}</p>
                            <p style={{ ...MONO, fontSize: '9px', color: u.highlight ? 'rgba(248,113,113,0.5)' : '#333', marginTop: '4px' }}>{u.sub}</p>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ ...MONO, fontSize: '9px', color: '#333', letterSpacing: '0.06em' }}>Usage tracked locally on this device. Free users get {FREE_LIMIT} charter calculations per 24-hour window.</p>
                </div>
            </div>

            {/* Upgrade section */}
            {(!isPro || isProPreview) ? (
                <div id="upgrade-section" style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={EYEBROW}>Choose Your Plan</p>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {/* Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <span style={{ ...MONO, fontSize: '10px', color: !annual ? '#ffffff' : '#444' }}>Monthly</span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                style={{ width: '44px', height: '24px', borderRadius: '9999px', background: annual ? '#C8C8C8' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
                            >
                                <span style={{ position: 'absolute', top: '3px', left: annual ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: annual ? '#0a0a0a' : '#333', transition: 'left 0.2s' }} />
                            </button>
                            <span style={{ ...MONO, fontSize: '10px', color: annual ? '#ffffff' : '#444' }}>
                                Annual <span style={{ color: '#4ade80' }}>–20%</span>
                            </span>
                        </div>

                        {/* Plans */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="grid grid-cols-1 sm:grid-cols-2">
                            {/* Free */}
                            <div style={{ padding: '32px', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '6px' }}>Free</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '44px', color: '#ffffff', lineHeight: 1, marginBottom: '6px' }}>₹0</p>
                                <p style={{ ...EYEBROW, color: '#333', marginBottom: '24px' }}>Forever</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                    {FREE_FEATURES.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <span style={{ color: '#C8C8C8', flexShrink: 0 }}>—</span>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#444' }}>{f}</p>
                                        </li>
                                    ))}
                                </ul>
                                <p style={{ ...MONO, fontSize: '10px', color: '#333', textAlign: 'center' }}>CURRENT PLAN</p>
                            </div>

                            {/* Pro */}
                            <div style={{ padding: '32px', background: '#080808', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(200,200,200,0.15)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,200,200,0.5), transparent)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ffffff', letterSpacing: '0.05em' }}>Pro</p>
                                    <span style={{ ...MONO, fontSize: '9px', letterSpacing: '0.12em', color: '#0a0a0a', background: '#C8C8C8', padding: '3px 10px', borderRadius: '9999px' }}>RECOMMENDED</span>
                                </div>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '44px', color: '#ffffff', lineHeight: 1, marginBottom: '4px' }}>₹{annual ? '1,999' : '2,499'}</p>
                                <p style={{ ...EYEBROW, color: '#333', marginBottom: annual ? '4px' : '24px' }}>/month</p>
                                {annual && <p style={{ ...MONO, fontSize: '9px', color: '#4ade80', marginBottom: '24px' }}>₹23,988 billed annually — save ₹6,000</p>}
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                    {PRO_FEATURES.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <span style={{ color: '#C8C8C8', flexShrink: 0 }}>—</span>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{f}</p>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={handleRazorpay}
                                    style={{ ...MONO, fontSize: '11px', letterSpacing: '0.15em', padding: '14px', background: '#C8C8C8', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {annual ? 'UPGRADE — ₹23,988/YR' : 'UPGRADE — ₹2,499/MO'}
                                </button>
                                <p style={{ ...MONO, fontSize: '9px', color: '#333', textAlign: 'center', marginTop: '10px' }}>Payment via Razorpay · Cancel any time</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={EYEBROW}>Manage Subscription</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                        {[
                            { label: 'Billing and Invoices', sub: 'View payment history and download invoices', action: () => window.open('mailto:anirudh.jets@gmail.com?subject=Billing%20Query', '_blank'), btnLabel: 'CONTACT', danger: false },
                            { label: 'Cancel Subscription', sub: 'Access continues until the end of your billing period', action: () => window.open('mailto:anirudh.jets@gmail.com?subject=Cancel%20Subscription', '_blank'), btnLabel: 'CANCEL', danger: true },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '20px 24px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                                <div>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>{item.label}</p>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '3px' }}>{item.sub}</p>
                                </div>
                                <button
                                    onClick={item.action}
                                    style={{
                                        ...MONO, fontSize: '10px', letterSpacing: '0.12em', padding: '8px 18px', background: 'transparent', cursor: 'pointer',
                                        border: item.danger ? '1px solid rgba(127,29,29,0.6)' : '1px solid rgba(255,255,255,0.1)',
                                        color: item.danger ? '#f87171' : '#555',
                                        borderRadius: '9999px', transition: 'all 0.2s',
                                    }}
                                >
                                    {item.btnLabel}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer note */}
            <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.05)', background: '#080808' }}>
                <p style={{ ...EYEBROW, marginBottom: '8px' }}>A Note on Free Forever</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#444', lineHeight: 1.8 }}>
                    The Free plan will always exist. You can learn the aircraft, run cost calculations, and study the market without paying anything. Pro is for brokers who are actively pitching clients and need the depth that converts a conversation into a deal.
                </p>
            </div>
        </div>
    )
}