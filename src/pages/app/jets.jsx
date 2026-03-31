import { useState } from 'react'

const fleet = [
    {
        id: 1, model: 'G650ER', manufacturer: 'Gulfstream', category: 'Ultra Long Range',
        range_nm: 7500, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 53.6,
        cabin_height_ft: 6.3, baggage_cuft: 195, hourly_rate_usd: 12000, purchase_price_usd: 75000000,
        color: '#0d1b3e',
        broker_insight: 'The default answer for Mumbai HNWI clients wanting London or New York nonstop. If they say I want a Gulfstream — this is what they mean. VABB to EGLL nonstop with full passengers and bags.',
    },
    {
        id: 2, model: 'G700', manufacturer: 'Gulfstream', category: 'Ultra Long Range',
        range_nm: 7750, passengers: 19, cruise_speed_kts: 526, cabin_length_ft: 56.2,
        cabin_height_ft: 6.3, baggage_cuft: 207, hourly_rate_usd: 14000, purchase_price_usd: 90000000,
        color: '#1e3a8a',
        broker_insight: 'Newer, larger, slightly faster than the G650ER. 20% more cabin volume. If a client already owns a G650 and wants an upgrade conversation, start here. The stateroom option closes deals.',
    },
    {
        id: 3, model: 'G800', manufacturer: 'Gulfstream', category: 'Ultra Long Range',
        range_nm: 8000, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 56.2,
        cabin_height_ft: 6.3, baggage_cuft: 207, hourly_rate_usd: 15000, purchase_price_usd: 95000000,
        color: '#0a1628',
        broker_insight: 'Longest range Gulfstream ever built. Singapore to New York nonstop. Lead with the range when clients ask about ultra-long-range options.',
    },
    {
        id: 4, model: 'Global 7500', manufacturer: 'Bombardier', category: 'Ultra Long Range',
        range_nm: 7700, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 54.5,
        cabin_height_ft: 6.2, baggage_cuft: 195, hourly_rate_usd: 13500, purchase_price_usd: 85000000,
        color: '#0f3460',
        broker_insight: 'The range leader. VABB to KLAX nonstop — no other production jet does this reliably. Four living spaces including a permanent bedroom. Lead with the range fact and the bedroom.',
    },
    {
        id: 5, model: 'Global 6500', manufacturer: 'Bombardier', category: 'Super Long Range',
        range_nm: 6600, passengers: 17, cruise_speed_kts: 513, cabin_length_ft: 48.4,
        cabin_height_ft: 6.2, baggage_cuft: 195, hourly_rate_usd: 11000, purchase_price_usd: 55000000,
        color: '#1a3a6c',
        broker_insight: 'Best value Bombardier. Mumbai to London with ease. Clients who cannot justify the Global 7500 price find this a natural step down without losing much range.',
    },
    {
        id: 6, model: 'Falcon 8X', manufacturer: 'Dassault', category: 'Ultra Long Range',
        range_nm: 6450, passengers: 16, cruise_speed_kts: 482, cabin_length_ft: 43.1,
        cabin_height_ft: 6.2, baggage_cuft: 140, hourly_rate_usd: 11500, purchase_price_usd: 58000000,
        color: '#2a4a8a',
        broker_insight: 'Three engines means access to airports others cannot use. High altitude airstrips in Asia and Africa. Clients who need flexibility in their destinations should know this first.',
    },
    {
        id: 7, model: 'Falcon 7X', manufacturer: 'Dassault', category: 'Long Range',
        range_nm: 5950, passengers: 16, cruise_speed_kts: 482, cabin_length_ft: 39.1,
        cabin_height_ft: 6.2, baggage_cuft: 140, hourly_rate_usd: 10500, purchase_price_usd: 55000000,
        color: '#2d4a7a',
        broker_insight: 'The European choice. Three engines means a different insurance profile and access to airports others cannot use. Clients who have flown NetJets Europe often prefer this.',
    },
    {
        id: 8, model: 'Challenger 350', manufacturer: 'Bombardier', category: 'Super Midsize',
        range_nm: 3200, passengers: 10, cruise_speed_kts: 466, cabin_length_ft: 24.0,
        cabin_height_ft: 6.1, baggage_cuft: 106, hourly_rate_usd: 5500, purchase_price_usd: 27000000,
        color: '#1e4a6a',
        broker_insight: 'Most sold business jet in the world. Mumbai to Dubai to Delhi routes. If a client is flying regionally and wants value — this is the answer every time.',
    },
    {
        id: 9, model: 'Challenger 650', manufacturer: 'Bombardier', category: 'Large Cabin',
        range_nm: 4000, passengers: 12, cruise_speed_kts: 459, cabin_length_ft: 28.6,
        cabin_height_ft: 6.1, baggage_cuft: 115, hourly_rate_usd: 7000, purchase_price_usd: 32000000,
        color: '#1a3a5c',
        broker_insight: 'Best large cabin value in the market. Excellent for regional Asia routes where cabin space matters but ultra-long range is not needed.',
    },
    {
        id: 10, model: 'Citation Longitude', manufacturer: 'Cessna', category: 'Super Midsize',
        range_nm: 3500, passengers: 12, cruise_speed_kts: 476, cabin_length_ft: 25.2,
        cabin_height_ft: 6.0, baggage_cuft: 127, hourly_rate_usd: 5800, purchase_price_usd: 26000000,
        color: '#2a3a5a',
        broker_insight: 'Quietest cabin in the super midsize category. Clients who value comfort over range find this compelling. First class experience at midsize pricing.',
    },
    {
        id: 11, model: 'Praetor 600', manufacturer: 'Embraer', category: 'Super Midsize',
        range_nm: 4018, passengers: 12, cruise_speed_kts: 466, cabin_length_ft: 27.3,
        cabin_height_ft: 6.0, baggage_cuft: 114, hourly_rate_usd: 6200, purchase_price_usd: 21000000,
        color: '#1e3050',
        broker_insight: 'Best range in the super midsize class. Mumbai to Riyadh nonstop easily. Exceptional value proposition — lead with the range-to-cost ratio.',
    },
    {
        id: 12, model: 'Phenom 300E', manufacturer: 'Embraer', category: 'Light Jet',
        range_nm: 2010, passengers: 10, cruise_speed_kts: 453, cabin_length_ft: 17.2,
        cabin_height_ft: 4.9, baggage_cuft: 84, hourly_rate_usd: 4500, purchase_price_usd: 10500000,
        color: '#1a3a5c',
        broker_insight: 'Best entry level jet for new private flyers. Regional India routes — Mumbai to Delhi, Bangalore, Goa. First time ownership conversation starter. Lowest operating cost in its class.',
    },
    {
        id: 13, model: 'Citation CJ4', manufacturer: 'Cessna', category: 'Light Jet',
        range_nm: 2165, passengers: 9, cruise_speed_kts: 451, cabin_length_ft: 17.3,
        cabin_height_ft: 4.8, baggage_cuft: 77, hourly_rate_usd: 3800, purchase_price_usd: 9000000,
        color: '#162a4a',
        broker_insight: 'Popular entry light jet for short regional hops. Easy to operate and maintain. Good first ownership conversation for clients flying under 2 hours regularly.',
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
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('ALL')

    const categories = ['ALL', 'Ultra Long Range', 'Super Long Range', 'Long Range', 'Large Cabin', 'Super Midsize', 'Light Jet']

    const filtered = fleet.filter(j => {
        const matchSearch = j.model.toLowerCase().includes(search.toLowerCase()) || j.manufacturer.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'ALL' || j.category === category
        return matchSearch && matchCat
    })

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <p className="section-label text-xs sm:text-sm">FLEET EDUCATION CENTER</p>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">KNOW YOUR FLEET</h1>
                <p className="font-body text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl">
                    A broker who cannot explain the difference between a G650 and a Global 7500 loses the client to someone who can.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search aircraft..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-[#0d0d0d] border border-[#1c1c1c] rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:border-gold focus:outline-none"
                />
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:border-gold focus:outline-none"
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Left — Visual + Specs */}
                <div className="space-y-4">
                    {/* Jet Visual */}
                    <div className="glass p-6 sm:p-8 flex items-center justify-center min-h-[200px] sm:min-h-[260px] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${selected.color}, transparent 70%)` }} />
                        <div className="relative text-center">
                            <div
                                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${selected.color}, #0a0a0a)`, boxShadow: `0 0 60px ${selected.color}` }}
                            >
                                <span className="text-3xl sm:text-4xl lg:text-5xl">✈</span>
                            </div>
                            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">{selected.model}</p>
                            <p className="font-mono text-xs sm:text-sm text-gold">{selected.manufacturer} · {selected.category}</p>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="glass p-4 sm:p-5">
                        <p className="section-label mb-3 sm:mb-4">SPECIFICATIONS</p>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {specs.map((s, i) => (
                                <div key={i} className="bg-[#0d0d0d] rounded-lg p-2.5 sm:p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-0.5 sm:mb-1">{s.label}</p>
                                    <p className="font-display text-base sm:text-lg text-white">
                                        {s.format(selected[s.key])}
                                        <span className="text-xs text-gray-500 ml-1">{s.unit}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Broker Insight */}
                    <div className="glass-gold p-4 sm:p-5">
                        <p className="section-label mb-2">BROKER INSIGHT</p>
                        <p className="font-body text-sm sm:text-base text-white leading-relaxed">{selected.broker_insight}</p>
                    </div>
                </div>

                {/* Right — Fleet List */}
                <div className="glass p-4 sm:p-5">
                    <p className="section-label mb-3 sm:mb-4">SELECT AIRCRAFT ({filtered.length})</p>
                    <div className="space-y-2 sm:space-y-3 max-h-[600px] sm:max-h-[700px] overflow-y-auto pr-1">
                        {filtered.map((jet) => (
                            <button
                                key={jet.id}
                                onClick={() => setSelected(jet)}
                                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all ${selected.id === jet.id ? 'border-gold bg-gold/5 shadow-gold' : 'border-[#1c1c1c] hover:border-gulf'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ background: jet.color, boxShadow: selected.id === jet.id ? `0 0 20px ${jet.color}` : 'none' }}
                                    >
                                        <span className="text-white text-xs sm:text-sm">✈</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                            <p className="font-display text-base sm:text-xl text-white">{jet.model}</p>
                                            <span className="font-mono text-xs text-gray-500 flex-shrink-0 ml-2">{jet.category}</span>
                                        </div>
                                        <p className="font-mono text-xs text-gray-400 mb-1 sm:mb-2">
                                            {jet.manufacturer} · {jet.range_nm.toLocaleString()}nm · {jet.passengers} pax
                                        </p>
                                        <p className="font-body text-xs text-gray-500 leading-relaxed line-clamp-2">
                                            {jet.broker_insight}
                                        </p>
                                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
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