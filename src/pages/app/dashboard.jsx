import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const insights = [
    'G650 vs G700: The G700 has 20% more cabin volume. For clients flying 6+ hours, upgrade conversations are easier when you show them this side by side.',
    'Mumbai to London nonstop requires minimum 4,400nm range. Only 6 production aircraft qualify. Know which ones before your next client call.',
    'Pre-owned business jet values dropped ~8% in Q1 2026. Buyers market — great time to advise acquisition clients.',
    'Charter vs ownership breakeven is typically 200–250 flight hours per year. Below that, charter almost always wins financially.',
]

const chartData = [
    { month: 'Jan', charter: 185000, ownership: 95000 },
    { month: 'Feb', charter: 192000, ownership: 95000 },
    { month: 'Mar', charter: 178000, ownership: 95000 },
    { month: 'Apr', charter: 205000, ownership: 95000 },
    { month: 'May', charter: 198000, ownership: 95000 },
    { month: 'Jun', charter: 220000, ownership: 95000 },
]

const apiData = [
    { day: 'Mon', calls: 120 },
    { day: 'Tue', calls: 98 },
    { day: 'Wed', calls: 145 },
    { day: 'Thu', calls: 87 },
    { day: 'Fri', calls: 162 },
    { day: 'Sat', calls: 54 },
    { day: 'Sun', calls: 41 },
]

const flights = [
    { id: 'AIC001', route: 'VABB → EGLL', aircraft: 'G650ER', dep: '08:30 IST', eta: '13:45 GMT', status: 'En Route', progress: 62 },
    { id: 'AIC002', route: 'VABB → OMDB', aircraft: 'Global 7500', dep: '10:15 IST', eta: '12:30 GST', status: 'En Route', progress: 78 },
    { id: 'AIC003', route: 'VABB → YSSY', aircraft: 'G700', dep: '23:00 IST', eta: '15:20 AEDT', status: 'Scheduled', progress: 0 },
    { id: 'AIC004', route: 'VIDP → VABB', aircraft: 'Phenom 300E', dep: '06:00 IST', eta: '07:45 IST', status: 'En Route', progress: 91 },
    { id: 'AIC005', route: 'VABB → LFPB', aircraft: 'Falcon 7X', dep: '14:00 IST', eta: '18:30 CET', status: 'En Route', progress: 44 },
]

const statusColor = {
    'En Route': 'text-green-400 bg-green-400/10',
    'Scheduled': 'text-gold bg-gold/10',
    'Landed': 'text-gray-400 bg-gray-400/10',
}

export default function Dashboard() {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [insightIndex, setInsightIndex] = useState(0)

    useEffect(() => {
        const tick = () => {
            const now = new Date()
            setDate(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' }))
            setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now))
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setInsightIndex(i => (i + 1) % insights.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <p className="section-label text-xs sm:text-sm">YOUR MARKET INTELLIGENCE</p>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">{date}</h1>
                <p className="font-mono text-gold text-xs sm:text-sm mt-1">{time} IST</p>
            </div>

            {/* Today's Insight */}
            <div className="glass-gold p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <span className="font-mono text-xs text-jet bg-gold px-2 py-1 rounded flex-shrink-0">TODAY'S INSIGHT</span>
                <p className="font-body text-white text-xs sm:text-sm leading-relaxed">{insights[insightIndex]}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'API Calls Today', value: '847', sub: 'of 1,000 limit' },
                    { label: 'Active Flights', value: '4', sub: 'VABB region' },
                    { label: 'Reports Generated', value: '12', sub: 'this month' },
                    { label: 'Plan Tier', value: 'PRO', sub: 'upgrade available' },
                ].map((s, i) => (
                    <div key={i} className="stat-card p-3 sm:p-4">
                        <p className="font-mono text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="font-display text-2xl sm:text-3xl text-gold">{s.value}</p>
                        <p className="font-mono text-xs text-gray-600 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* 3 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* Col 1 — Jet Explorer */}
                <div className="glass p-4 sm:p-5">
                    <p className="section-label mb-3 sm:mb-4">JET EXPLORER</p>
                    <div className="space-y-2">
                        {[
                            { model: 'G650ER', range: '7,500nm', speed: '516 kts', color: '#0d1b3e' },
                            { model: 'G700', range: '7,750nm', speed: '526 kts', color: '#1e3a8a' },
                            { model: 'Global 7500', range: '7,700nm', speed: '516 kts', color: '#0f3460' },
                            { model: 'Falcon 7X', range: '5,950nm', speed: '482 kts', color: '#2d4a7a' },
                            { model: 'Phenom 300E', range: '2,010nm', speed: '453 kts', color: '#1a3a5c' },
                        ].map((jet, i) => (
                            <div key={i} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-[#1c1c1c] hover:border-gold transition-colors cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: jet.color, boxShadow: `0 0 8px ${jet.color}` }} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-display text-xs sm:text-sm text-white">{jet.model}</p>
                                    <p className="font-mono text-xs text-gray-500">{jet.range} · {jet.speed}</p>
                                </div>
                                <span className="text-gold text-xs">→</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 2 — Live Flights */}
                <div className="glass p-4 sm:p-5">
                    <p className="section-label mb-3 sm:mb-4">LIVE VABB FLIGHTS</p>
                    <div className="space-y-2 sm:space-y-3">
                        {flights.map((f, i) => (
                            <div key={i} className="p-2.5 sm:p-3 rounded-lg border border-[#1c1c1c] hover:border-gulf transition-colors">
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                    <p className="font-mono text-xs text-white font-bold truncate mr-2">{f.route}</p>
                                    <span className={`font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${statusColor[f.status]}`}>{f.status}</span>
                                </div>
                                <p className="font-mono text-xs text-gray-500 mb-1.5 sm:mb-2">{f.aircraft} · {f.dep} → {f.eta}</p>
                                {f.progress > 0 && (
                                    <div className="h-1 bg-[#1c1c1c] rounded-full">
                                        <div className="h-1 bg-gold rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 3 — Charts */}
                <div className="glass p-4 sm:p-5 space-y-4 sm:space-y-6">
                    <div>
                        <p className="section-label mb-2 sm:mb-3">CHARTER VS OWNERSHIP (USD)</p>
                        <ResponsiveContainer width="100%" height={130}>
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
                                <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1c1c1c', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                                <Area type="monotone" dataKey="charter" stroke="#D4AF37" fill="url(#charter)" strokeWidth={2} name="Charter" />
                                <Area type="monotone" dataKey="ownership" stroke="#1e3a8a" fill="url(#ownership)" strokeWidth={2} name="Ownership" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <p className="section-label mb-2 sm:mb-3">API USAGE THIS WEEK</p>
                        <ResponsiveContainer width="100%" height={90}>
                            <BarChart data={apiData}>
                                <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1c1c1c', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                                <Bar dataKey="calls" fill="#D4AF37" opacity={0.7} radius={[3, 3, 0, 0]} name="API Calls" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'Generate Report', icon: '📄' },
                    { label: 'Track Flight', icon: '◉' },
                    { label: 'Cost Analysis', icon: '💰' },
                    { label: 'Compare Aircraft', icon: '✈' },
                ].map((a, i) => (
                    <button key={i} className="glass p-3 sm:p-4 text-center hover:border-gold transition-colors group">
                        <span className="text-xl sm:text-2xl block mb-1 sm:mb-2">{a.icon}</span>
                        <p className="font-display text-xs sm:text-sm text-gray-400 group-hover:text-gold tracking-wider">{a.label}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}