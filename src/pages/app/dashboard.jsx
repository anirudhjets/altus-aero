import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'

const insights = [
    'G650 vs G700: The G700 has 20% more cabin volume. For clients flying 6+ hours, the upgrade conversation becomes obvious when you show them the numbers side by side.',
    'Mumbai to London nonstop demands a minimum 4,400nm range. Only 6 production aircraft qualify. Know the shortlist before your next client call.',
    'Pre-owned business jet values dropped roughly 8% in Q1 2026. It is a buyer\'s market — the right time to advise acquisition clients to move.',
    'Charter vs ownership breakeven sits at 200 to 250 flight hours per year. Below that threshold, charter almost always wins on cost.',
    'The Phenom 300E is the world\'s best-selling light jet for six consecutive years. For shorter routes under 2,000nm, it is the first aircraft to recommend.',
    'Ultra-long-range jets (G700, Global 7500) typically command a 40 to 60% premium over large jets on transatlantic routes. Know when the premium is justified.',
]

const flights = [
    { id: 'AIC001', route: 'VABB → EGLL', aircraft: 'G650ER', dep: '08:30 IST', eta: '13:45 GMT', status: 'En Route', progress: 62 },
    { id: 'AIC002', route: 'VABB → OMDB', aircraft: 'Global 7500', dep: '10:15 IST', eta: '12:30 GST', status: 'En Route', progress: 78 },
    { id: 'AIC003', route: 'VABB → YSSY', aircraft: 'G700', dep: '23:00 IST', eta: '15:20 AEDT', status: 'Scheduled', progress: 0 },
    { id: 'AIC004', route: 'VIDP → VABB', aircraft: 'Phenom 300E', dep: '06:00 IST', eta: '07:45 IST', status: 'En Route', progress: 91 },
    { id: 'AIC005', route: 'VABB → LFPB', aircraft: 'Falcon 7X', dep: '14:00 IST', eta: '18:30 CET', status: 'En Route', progress: 44 },
]

const statusColor = {
    'En Route': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Scheduled': 'text-gold bg-gold/10 border-gold/20',
    'Landed': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
}

const fleetShortlist = [
    { model: 'G650ER', range: '7,500nm', speed: '516 kts', category: 'Ultra Long Range', color: '#1e3a8a' },
    { model: 'G700', range: '7,750nm', speed: '526 kts', category: 'Ultra Long Range', color: '#1e3a8a' },
    { model: 'Global 7500', range: '7,700nm', speed: '516 kts', category: 'Ultra Long Range', color: '#0f3460' },
    { model: 'Falcon 7X', range: '5,950nm', speed: '482 kts', category: 'Large Jet', color: '#2d4a7a' },
    { model: 'Phenom 300E', range: '2,010nm', speed: '453 kts', category: 'Light Jet', color: '#1a3a5c' },
]

function getLast6Months() {
    const chartValues = [175000, 192000, 210000, 185000, 198000, 220000]
    const ownership = 95000
    const months = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        months.push({
            month: d.toLocaleString('en-US', { month: 'short' }),
            charter: chartValues[5 - i],
            ownership,
        })
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

export default function Dashboard() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [insightIndex, setInsightIndex] = useState(0)
    const [insightVisible, setInsightVisible] = useState(true)
    const [proPreview, setProPreview] = useState(() => {
        return sessionStorage.getItem('altus_pro_preview') === 'true'
    })
    const [usage, setUsage] = useState({ sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 })
    const navigate = useNavigate()
    const { plan } = useAuth()
    const isPro = plan === 'pro' || proPreview

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const chartData = getLast6Months()

    // Toggle pro preview — persists to sessionStorage + signals AppLayout
    const toggleProPreview = () => {
        const newVal = !proPreview
        setProPreview(newVal)
        sessionStorage.setItem('altus_pro_preview', String(newVal))
        window.dispatchEvent(new CustomEvent('altusProPreviewChange', { detail: { isPro: newVal } }))
    }

    useEffect(() => {
        setUsage(getUsageStats())
    }, [])

    useEffect(() => {
        const tick = () => {
            const now = new Date()
            setDate(
                now.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'Asia/Kolkata',
                })
            )
            setTime(
                new Intl.DateTimeFormat('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }).format(now)
            )
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setInsightVisible(false)
            setTimeout(() => {
                setInsightIndex((i) => (i + 1) % insights.length)
                setInsightVisible(true)
            }, 400)
        }, 9000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="section-label text-xs sm:text-sm">MARKET INTELLIGENCE</p>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">{date}</h1>
                    <p className="font-mono text-gold text-xs sm:text-sm mt-1">{time} IST</p>
                </div>

                {/* Pro preview toggle — dev tool, no banner, just the button */}
                <button
                    onClick={toggleProPreview}
                    style={{
                        alignSelf: 'flex-start',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: proPreview ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)',
                        background: proPreview ? 'rgba(212,175,55,0.08)' : 'transparent',
                        color: proPreview ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                    }}
                    title="Toggle Pro preview"
                >
                    {proPreview ? 'VIEWING: PRO' : 'PREVIEW PRO'}
                </button>
            </div>

            {/* Today's Insight */}
            <div className="glass-gold p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <span className="font-mono text-xs text-jet bg-gold px-2 py-1 rounded flex-shrink-0 tracking-wider">
                    INSIGHT
                </span>
                <p
                    className="font-body text-white text-xs sm:text-sm leading-relaxed transition-opacity duration-400"
                    style={{ opacity: insightVisible ? 1 : 0 }}
                >
                    {insights[insightIndex]}
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {[
                    {
                        label: 'Active Flights',
                        value: '4',
                        sub: 'VABB region now',
                        action: () => navigate('/app/track'),
                    },
                    {
                        label: 'Fleet Tracked',
                        value: '14',
                        sub: 'aircraft in database',
                        action: () => navigate('/app/fleet'),
                    },
                    {
                        label: 'Mission Plans',
                        value: isPro ? 'Unlimited' : '1 of 1',
                        sub: isPro ? 'all routes unlocked' : 'upgrade for unlimited',
                        action: () => navigate('/app/plan'),
                    },
                    {
                        label: 'Your Plan',
                        value: isPro ? 'PRO' : 'FREE',
                        sub: isPro ? 'all features active' : 'tap to go Pro',
                        action: () => navigate('/app/billing'),
                    },
                ].map((s, i) => (
                    <button
                        key={i}
                        onClick={s.action}
                        className="stat-card p-3 sm:p-4 text-left hover:border-gold transition-colors group"
                    >
                        <p className="font-mono text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="font-display text-2xl sm:text-3xl text-gold">{s.value}</p>
                        <p className="font-mono text-xs text-gray-600 mt-1 group-hover:text-gray-400 transition-colors">
                            {s.sub}
                        </p>
                    </button>
                ))}
            </div>

            {/* 3 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* Col 1 — Fleet Shortlist */}
                <div className="glass p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <p className="section-label">FLEET SHORTLIST</p>
                        <button
                            onClick={() => navigate('/app/fleet')}
                            className="font-mono text-xs text-gold hover:text-white transition-colors"
                        >
                            View all →
                        </button>
                    </div>
                    <div className="space-y-2">
                        {fleetShortlist.map((jet, i) => (
                            <div
                                key={i}
                                onClick={() => navigate('/app/fleet')}
                                className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-[#1c1c1c] hover:border-gold transition-colors cursor-pointer group"
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ background: jet.color, boxShadow: `0 0 8px ${jet.color}` }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-display text-xs sm:text-sm text-white group-hover:text-gold transition-colors">
                                        {jet.model}
                                    </p>
                                    <p className="font-mono text-xs text-gray-500">
                                        {jet.range} · {jet.speed}
                                    </p>
                                </div>
                                <span className="text-gray-600 group-hover:text-gold text-xs transition-colors">→</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 2 — Live Flights */}
                <div className="glass p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <p className="section-label">LIVE VABB TRAFFIC</p>
                        <button
                            onClick={() => navigate('/app/track')}
                            className="font-mono text-xs text-gold hover:text-white transition-colors"
                        >
                            {isPro ? 'Full tracker →' : 'Pro only →'}
                        </button>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {flights.map((f, i) => (
                            <div
                                key={i}
                                className="p-2.5 sm:p-3 rounded-lg border border-[#1c1c1c] hover:border-gulf transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                    <p className="font-mono text-xs text-white font-bold truncate mr-2">{f.route}</p>
                                    <span
                                        className={`font-mono text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${statusColor[f.status]}`}
                                    >
                                        {f.status}
                                    </span>
                                </div>
                                <p className="font-mono text-xs text-gray-500 mb-1.5 sm:mb-2">
                                    {f.aircraft} · {f.dep} → {f.eta}
                                </p>
                                {f.progress > 0 && (
                                    <div className="h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
                                        <div
                                            className="h-1 bg-gold rounded-full transition-all"
                                            style={{ width: `${f.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 3 — Charter vs Ownership */}
                <div className="glass p-4 sm:p-5 space-y-4 sm:space-y-6">
                    <div>
                        <p className="section-label mb-1">CHARTER VS OWNERSHIP</p>
                        <p className="font-mono text-xs text-gray-500 mb-3">6-month cost comparison — USD</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="charter" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="ownership" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        background: '#0a0a0a',
                                        border: '1px solid #1c1c1c',
                                        borderRadius: 8,
                                        fontFamily: 'JetBrains Mono',
                                        fontSize: 10,
                                    }}
                                    formatter={(v) => [`$${v.toLocaleString()}`, '']}
                                />
                                <Area type="monotone" dataKey="charter" stroke="#D4AF37" fill="url(#charter)" strokeWidth={2} name="Charter" />
                                <Area type="monotone" dataKey="ownership" stroke="#1e3a8a" fill="url(#ownership)" strokeWidth={2} name="Ownership" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gold" />
                                <span className="font-mono text-xs text-gray-500">Charter</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gulf" />
                                <span className="font-mono text-xs text-gray-500">Ownership</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                        <p className="font-mono text-xs text-gray-500 mb-1">BREAKEVEN POINT</p>
                        <p className="font-display text-xl text-gold">200 – 250 hrs</p>
                        <p className="font-mono text-xs text-gray-600 mt-1">flight hours per year</p>
                    </div>
                </div>
            </div>

            {/* Usage This Month */}
            <div className="glass p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="section-label">USAGE THIS MONTH</p>
                        <p className="font-mono text-xs text-gray-500 mt-0.5">{currentMonth}</p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(74,222,128,0.08)',
                            border: '1px solid rgba(74,222,128,0.15)',
                        }}
                    >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4ade80', letterSpacing: '0.08em' }}>
                            LIVE
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Sessions', value: String(usage.sessions || 1), sub: 'platform logins' },
                        { label: 'Days Active', value: String(usage.days?.length || 1), sub: 'unique days' },
                        {
                            label: 'Routes Planned',
                            value: isPro ? String(usage.routesPlanned || 0) : '1 of 1',
                            sub: isPro ? 'this month' : 'free limit reached',
                        },
                        { label: 'Fleet Views', value: String(usage.fleetViews || 0), sub: 'aircraft profiles' },
                    ].map((u, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                background: '#0d0d0d',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                {u.label}
                            </p>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#D4AF37', lineHeight: 1 }}>
                                {u.value}
                            </p>
                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                                {u.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {!isPro && (
                    <div
                        style={{
                            marginTop: '14px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: 'rgba(212,175,55,0.04)',
                            border: '1px solid rgba(212,175,55,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px',
                        }}
                    >
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                            Upgrade to Pro to unlock unlimited usage tracking, live data, and the AI advisor.
                        </p>
                        <button
                            onClick={() => navigate('/app/billing')}
                            style={{
                                padding: '7px 16px',
                                borderRadius: '7px',
                                background: '#D4AF37',
                                color: '#0a0a0a',
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: '12px',
                                letterSpacing: '0.12em',
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                        >
                            UPGRADE TO PRO
                        </button>
                    </div>
                )}

                {isPro && plan !== 'pro' && (
                    <div
                        style={{
                            marginTop: '14px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: 'rgba(212,175,55,0.04)',
                            border: '1px solid rgba(212,175,55,0.12)',
                        }}
                    >
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.06em' }}>
                            Pro preview active — toggle off to return to Free view
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'Plan a Route', icon: '◈', path: '/app/plan', pro: false },
                    { label: 'Track a Flight', icon: '◉', path: '/app/track', pro: true },
                    { label: 'Compare Aircraft', icon: '✈', path: '/app/fleet', pro: false },
                    { label: isPro ? 'All Features Active' : 'Go Pro', icon: '◇', path: '/app/billing', pro: false, highlight: !isPro },
                ].map((a, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(a.path)}
                        className={`glass p-3 sm:p-4 text-center hover:border-gold transition-colors group ${a.highlight ? 'border-gold/40' : ''}`}
                    >
                        <span className={`text-xl sm:text-2xl block mb-1 sm:mb-2 ${a.highlight ? 'text-gold' : ''}`}>
                            {a.icon}
                        </span>
                        <p className={`font-display text-xs sm:text-sm tracking-wider ${a.highlight ? 'text-gold' : 'text-gray-400 group-hover:text-gold'} transition-colors`}>
                            {a.label}
                        </p>
                        {a.pro && !isPro && (
                            <p className="font-mono text-xs text-gray-600 mt-1">Pro only</p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}