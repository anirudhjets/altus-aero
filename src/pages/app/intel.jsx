import { useAuth } from '../../context/AuthContext'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts'

const marketSignals = [
    {
        label: 'Charter Demand Index',
        value: '74',
        unit: '/100',
        trend: '+6 vs last month',
        trendUp: true,
        context:
            'Demand is elevated — position premium aircraft confidently this quarter. Clients are more likely to commit on longer bookings.',
    },
    {
        label: 'Avg Fuel Price',
        value: '$6.50',
        unit: '/gal',
        trend: '+8% vs last quarter',
        trendUp: false,
        context:
            'Fuel costs are rising. Factor this into every trip cost calculation. Clients who lock in charters now get ahead of rate increases.',
    },
    {
        label: 'VABB Movements',
        value: '42',
        unit: 'today',
        trend: '+4 vs yesterday',
        trendUp: true,
        context:
            'Mumbai traffic is high — a strong signal for regional charter demand. Active operations mean more opportunity to place aircraft.',
    },
    {
        label: 'Pre-owned Market',
        value: '-8%',
        unit: 'YTD',
        trend: 'Values declining',
        trendUp: false,
        context:
            "Buyer's market. Values are down and motivated sellers are moving. This is the right time to advise acquisition clients to act.",
    },
]

const demandTrend = [
    { month: 'Oct', index: 61 },
    { month: 'Nov', index: 65 },
    { month: 'Dec', index: 72 },
    { month: 'Jan', index: 68 },
    { month: 'Feb', index: 70 },
    { month: 'Mar', index: 74 },
]

const fuelTrend = [
    { month: 'Oct', price: 5.8 },
    { month: 'Nov', price: 6.0 },
    { month: 'Dec', price: 6.1 },
    { month: 'Jan', price: 6.3 },
    { month: 'Feb', price: 6.4 },
    { month: 'Mar', price: 6.5 },
]

const routeDemand = [
    {
        route: 'VABB → EGLL',
        label: 'Mumbai to London',
        demand: 'Very High',
        demandClass: 'text-green-400 bg-green-400/10 border-green-400/20',
        context:
            'Peak demand corridor. G650ER or Global 7500 are the correct answers. Never recommend anything below 7,000nm range for this route.',
    },
    {
        route: 'VABB → OMDB',
        label: 'Mumbai to Dubai',
        demand: 'High',
        demandClass: 'text-green-400 bg-green-400/10 border-green-400/20',
        context:
            'Year-round demand. Midsize and large jets both qualify. High frequency means competitive charter rates — know the rate range.',
    },
    {
        route: 'VABB → VIDP',
        label: 'Mumbai to Delhi',
        demand: 'Moderate',
        demandClass: 'text-gold bg-gold/10 border-gold/20',
        context:
            'Strong domestic corridor. Light jets like the Phenom 300E are ideal. Short sectors mean low per-trip cost — easy client conversion.',
    },
    {
        route: 'VABB → KTEB',
        label: 'Mumbai to New York',
        demand: 'Low',
        demandClass: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        context:
            'Low frequency but very high margin. Ultra-long range only. When a client asks — this is a G700 or Global 7500 conversation.',
    },
    {
        route: 'VABB → WSSS',
        label: 'Mumbai to Singapore',
        demand: 'Moderate',
        demandClass: 'text-gold bg-gold/10 border-gold/20',
        context:
            'Growing corridor. Super-midsize jets hit this route efficiently. Praetor 600 or Challenger 350 are the right starting points.',
    },
]

export default function Intel() {
    const { plan } = useAuth()
    const isPro = plan === 'pro'

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <p className="section-label">LIVE MARKET DATA</p>
                    <h1 className="font-display text-3xl md:text-4xl text-white">INTEL</h1>
                    <p className="font-body text-gray-400 text-sm mt-1">
                        Market signals with broker context on every data point.
                    </p>
                </div>
                {!isPro && (
                    <span className="font-mono text-xs text-orange-400 border border-orange-400/20 bg-orange-400/5 px-3 py-1.5 rounded self-start sm:self-auto">
                        24HR DELAYED
                    </span>
                )}
                {isPro && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-mono text-xs text-green-400">LIVE DATA</span>
                    </div>
                )}
            </div>

            {/* Market Signals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {marketSignals.map((signal, i) => (
                    <div key={i} className="glass p-4 sm:p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-mono text-xs text-gray-500 leading-tight">{signal.label}</p>
                            {!isPro && (
                                <span className="font-mono text-xs text-orange-400/70 flex-shrink-0">24HR</span>
                            )}
                        </div>
                        <div>
                            <span className="font-display text-3xl text-gold">{signal.value}</span>
                            <span className="font-mono text-xs text-gray-500 ml-1">{signal.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`text-xs font-mono ${signal.trendUp ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {signal.trendUp ? '▲' : '▼'}
                            </span>
                            <span className="font-mono text-xs text-gray-500">{signal.trend}</span>
                        </div>
                        <div className="border-t border-[#1c1c1c] pt-3">
                            <p className="font-mono text-xs text-gold mb-1">BROKER CONTEXT</p>
                            <p className="font-body text-xs text-gray-400 leading-relaxed">{signal.context}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                {/* Charter Demand Trend */}
                <div className="glass p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                        <p className="section-label">CHARTER DEMAND INDEX</p>
                        {!isPro && (
                            <span className="font-mono text-xs text-orange-400/70">24HR DELAYED</span>
                        )}
                    </div>
                    <p className="font-mono text-xs text-gray-500 mb-4">6-month trend — 100 = peak demand</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={demandTrend}>
                            <defs>
                                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[50, 100]}
                                tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid #1c1c1c',
                                    borderRadius: 8,
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: 10,
                                }}
                                formatter={v => [`${v}/100`, 'Demand Index']}
                            />
                            <Area
                                type="monotone"
                                dataKey="index"
                                stroke="#D4AF37"
                                fill="url(#demandGrad)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-3 p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                        <p className="font-mono text-xs text-gray-500 mb-1">BROKER READ</p>
                        <p className="font-body text-xs text-gray-300 leading-relaxed">
                            Demand has risen 21% since October. Clients asking for long-range jets are more committed than six months ago — reduce negotiation buffer accordingly.
                        </p>
                    </div>
                </div>

                {/* Fuel Price Trend */}
                <div className="glass p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                        <p className="section-label">FUEL PRICE TREND</p>
                        {!isPro && (
                            <span className="font-mono text-xs text-orange-400/70">24HR DELAYED</span>
                        )}
                    </div>
                    <p className="font-mono text-xs text-gray-500 mb-4">6-month trend — USD per gallon</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={fuelTrend}>
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[5, 7]}
                                tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid #1c1c1c',
                                    borderRadius: 8,
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: 10,
                                }}
                                formatter={v => [`$${v}/gal`, 'Fuel']}
                            />
                            <Bar dataKey="price" fill="#1e3a8a" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                        <p className="font-mono text-xs text-gray-500 mb-1">BROKER READ</p>
                        <p className="font-body text-xs text-gray-300 leading-relaxed">
                            Fuel is up 12% since October. On a VABB to EGLL sector, that adds roughly $4,000 to the trip cost. Build this into every quote — do not get caught short.
                        </p>
                    </div>
                </div>
            </div>

            {/* Route Demand Highlights */}
            <div className="glass p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="section-label">ROUTE DEMAND HIGHLIGHTS</p>
                        <p className="font-mono text-xs text-gray-500 mt-0.5">
                            Top Mumbai corridors — demand level with broker context
                        </p>
                    </div>
                    {!isPro && (
                        <span className="font-mono text-xs text-orange-400/70 flex-shrink-0">24HR DELAYED</span>
                    )}
                </div>
                <div className="space-y-3">
                    {routeDemand.map((route, i) => (
                        <div
                            key={i}
                            className="p-3 sm:p-4 rounded-xl border border-[#1c1c1c] hover:border-gold/30 transition-colors"
                            style={{ background: 'rgba(13,13,13,0.6)' }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-sm text-white font-bold">{route.route}</p>
                                    <p className="font-body text-xs text-gray-500">{route.label}</p>
                                </div>
                                <span
                                    className={`font-mono text-xs px-2 py-0.5 rounded border self-start flex-shrink-0 ${route.demandClass}`}
                                >
                                    {route.demand}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <p className="font-mono text-xs text-gold flex-shrink-0 mt-0.5">→</p>
                                <p className="font-body text-xs text-gray-400 leading-relaxed">{route.context}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}