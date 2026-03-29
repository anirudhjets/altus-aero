import { useState } from 'react'

const fleet = [
    {
        id: 1,
        model: 'G650ER',
        manufacturer: 'Gulfstream',
        category: 'Ultra Long Range',
        range_nm: 7500,
        passengers: 19,
        cruise_speed_kts: 516,
        cabin_length_ft: 53.6,
        cabin_height_ft: 6.3,
        baggage_cuft: 195,
        hourly_rate_usd: 12000,
        purchase_price_usd: 75000000,
        color: '#0d1b3e',
        broker_insight: 'The default answer for Mumbai HNWI clients wanting London or New York nonstop. If they say I want a Gulfstream — this is what they mean. VABB to EGLL nonstop with full passengers and bags.',
    },
    {
        id: 2,
        model: 'G700',
        manufacturer: 'Gulfstream',
        category: 'Ultra Long Range',
        range_nm: 7750,
        passengers: 19,
        cruise_speed_kts: 526,
        cabin_length_ft: 56.2,
        cabin_height_ft: 6.3,
        baggage_cuft: 207,
        hourly_rate_usd: 14000,
        purchase_price_usd: 90000000,
        color: '#1e3a8a',
        broker_insight: 'Newer, larger, slightly faster than the G650ER. 20% more cabin volume. If a client already owns a G650 and wants an upgrade conversation, start here. The stateroom option closes deals.',
    },
    {
        id: 3,
        model: 'Global 7500',
        manufacturer: 'Bombardier',
        category: 'Ultra Long Range',
        range_nm: 7700,
        passengers: 19,
        cruise_speed_kts: 516,
        cabin_length_ft: 54.5,
        cabin_height_ft: 6.2,
        baggage_cuft: 195,
        hourly_rate_usd: 13500,
        purchase_price_usd: 85000000,
        color: '#0f3460',
        broker_insight: 'The range leader. VABB to KLAX nonstop — no other production jet does this reliably. Four living spaces including a permanent bedroom. Lead with the range fact and the bedroom.',
    },
    {
        id: 4,
        model: 'Falcon 7X',
        manufacturer: 'Dassault',
        category: 'Long Range',
        range_nm: 5950,
        passengers: 16,
        cruise_speed_kts: 482,
        cabin_length_ft: 39.1,
        cabin_height_ft: 6.2,
        baggage_cuft: 140,
        hourly_rate_usd: 10500,
        purchase_price_usd: 55000000,
        color: '#2d4a7a',
        broker_insight: 'The European choice. Three engines means a different insurance profile and access to airports others cannot use. Clients who have flown NetJets Europe often prefer this. Fuel efficiency is best in class.',
    },
    {
        id: 5,
        model: 'Phenom 300E',
        manufacturer: 'Embraer',
        category: 'Light Jet',
        range_nm: 2010,
        passengers: 10,
        cruise_speed_kts: 453,
        cabin_length_ft: 17.2,
        cabin_height_ft: 4.9,
        baggage_cuft: 84,
        hourly_rate_usd: 4500,
        purchase_price_usd: 10500000,
        color: '#1a3a5c',
        broker_insight: 'Best entry level jet for new private flyers. Regional India routes — Mumbai to Delhi, Bangalore, Goa. First time ownership conversation starter. Lowest operating cost in its class.',
    },
]

const specs = [
    { key: 'range_nm', label: 'Range', unit: 'nm', format: v => v.toLocaleString() },
    { key: 'passengers', label: 'Passengers', unit: 'max', format: v => v },
    { key: 'cruise_speed_kts', label: 'Cruise Speed', unit: 'kts', format: v => v },
    { key: 'cabin_length_ft', label: 'Cabin Length', unit: 'ft', format: v => v },
    { key: 'cabin_height_ft', label: 'Cabin Height', unit: 'ft', format: v => v },
    { key: 'baggage_cuft', label: 'Baggage', unit: 'cu ft', format: v => v },
    { key: 'hourly_rate_usd', label: 'Charter Rate', unit: '/hr', format: v => '$' + v.toLocaleString() },
    { key: 'purchase_price_usd', label: 'Purchase Price', unit: '', format: v => '$' + (v / 1000000).toFixed(1) + 'M' },
]

export default function Jets() {
    const [selected, setSelected] = useState(fleet[0])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="section-label">FLEET EDUCATION CENTER</p>
                <h1 className="font-display text-4xl text-white">KNOW YOUR FLEET</h1>
                <p className="font-body text-gray-400 mt-2 max-w-2xl">
                    A broker who cannot explain the difference between a G650 and a Global 7500 loses the client to someone who can.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left — Visual + Specs */}
                <div className="space-y-4">
                    {/* Jet Visual */}
                    <div className="glass p-8 flex items-center justify-center min-h-[280px] relative overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ background: `radial-gradient(circle at center, ${selected.color}, transparent 70%)` }}
                        />
                        <div className="relative text-center">
                            <div
                                className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${selected.color}, #0a0a0a)`, boxShadow: `0 0 60px ${selected.color}` }}
                            >
                                <span className="text-5xl">✈</span>
                            </div>
                            <p className="font-display text-4xl text-white">{selected.model}</p>
                            <p className="font-mono text-sm text-gold">{selected.manufacturer} · {selected.category}</p>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="glass p-5">
                        <p className="section-label mb-4">SPECIFICATIONS</p>
                        <div className="grid grid-cols-2 gap-3">
                            {specs.map((s, i) => (
                                <div key={i} className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">{s.label}</p>
                                    <p className="font-display text-lg text-white">
                                        {s.format(selected[s.key])}
                                        <span className="text-xs text-gray-500 ml-1">{s.unit}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Broker Insight */}
                    <div className="glass-gold p-5">
                        <p className="section-label mb-2">BROKER INSIGHT</p>
                        <p className="font-body text-white leading-relaxed">{selected.broker_insight}</p>
                    </div>
                </div>

                {/* Right — Fleet List */}
                <div className="glass p-5">
                    <p className="section-label mb-4">SELECT AIRCRAFT</p>
                    <div className="space-y-3">
                        {fleet.map((jet) => (
                            <button
                                key={jet.id}
                                onClick={() => setSelected(jet)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selected.id === jet.id
                                    ? 'border-gold bg-gold/5 shadow-gold'
                                    : 'border-[#1c1c1c] hover:border-gulf'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ background: jet.color, boxShadow: selected.id === jet.id ? `0 0 20px ${jet.color}` : 'none' }}
                                    >
                                        <span className="text-white text-sm">✈</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-display text-xl text-white">{jet.model}</p>
                                            <span className="font-mono text-xs text-gray-500">{jet.category}</span>
                                        </div>
                                        <p className="font-mono text-xs text-gray-400 mb-2">
                                            {jet.manufacturer} · {jet.range_nm.toLocaleString()}nm · {jet.passengers} pax
                                        </p>
                                        <p className="font-body text-xs text-gray-500 leading-relaxed line-clamp-2">
                                            {jet.broker_insight}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div>
                                                <p className="font-mono text-xs text-gray-600">Charter/hr</p>
                                                <p className="font-display text-sm text-gold">${jet.hourly_rate_usd.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="font-mono text-xs text-gray-600">Purchase</p>
                                                <p className="font-display text-sm text-gold">${(jet.purchase_price_usd / 1000000).toFixed(1)}M</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}