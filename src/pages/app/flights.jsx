import { useState } from 'react'

const allFlights = [
    { id: 'AIC001', route: 'VABB → EGLL', from: 'VABB', aircraft: 'G650ER', dep: '08:30 IST', eta: '13:45 GMT', altitude: 45000, speed: 516, status: 'En Route', progress: 62, distance_nm: 4465 },
    { id: 'AIC002', route: 'VABB → OMDB', from: 'VABB', aircraft: 'Global 7500', dep: '10:15 IST', eta: '12:30 GST', altitude: 43000, speed: 490, status: 'En Route', progress: 78, distance_nm: 1200 },
    { id: 'AIC003', route: 'VABB → YSSY', from: 'VABB', aircraft: 'G700', dep: '23:00 IST', eta: '15:20 AEDT', altitude: 0, speed: 0, status: 'Scheduled', progress: 0, distance_nm: 5765 },
    { id: 'AIC004', route: 'VIDP → VABB', from: 'VIDP', aircraft: 'Phenom 300E', dep: '06:00 IST', eta: '07:45 IST', altitude: 35000, speed: 453, status: 'En Route', progress: 91, distance_nm: 730 },
    { id: 'AIC005', route: 'VABB → LFPB', from: 'VABB', aircraft: 'Falcon 7X', dep: '14:00 IST', eta: '18:30 CET', altitude: 41000, speed: 482, status: 'En Route', progress: 44, distance_nm: 4380 },
    { id: 'AIC006', route: 'VABB → OMAA', from: 'VABB', aircraft: 'G650ER', dep: '16:30 IST', eta: '18:00 GST', altitude: 0, speed: 0, status: 'Scheduled', progress: 0, distance_nm: 1350 },
    { id: 'AIC007', route: 'VOBL → VABB', from: 'VOBL', aircraft: 'Phenom 300E', dep: '11:00 IST', eta: '12:15 IST', altitude: 28000, speed: 440, status: 'En Route', progress: 55, distance_nm: 520 },
]

const routeIntelligence = {
    'VABB → EGLL': {
        nonstop: true,
        qualifying_jets: ['G650ER', 'G700', 'Global 7500', 'Falcon 8X', 'G600', 'BD-700-1A11'],
        charter_range: '$175,000 – $195,000',
        ownership_range: '$95,000/month estimated',
        flight_time: '9h 20m typical',
        on_time: '91%',
        broker_tip: 'For VABB → EGLL, always lead with G650ER — it is the only sub-$75M jet that does this nonstop with full passengers and bags. Clients who push back on price need to understand there is no cheaper nonstop option at this range.',
    },
    'VABB → OMDB': {
        nonstop: true,
        qualifying_jets: ['G650ER', 'G700', 'Global 7500', 'Falcon 7X', 'Phenom 300E', 'Citation Longitude'],
        charter_range: '$28,000 – $38,000',
        ownership_range: '$18,000/month estimated',
        flight_time: '2h 45m typical',
        on_time: '94%',
        broker_tip: 'Short regional route — any midsize or larger jet qualifies. Charter is almost always more economical than ownership at this distance unless client flies 5+ times monthly.',
    },
    'VABB → YSSY': {
        nonstop: false,
        qualifying_jets: ['Global 7500 (with fuel stop)', 'G700 (with fuel stop)'],
        charter_range: '$280,000 – $340,000',
        ownership_range: '$160,000/month estimated',
        flight_time: '14h 30m with fuel stop',
        on_time: '87%',
        broker_tip: 'No production jet does VABB to YSSY fully nonstop. Global 7500 comes closest with a technical stop in Singapore or Perth. Always quote with fuel stop included — clients appreciate the transparency.',
    },
    'VIDP → VABB': {
        nonstop: true,
        qualifying_jets: ['Phenom 300E', 'Citation CJ4', 'G650ER', 'G700', 'Falcon 7X'],
        charter_range: '$18,000 – $25,000',
        ownership_range: '$12,000/month estimated',
        flight_time: '1h 45m typical',
        on_time: '88%',
        broker_tip: 'Delhi to Mumbai is India\'s busiest business aviation corridor. Phenom 300E is the most cost effective option. Use this route to open first-time private flyer conversations — the time savings vs commercial is dramatic.',
    },
    'VABB → LFPB': {
        nonstop: true,
        qualifying_jets: ['G650ER', 'G700', 'Global 7500', 'Falcon 7X'],
        charter_range: '$170,000 – $190,000',
        ownership_range: '$95,000/month estimated',
        flight_time: '9h 10m typical',
        on_time: '89%',
        broker_tip: 'Le Bourget is the premier Paris business aviation airport. Falcon 7X is strong here — French clients and European operators prefer Dassault. Lead with the Falcon on this route for European clientele.',
    },
}

const statusColor = {
    'En Route': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Scheduled': 'text-gold bg-gold/10 border-gold/20',
    'Landed': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
}

const airports = ['ALL', 'VABB', 'VIDP', 'VOBL']
const aircraftTypes = ['ALL', 'G650ER', 'G700', 'Global 7500', 'Falcon 7X', 'Phenom 300E']

export default function Flights() {
    const [airport, setAirport] = useState('ALL')
    const [aircraft, setAircraft] = useState('ALL')
    const [selected, setSelected] = useState(allFlights[0])

    const filtered = allFlights.filter(f => {
        const airportMatch = airport === 'ALL' || f.from === airport
        const aircraftMatch = aircraft === 'ALL' || f.aircraft === aircraft
        return airportMatch && aircraftMatch
    })

    const intel = routeIntelligence[selected.route]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="section-label">LIVE FLIGHT INTELLIGENCE</p>
                <h1 className="font-display text-4xl text-white">FLIGHT TRACKER</h1>
                <p className="font-body text-gray-400 mt-2">
                    Know the market before your clients do. Live VABB region movements.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="glass px-1 py-1 flex gap-1 rounded-xl">
                    {airports.map(a => (
                        <button
                            key={a}
                            onClick={() => setAirport(a)}
                            className={`font-mono text-xs px-4 py-2 rounded-lg transition-all ${airport === a ? 'bg-gold text-jet font-bold' : 'text-gray-400 hover:text-gold'
                                }`}
                        >
                            {a}
                        </button>
                    ))}
                </div>
                <div className="glass px-1 py-1 flex gap-1 rounded-xl flex-wrap">
                    {aircraftTypes.map(a => (
                        <button
                            key={a}
                            onClick={() => setAircraft(a)}
                            className={`font-mono text-xs px-4 py-2 rounded-lg transition-all ${aircraft === a ? 'bg-gulf text-white font-bold' : 'text-gray-400 hover:text-gold'
                                }`}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            {/* Flight Table */}
            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#1c1c1c]">
                                {['Flight ID', 'Route', 'Aircraft', 'Departure', 'ETA', 'Altitude', 'Speed', 'Status', 'Progress'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((f, i) => (
                                <tr
                                    key={f.id}
                                    onClick={() => setSelected(f)}
                                    className={`border-b border-[#1c1c1c] cursor-pointer transition-colors ${selected.id === f.id ? 'bg-gold/5' : 'hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-gold">{f.id}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-white font-bold">{f.route}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{f.aircraft}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.dep}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.eta}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.altitude > 0 ? f.altitude.toLocaleString() + ' ft' : '—'}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.speed > 0 ? f.speed + ' kts' : '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-mono text-xs px-2 py-0.5 rounded border ${statusColor[f.status]}`}>{f.status}</span>
                                    </td>
                                    <td className="px-4 py-3 min-w-[100px]">
                                        {f.progress > 0 ? (
                                            <div className="h-1.5 bg-[#1c1c1c] rounded-full w-24">
                                                <div className="h-1.5 bg-gold rounded-full" style={{ width: `${f.progress}%` }} />
                                            </div>
                                        ) : (
                                            <span className="font-mono text-xs text-gray-600">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Route Intelligence Panel */}
            {intel && (
                <div className="glass p-6 space-y-5">
                    <div>
                        <p className="section-label mb-1">ROUTE INTELLIGENCE</p>
                        <h2 className="font-display text-2xl text-white">{selected.route}</h2>
                        <p className="font-mono text-xs text-gray-500 mt-1">{selected.distance_nm.toLocaleString()}nm · {selected.aircraft}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="stat-card">
                            <p className="font-mono text-xs text-gray-500 mb-1">Nonstop Capable</p>
                            <p className={`font-display text-xl ${intel.nonstop ? 'text-green-400' : 'text-red-400'}`}>
                                {intel.nonstop ? 'YES' : 'NO'}
                            </p>
                        </div>
                        <div className="stat-card">
                            <p className="font-mono text-xs text-gray-500 mb-1">Charter Range</p>
                            <p className="font-display text-lg text-gold">{intel.charter_range}</p>
                        </div>
                        <div className="stat-card">
                            <p className="font-mono text-xs text-gray-500 mb-1">Flight Time</p>
                            <p className="font-display text-lg text-white">{intel.flight_time}</p>
                        </div>
                        <div className="stat-card">
                            <p className="font-mono text-xs text-gray-500 mb-1">On-Time Rate</p>
                            <p className="font-display text-lg text-white">{intel.on_time}</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-mono text-xs text-gray-500 mb-2">QUALIFYING JETS FOR THIS ROUTE</p>
                        <div className="flex flex-wrap gap-2">
                            {intel.qualifying_jets.map((j, i) => (
                                <span key={i} className="font-mono text-xs px-3 py-1 rounded border border-gulf text-gulf bg-gulf/10">{j}</span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-gold p-4">
                        <p className="font-mono text-xs text-gold mb-2">BROKER TIP</p>
                        <p className="font-body text-white leading-relaxed text-sm">{intel.broker_tip}</p>
                    </div>
                </div>
            )}
        </div>
    )
}