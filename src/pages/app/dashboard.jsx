import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }

const insights = [
    'G650 vs G700: The G700 has 20% more cabin volume. For clients flying 6+ hours, the upgrade conversation becomes obvious when you show them the numbers side by side.',
    'Mumbai to London nonstop demands a minimum 4,400nm range. Only 6 production aircraft qualify. Know the shortlist before your next client call.',
    'Pre-owned business jet values dropped roughly 8% in Q1 2026. It is a buyer\'s market — the right time to advise acquisition clients to move.',
    'Charter vs ownership breakeven sits at 200 to 250 flight hours per year. Below that threshold, charter almost always wins on cost.',
    'The Phenom 300E is the world\'s best-selling light jet for six consecutive years. For shorter routes under 2,000nm, it is the first aircraft to recommend.',
    'Ultra-long-range jets typically command a 40 to 60% premium over large jets on transatlantic routes. Know when the premium is justified.',
]

const flights = [
    { id: 'AIC001', route: 'VABB → EGLL', aircraft: 'G650ER', dep: '08:30 IST', eta: '13:45 GMT', status: 'En Route', progress: 62 },
    { id: 'AIC002', route: 'VABB → OMDB', aircraft: 'Global 7500', dep: '10:15 IST', eta: '12:30 GST', status: 'En Route', progress: 78 },
    { id: 'AIC003', route: 'VABB → YSSY', aircraft: 'G700', dep: '23:00 IST', eta: '15:20 AEDT', status: 'Scheduled', progress: 0 },
    { id: 'AIC004', route: 'VIDP → VABB', aircraft: 'Phenom 300E', dep: '06:00 IST', eta: '07:45 IST', status: 'En Route', progress: 91 },
    { id: 'AIC005', route: 'VABB → LFPB', aircraft: 'Falcon 7X', dep: '14:00 IST', eta: '18:30 CET', status: 'En Route', progress: 44 },
]

const fleetShortlist = [
    { model: 'G650ER', range: '7,500nm', speed: '516 kts', category: 'Ultra Long Range' },
    { model: 'G700', range: '7,750nm', speed: '526 kts', category: 'Ultra Long Range' },
    { model: 'Global 7500', range: '7,700nm', speed: '516 kts', category: 'Ultra Long Range' },
    { model: 'Falcon 7X', range: '5,950nm', speed: '482 kts', category: 'Large Jet' },
    { model: 'Phenom 300E', range: '2,010nm', speed: '453 kts', category: 'Light Jet' },
]

function getLast6Months() {
    const chartValues = [175000, 192000, 210000, 185000, 198000, 220000]
    const ownership = 95000
    const months = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i)
        months.push({ month: d.toLocaleString('en-US', { month: 'short' }), charter: chartValues[5 - i], ownership })
    }
    return months
}

function getUsageStats() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const today = new Date().toISOString().slice(0, 10)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!raw[monthKey]) raw[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        if (!raw[monthKey].days.includes(today)) {
            raw[monthKey].days.push(today)
            raw[monthKey].sessions = (raw[monthKey].sessions || 0) + 1
        }
        localStorage.setItem('altus_usage', JSON.stringify(raw))
        return raw[monthKey]
    } catch {
        return { sessions: 1, days: [new Date().toISOString().slice(0, 10)], routesPlanned: 0, fleetViews: 0 }
    }
}

const STATUS_COLOR = {
    'En Route': { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
    'Scheduled': { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.2)' },
    'Landed': { color: '#555', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
}

export default function Dashboard() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [insightIndex, setInsightIndex] = useState(0)
    const [insightVisible, setInsightVisible] = useState(true)
    const [usage, setUsage] = useState({ sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 })
    const navigate = useNavigate()
    const { plan } = useAuth()
    const [proPreview, setGlobalProPreview] = useProPreview()
    const isPro = plan === 'pro' || proPreview
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const chartData = getLast6Months()

    useEffect(() => { setUsage(getUsageStats()) }, [])

    useEffect(() => {
        const tick = () => {
            const now = new Date()
            setDate(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' }))
            setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now))
        }
        tick(); const interval = setInterval(tick, 1000); return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setInsightVisible(false)
            setTimeout(() => { setInsightIndex(i => (i + 1) % insights.length); setInsightVisible(true) }, 400)
        }, 9000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <p style={EYEBROW}>Market Intelligence</p>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginTop: '6px' }}>{date}</h1>
                    <p style={{ ...MONO, fontSize: '14px', color: '#D4AF37', marginTop: '4px', letterSpacing: '0.06em' }}>{time} IST</p>
                </div>
                <button
                    onClick={() => setGlobalProPreview(!proPreview)}
                    style={{
                        ...MONO, fontSize: '10px', letterSpacing: '0.12em', padding: '8px 16px',
                        borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                        borderColor: proPreview ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)',
                        background: proPreview ? 'rgba(212,175,55,0.06)' : 'transparent',
                        color: proPreview ? '#D4AF37' : '#444',
                    }}
                >
                    {proPreview ? 'VIEWING: PRO' : 'PREVIEW PRO'}
                </button>
            </div>

            {/* Insight */}
            <div style={{ padding: '20px 24px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ ...MONO, fontSize: '9px', color: '#0a0a0a', background: '#D4AF37', padding: '3px 10px', letterSpacing: '0.15em', flexShrink: 0, borderRadius: '9999px', marginTop: '2px' }}>INSIGHT</span>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, transition: 'opacity 0.4s', opacity: insightVisible ? 1 : 0 }}>
                    {insights[insightIndex]}
                </p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="xl:grid-cols-4">
                {[
                    { label: 'Active Flights', value: '4', sub: 'VABB region now', action: () => navigate('/app/track') },
                    { label: 'Fleet Tracked', value: '14', sub: 'aircraft in database', action: () => navigate('/app/fleet') },
                    { label: 'Mission Plans', value: isPro ? 'Unlimited' : '1 of 1', sub: isPro ? 'all routes unlocked' : 'upgrade for unlimited', action: () => navigate('/app/plan') },
                    { label: 'Your Plan', value: isPro ? 'PRO' : 'FREE', sub: isPro ? 'all features active' : 'tap to go Pro', action: () => navigate('/app/billing') },
                ].map((s, i) => (
                    <button
                        key={i}
                        onClick={s.action}
                        style={{ padding: '24px', background: '#0a0a0a', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
                    >
                        <p style={{ ...EYEBROW, marginBottom: '10px' }}>{s.label}</p>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#D4AF37', lineHeight: 1.0 }}>{s.value}</p>
                        <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '6px', letterSpacing: '0.08em' }}>{s.sub}</p>
                    </button>
                ))}
            </div>

            {/* 3 Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="grid grid-cols-1 lg:grid-cols-3">

                {/* Fleet Shortlist */}
                <div style={{ background: '#0a0a0a', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <p style={EYEBROW}>Fleet Shortlist</p>
                        <button onClick={() => navigate('/app/fleet')} style={{ ...MONO, fontSize: '9px', color: '#444', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                            VIEW ALL →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                        {fleetShortlist.map((jet, i) => (
                            <div
                                key={i}
                                onClick={() => navigate('/app/fleet')}
                                style={{ padding: '12px 16px', background: '#0a0a0a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
                            >
                                <div>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>{jet.model}</p>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '3px' }}>{jet.range} · {jet.speed}</p>
                                </div>
                                <span style={{ ...MONO, fontSize: '9px', color: '#333' }}>→</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Flights */}
                <div style={{ background: '#0a0a0a', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <p style={EYEBROW}>Live VABB Traffic</p>
                        <button onClick={() => navigate('/app/track')} style={{ ...MONO, fontSize: '9px', color: '#444', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                            {isPro ? 'TRACKER →' : 'PRO →'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                        {flights.map((f, i) => {
                            const s = STATUS_COLOR[f.status] || STATUS_COLOR['Landed']
                            return (
                                <div key={i} style={{ padding: '12px 16px', background: '#0a0a0a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <p style={{ ...MONO, fontSize: '11px', color: '#ffffff', letterSpacing: '0.04em' }}>{f.route}</p>
                                        <span style={{ ...MONO, fontSize: '8px', letterSpacing: '0.1em', padding: '2px 7px', border: `1px solid ${s.border}`, color: s.color, background: s.bg, borderRadius: '9999px' }}>
                                            {f.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#444', marginBottom: f.progress > 0 ? '8px' : 0 }}>{f.aircraft} · {f.dep} → {f.eta}</p>
                                    {f.progress > 0 && (
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}>
                                            <div style={{ height: '1px', background: '#D4AF37', width: `${f.progress}%` }} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Charter vs Ownership */}
                <div style={{ background: '#0a0a0a', padding: '24px' }}>
                    <p style={{ ...EYEBROW, marginBottom: '6px' }}>Charter vs Ownership</p>
                    <p style={{ ...MONO, fontSize: '9px', color: '#333', marginBottom: '16px' }}>6-month cost comparison — USD</p>
                    <ResponsiveContainer width="100%" height={140}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="charter" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ownership" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fill: '#333', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 10 }}
                                formatter={v => [`$${v.toLocaleString()}`, '']}
                            />
                            <Area type="monotone" dataKey="charter" stroke="#D4AF37" fill="url(#charter)" strokeWidth={1.5} name="Charter" />
                            <Area type="monotone" dataKey="ownership" stroke="#1e3a8a" fill="url(#ownership)" strokeWidth={1.5} name="Ownership" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                        {[{ color: '#D4AF37', label: 'Charter' }, { color: '#1e3a8a', label: 'Ownership' }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '1px', background: l.color, display: 'inline-block' }} />
                                <span style={{ ...MONO, fontSize: '9px', color: '#444' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', background: '#080808' }}>
                        <p style={{ ...EYEBROW, marginBottom: '6px' }}>Breakeven</p>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#D4AF37', lineHeight: 1 }}>200 – 250 hrs</p>
                        <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '4px' }}>flight hours per year</p>
                    </div>
                </div>
            </div>

            {/* Usage This Month */}
            <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <p style={EYEBROW}>Usage This Month</p>
                        <p style={{ ...MONO, fontSize: '9px', color: '#333', marginTop: '4px' }}>{currentMonth}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.06)', borderRadius: '9999px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        <span style={{ ...MONO, fontSize: '9px', color: '#4ade80', letterSpacing: '0.12em' }}>LIVE</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="grid grid-cols-2 sm:grid-cols-4">
                    {[
                        { label: 'Sessions', value: String(usage.sessions || 1), sub: 'logins' },
                        { label: 'Days Active', value: String(usage.days?.length || 1), sub: 'unique days' },
                        { label: 'Routes Planned', value: isPro ? String(usage.routesPlanned || 0) : '1 of 1', sub: isPro ? 'this month' : 'free limit' },
                        { label: 'Fleet Views', value: String(usage.fleetViews || 0), sub: 'aircraft profiles' },
                    ].map((u, i) => (
                        <div key={i} style={{ padding: '20px', background: '#0a0a0a' }}>
                            <p style={{ ...EYEBROW, marginBottom: '8px' }}>{u.label}</p>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#D4AF37', lineHeight: 1 }}>{u.value}</p>
                            <p style={{ ...MONO, fontSize: '9px', color: '#333', marginTop: '4px' }}>{u.sub}</p>
                        </div>
                    ))}
                </div>

                {!isPro && (
                    <div style={{ marginTop: '1px', padding: '16px 20px', background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555' }}>
                            Upgrade to Pro for unlimited usage, live data, and the AI advisor.
                        </p>
                        <button
                            onClick={() => navigate('/app/billing')}
                            style={{ ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 20px', background: '#D4AF37', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer' }}
                        >
                            UPGRADE TO PRO
                        </button>
                    </div>
                )}

                {isPro && plan !== 'pro' && (
                    <div style={{ marginTop: '12px', padding: '10px 16px', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <p style={{ ...MONO, fontSize: '9px', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em' }}>Pro preview active — toggle off on the header button to return to Free view</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="grid grid-cols-2 md:grid-cols-4">
                {[
                    { label: 'Plan a Route', icon: '◈', path: '/app/plan' },
                    { label: 'Track a Flight', icon: '◉', path: '/app/track', pro: true },
                    { label: 'Compare Aircraft', icon: '✈', path: '/app/fleet' },
                    { label: isPro ? 'All Features Active' : 'Go Pro', icon: '◇', path: '/app/billing', highlight: !isPro },
                ].map((a, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(a.path)}
                        style={{
                            padding: '24px', background: '#0a0a0a', border: 'none', cursor: 'pointer', textAlign: 'center',
                            transition: 'background 0.2s',
                            borderTop: a.highlight ? '1px solid rgba(212,175,55,0.2)' : 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
                    >
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px', color: a.highlight ? '#D4AF37' : '#555' }}>{a.icon}</span>
                        <p style={{ ...MONO, fontSize: '10px', letterSpacing: '0.12em', color: a.highlight ? '#D4AF37' : '#555' }}>{a.label.toUpperCase()}</p>
                        {a.pro && !isPro && <p style={{ ...MONO, fontSize: '8px', color: '#333', marginTop: '4px' }}>PRO ONLY</p>}
                    </button>
                ))}
            </div>
        </div>
    )
}