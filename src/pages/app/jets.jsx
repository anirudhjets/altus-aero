import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

/* ─── AIRCRAFT DATABASE ──────────────────────────────────────────── */
const AIRCRAFT = [
    {
        id: 'g650er', model: 'G650ER', manufacturer: 'Gulfstream', category: 'Ultra Long Range',
        range: 7500, speed: 516, paxMax: 19, ceiling: 51000,
        cabin: { length: 53.6, width: 8.2, height: 6.3 },
        charterHr: 12000, purchase: 75,
        description: 'The benchmark ultra-long-range aircraft. Capable of nonstop Mumbai to London, New York to Hong Kong, and Los Angeles to Sydney with reserves.',
        brokerInsight: 'Lead with the nonstop argument on routes where competitors need a tech stop. VABB to EGLL is 4,387nm — G650ER clears it with reserves. Clients who have done the route on commercial or a connecting charter immediately understand the value. On price: $12k/hr sounds high until you compare per-seat to business class on a group of eight. Do the math in front of them. Most close on the spot.',
    },
    {
        id: 'g700', model: 'G700', manufacturer: 'Gulfstream', category: 'Ultra Long Range',
        range: 7750, speed: 526, paxMax: 19, ceiling: 51000,
        cabin: { length: 56.1, width: 8.2, height: 6.2 },
        charterHr: 14000, purchase: 90,
        description: 'Gulfstream\'s flagship. Longer range and more cabin volume than the G650ER. The aircraft for routes over 7,000nm where no tech stop is acceptable.',
        brokerInsight: 'The G700 has 20% more cabin volume than the G650ER and a longer range. On routes over 7,000nm — VABB to KSFO or EGLL to YSSY — it is the only option for nonstop. On shorter routes, position it as the ultimate comfort play: 13 passengers in a cabin designed for eight. The per-hour premium over a G650ER is real — earn it by anchoring on the cabin experience difference, not the range.',
    },
    {
        id: 'global7500', model: 'Global 7500', manufacturer: 'Bombardier', category: 'Ultra Long Range',
        range: 7700, speed: 516, paxMax: 19, ceiling: 51000,
        cabin: { length: 57.1, width: 8.2, height: 6.3 },
        charterHr: 13000, purchase: 73,
        description: 'Bombardier\'s answer to the G700. A dedicated stateroom and four living spaces make it the choice for clients who want a private bedroom at altitude.',
        brokerInsight: 'Range and speed are nearly identical to the G700 — the decision comes down to cabin layout. The Global 7500 has a dedicated stateroom with a real bed, not a fold-flat seat. For clients flying VABB-EGLL overnight, that one detail often closes the deal. Price is slightly below the G700 — if you are positioning against Gulfstream, lead with the stateroom and the Bombardier maintenance network in India.',
    },
    {
        id: 'falcon7x', model: 'Falcon 7X', manufacturer: 'Dassault', category: 'Large Jet',
        range: 5950, speed: 482, paxMax: 14, ceiling: 51000,
        cabin: { length: 39.1, width: 8.2, height: 6.2 },
        charterHr: 9500, purchase: 45,
        description: 'Three-engine large jet with transcontinental range. The only trijet in this category — relevant for remote or overwater routes where engine-out policy matters.',
        brokerInsight: 'Three-engine safety is real and resonates with clients who fly over remote terrain or water. ETOPS restrictions are not a concern with three engines. Works particularly well in the Middle East and African markets. Price is 30-40% below ULR — easy to justify on routes under 5,500nm. If the client is deciding between Falcon 7X and G650ER, ask how often they actually fly routes over 5,500nm. For most, the answer is rarely.',
    },
    {
        id: 'challenger604', model: 'Challenger 604', manufacturer: 'Bombardier', category: 'Large Jet',
        range: 4077, speed: 459, paxMax: 12, ceiling: 41000,
        cabin: { length: 28.4, width: 8.2, height: 6.1 },
        charterHr: 8500, purchase: 15,
        description: 'Pre-owned large jet with proven reliability. A 4,000nm range at significantly lower acquisition cost than new large jets.',
        brokerInsight: 'A $75M new large jet for $12-18M pre-owned. For cost-sensitive clients who need 10-plus passengers and 4,000nm range, this is the argument. Cabin is dated by current standards — your job is making sure the client is buying range and capacity, not interior. Maintenance reserves matter on a 2005-2010 aircraft: make sure they understand the cost-per-hour difference vs a new midsize before they anchor on acquisition price alone.',
    },
    {
        id: 'challenger350', model: 'Challenger 350', manufacturer: 'Bombardier', category: 'Super Midsize',
        range: 3200, speed: 470, paxMax: 10, ceiling: 45000,
        cabin: { length: 24.6, width: 7.8, height: 6.1 },
        charterHr: 6500, purchase: 26,
        description: 'The benchmark super midsize. Best range-to-cost ratio in its class, with a flat-floor cabin and strong operator network.',
        brokerInsight: 'Most value-efficient super midsize on the market. $6,500/hr for 3,200nm range covers most Asian domestic and regional international routes without compromise. Compare to the Latitude: Challenger wins on range and speed. Compare to the G280: Challenger has a larger cabin. Position it as best-in-class in the $25M new aircraft range. For Indian regional clients — VABB to OMDB, VABB to VABB — it is the default recommendation before you go larger.',
    },
    {
        id: 'g280', model: 'G280', manufacturer: 'Gulfstream', category: 'Super Midsize',
        range: 3600, speed: 482, paxMax: 10, ceiling: 45000,
        cabin: { length: 25.2, width: 7.2, height: 6.3 },
        charterHr: 7000, purchase: 25,
        description: 'Gulfstream branding at the super midsize price point. Best range in its category with the Gulfstream operator network.',
        brokerInsight: 'Gulfstream branding at the super midsize price. Clients who want to say they fly Gulfstream but are not ready for a large jet — this is the aircraft. Range of 3,600nm is genuine — covers VABB to OMDB nonstop with margin and connects to destinations the Challenger 350 cannot reach. Often overlooked because it sits between the 350 and the G450, but it outperforms both on range at this price. Use it to qualify clients before moving them up the Gulfstream line.',
    },
    {
        id: 'citationlatitude', model: 'Citation Latitude', manufacturer: 'Cessna', category: 'Super Midsize',
        range: 2700, speed: 446, paxMax: 9, ceiling: 45000,
        cabin: { length: 21.8, width: 6.4, height: 6.0 },
        charterHr: 5500, purchase: 17,
        description: 'Entry point to stand-up cabin territory. Flat floor and a 45,000ft ceiling in a super midsize package.',
        brokerInsight: 'Entry to stand-up cabin at the lowest cost in the category. A 45,000ft ceiling and flat floor makes it feel larger than the numbers suggest. Best argument: compare total trip cost across 50 flights per year against a Challenger 350 — the Latitude saves $400-600k annually. For high-frequency regional clients who need a dedicated aircraft, that math is often the closer. Best positioned for routes under 2,500nm with 6-8 passengers.',
    },
    {
        id: 'learjet75', model: 'Learjet 75 Liberty', manufacturer: 'Bombardier', category: 'Midsize',
        range: 2080, speed: 465, paxMax: 9, ceiling: 51000,
        cabin: { length: 19.9, width: 5.9, height: 4.9 },
        charterHr: 4500, purchase: 13,
        description: 'The final production Learjet. Highest climb rate in its class with a 51,000ft ceiling — above most weather.',
        brokerInsight: 'The last Learjet. Bombardier discontinued the line in 2021, which makes pre-owned values interesting — finite supply. Fastest climb rate in its class gets clients to FL510 before most competitors pass FL350. Best positioned for short-to-medium routes where speed matters: VABB to VIDP in under 2 hours. If a client asks about the brand: Bombardier still supports every Learjet in service. The heritage is a selling point, not a liability.',
    },
    {
        id: 'hawker900xp', model: 'Hawker 900XP', manufacturer: 'Hawker Beechcraft', category: 'Midsize',
        range: 2810, speed: 448, paxMax: 8, ceiling: 41000,
        cabin: { length: 21.5, width: 6.0, height: 5.7 },
        charterHr: 4200, purchase: 8,
        description: 'Pre-owned midsize with real range. One of the longer-ranging aircraft in the pre-owned midsize segment.',
        brokerInsight: 'Pre-owned bargain with genuine range. A 2,800nm midsize for under $4M makes it one of the most cost-effective options in the market. Best for clients who want a dedicated aircraft without new-aircraft acquisition cost. Be direct about maintenance: the cost-per-hour on a 2005-2010 aircraft is higher than a new midsize. The comparison that works is: acquisition cost plus five-year maintenance estimate vs a new Citation XLS on lease. Run those numbers before the client does.',
    },
    {
        id: 'citationxls', model: 'Citation XLS+', manufacturer: 'Cessna', category: 'Midsize',
        range: 2100, speed: 442, paxMax: 9, ceiling: 45000,
        cabin: { length: 18.7, width: 5.6, height: 5.7 },
        charterHr: 3800, purchase: 12,
        description: 'The most popular midsize in the charter market. Wide operator network and strong availability across India and the Middle East.',
        brokerInsight: 'Best availability in the midsize category in India. More operators fly the XLS than any other midsize, which means better charter availability, more competitive pricing, and faster response times. For clients who charter frequently on 1-3 hour regional routes, the XLS is often the most practical recommendation — not because it is the best aircraft, but because it is consistently available when they need it. Pair it with a positioning argument: when range or size is the priority, here is what you move up to.',
    },
    {
        id: 'phenom300e', model: 'Phenom 300E', manufacturer: 'Embraer', category: 'Light Jet',
        range: 2010, speed: 453, paxMax: 9, ceiling: 45000,
        cabin: { length: 17.6, width: 5.1, height: 4.9 },
        charterHr: 2200, purchase: 10,
        description: 'Six consecutive years as the world\'s best-selling light jet. Best-in-class performance for the category.',
        brokerInsight: 'Six consecutive years as the world\'s best-selling light jet. That is the pitch — the market voted. Best on shorter routes under 2,000nm with 4-6 passengers where operational cost matters. For Indian regional routes — VABB-VIDP, VABB-VAAH, VABB-VOMM — it is the default recommendation before moving to a midsize. When a client asks why not a bigger aircraft: at $2,200/hr vs $4,000/hr, the difference over 100 hours per year is $180,000. Show them what that buys.',
    },
    {
        id: 'cj4', model: 'Citation CJ4', manufacturer: 'Cessna', category: 'Light Jet',
        range: 2165, speed: 451, paxMax: 8, ceiling: 45000,
        cabin: { length: 17.3, width: 4.8, height: 4.8 },
        charterHr: 2400, purchase: 9.5,
        description: 'Reliable entry-level light jet with a strong operator base. Proven on short regional routes.',
        brokerInsight: 'Excellent entry for clients new to private aviation. Lower operating cost than the Phenom 300E with comparable performance on short legs. Range covers VABB to VIDP, Hyderabad, Chennai with margin. First-time buyer pitch: understand your flight-hour needs on a CJ4 for two to three years. You will have real data when it is time to step up. This positions you as the advisor, not the salesperson — and that is exactly where you want to be for the next transaction.',
    },
    {
        id: 'hondajet', model: 'HondaJet Elite II', manufacturer: 'Honda', category: 'Light Jet',
        range: 1437, speed: 422, paxMax: 5, ceiling: 43000,
        cabin: { length: 14.9, width: 5.0, height: 4.8 },
        charterHr: 1900, purchase: 6.7,
        description: 'Unconventional over-wing engine design dramatically reduces cabin noise. Built for short routes with a focus on interior quality.',
        brokerInsight: 'The disruption story is part of the pitch. Over-wing engine mounting significantly reduces cabin noise — measurably quieter than any comparable light jet. For clients who fly 3-4 passengers on 1-2 hour legs and care about detail, this is a conversation starter. Do not position it against the Phenom 300E on range — it loses at 1,437nm. Position it on the cabin experience for 4-passenger short-leg flying, where noise and interior quality matter more than the range numbers.',
    },
]

const CATEGORIES = ['All', 'Ultra Long Range', 'Large Jet', 'Super Midsize', 'Midsize', 'Light Jet']

/* ─── USAGE TRACKING ─────────────────────────────────────────────── */
function incrementFleetViews() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!raw[monthKey]) raw[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        raw[monthKey].fleetViews = (raw[monthKey].fleetViews || 0) + 1
        localStorage.setItem('altus_usage', JSON.stringify(raw))
    } catch { /* silent */ }
}

/* ─── PRO LOCK OVERLAY ───────────────────────────────────────────── */
function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>
                {children}
            </div>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(2px)',
                borderRadius: '12px', gap: '10px', padding: '16px',
            }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em' }}>PRO FEATURE</span>
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '200px', lineHeight: 1.5 }}>{label}</p>}
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{
                        padding: '8px 20px', borderRadius: '8px', background: '#D4AF37', color: '#0a0a0a',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em',
                        border: 'none', cursor: 'pointer',
                    }}
                >
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

/* ─── COMPARE PANEL ──────────────────────────────────────────────── */
function ComparePanel({ aircraft, onRemove, navigate }) {
    if (aircraft.length === 0) return null

    const fields = [
        { label: 'Range', key: (a) => `${a.range.toLocaleString()}nm` },
        { label: 'Speed', key: (a) => `${a.speed} kts` },
        { label: 'Max Passengers', key: (a) => `${a.paxMax}` },
        { label: 'Cabin Length', key: (a) => `${a.cabin.length} ft` },
        { label: 'Charter/hr', key: (a) => `$${a.charterHr.toLocaleString()}` },
        { label: 'Purchase', key: (a) => `$${a.purchase}M` },
    ]

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(212,175,55,0.2)',
            padding: '20px 24px', boxShadow: '0 -20px 60px rgba(0,0,0,0.8)',
        }}>
            <div className="max-w-6xl mx-auto">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em' }}>
                        COMPARING {aircraft.length} AIRCRAFT
                    </p>
                    <button onClick={() => aircraft.forEach((a) => onRemove(a.id))}
                        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        CLEAR ALL
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${aircraft.length}, 1fr)`, gap: '0' }}>
                    <div>
                        <div style={{ height: '52px' }} />
                        {fields.map((f) => (
                            <div key={f.label} style={{ padding: '8px 0', borderTop: '1px solid #1c1c1c' }}>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{f.label}</p>
                            </div>
                        ))}
                    </div>
                    {aircraft.map((a) => (
                        <div key={a.id} style={{ paddingLeft: '12px' }}>
                            <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#fff', letterSpacing: '0.05em' }}>{a.model}</p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{a.manufacturer}</p>
                                </div>
                                <button onClick={() => onRemove(a.id)}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '14px', paddingRight: '8px' }}>✕</button>
                            </div>
                            {fields.map((f) => (
                                <div key={f.label} style={{ padding: '8px 0', borderTop: '1px solid #1c1c1c' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', color: '#D4AF37' }}>{f.key(a)}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────── */
export default function Fleet() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [selected, setSelected] = useState(AIRCRAFT[0])
    const [compareIds, setCompareIds] = useState([])
    const [activeTab, setActiveTab] = useState('specs')

    const filtered = AIRCRAFT.filter((a) => {
        const matchCat = category === 'All' || a.category === category
        const matchSearch = a.model.toLowerCase().includes(search.toLowerCase()) ||
            a.manufacturer.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const handleSelect = (aircraft) => {
        setSelected(aircraft)
        setActiveTab('specs')
        incrementFleetViews()
    }

    const toggleCompare = (id) => {
        if (!isPro) { navigate('/app/billing'); return }
        setCompareIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
        )
    }

    const compareAircraft = AIRCRAFT.filter((a) => compareIds.includes(a.id))

    return (
        <div className="space-y-4 md:space-y-6" style={{ paddingBottom: compareIds.length > 0 ? '200px' : '0' }}>

            {/* Header */}
            <div>
                <p className="section-label">FLEET INTELLIGENCE</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">FLEET</h1>
                <p className="font-body text-gray-400 text-sm mt-1">
                    A broker who cannot explain the difference between a G650 and a Global 7500 loses the client to someone who can.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3 flex-col sm:flex-row">
                <input
                    type="text"
                    placeholder="Search aircraft..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid #1c1c1c', borderRadius: '10px',
                        color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = '#1c1c1c')}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                        padding: '10px 16px', background: '#0d0d0d', border: '1px solid #1c1c1c',
                        borderRadius: '10px', color: '#fff', fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px', outline: 'none', cursor: 'pointer', minWidth: '180px',
                    }}
                >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
            </div>

            {/* Pro compare banner — only shown when not pro */}
            {!isPro && (
                <div style={{
                    padding: '12px 16px', borderRadius: '10px',
                    background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Side-by-side comparison, Broker Insights, and detailed cockpit briefs are Pro features.
                    </p>
                    <button onClick={() => navigate('/app/billing')} style={{
                        padding: '7px 16px', borderRadius: '7px', background: '#D4AF37', color: '#0a0a0a',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em',
                        border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}>
                        UPGRADE TO PRO
                    </button>
                </div>
            )}

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left — Aircraft Detail */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Aircraft display card */}
                    <div className="glass p-6 md:p-8">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0 16px' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #0a1628 100%)',
                                border: '1px solid rgba(212,175,55,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                            }}>
                                <span style={{ fontSize: '48px', opacity: 0.9 }}>✈</span>
                            </div>
                            <p className="font-display text-4xl text-white">{selected.model}</p>
                            <p className="font-mono text-xs text-gold mt-1">{selected.manufacturer} · {selected.category}</p>
                            <p className="font-body text-gray-400 text-sm mt-3 max-w-md leading-relaxed">{selected.description}</p>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '8px', margin: '16px 0', borderBottom: '1px solid #1c1c1c', paddingBottom: '0' }}>
                            {[
                                { key: 'specs', label: 'Specifications' },
                                { key: 'insight', label: isPro ? 'Broker Insight' : 'Broker Insight (Pro)' },
                                { key: 'cockpit', label: isPro ? 'Cockpit Brief' : 'Cockpit Brief (Pro)' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    style={{
                                        padding: '8px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                                        letterSpacing: '0.1em', cursor: 'pointer', background: 'none', border: 'none',
                                        borderBottom: activeTab === t.key ? '2px solid #D4AF37' : '2px solid transparent',
                                        color: activeTab === t.key ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                                        marginBottom: '-1px', transition: 'all 0.15s',
                                    }}
                                >
                                    {t.label.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Specs Tab */}
                        {activeTab === 'specs' && (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                    {[
                                        { label: 'Range', value: `${selected.range.toLocaleString()} nm` },
                                        { label: 'Speed', value: `${selected.speed} kts` },
                                        { label: 'Max Passengers', value: selected.paxMax },
                                        { label: 'Service Ceiling', value: `${selected.ceiling.toLocaleString()} ft` },
                                        { label: 'Cabin Length', value: `${selected.cabin.length} ft` },
                                        { label: 'Cabin Width', value: `${selected.cabin.width} ft` },
                                    ].map((s, i) => (
                                        <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</p>
                                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#D4AF37', lineHeight: 1 }}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(30,58,138,0.08)', border: '1px solid rgba(30,58,138,0.2)' }}>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '6px' }}>CHARTER / HR</p>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#fff' }}>${selected.charterHr.toLocaleString()}</p>
                                    </div>
                                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(30,58,138,0.08)', border: '1px solid rgba(30,58,138,0.2)' }}>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '6px' }}>PURCHASE (NEW)</p>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#fff' }}>${selected.purchase}M</p>
                                    </div>
                                </div>

                                {/* Compare button */}
                                {isPro && (
                                    <button
                                        onClick={() => toggleCompare(selected.id)}
                                        style={{
                                            marginTop: '14px', width: '100%', padding: '10px',
                                            borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                                            letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
                                            background: compareIds.includes(selected.id) ? 'rgba(212,175,55,0.1)' : 'transparent',
                                            border: compareIds.includes(selected.id) ? '1px solid rgba(212,175,55,0.4)' : '1px solid #1c1c1c',
                                            color: compareIds.includes(selected.id) ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                                        }}
                                    >
                                        {compareIds.includes(selected.id) ? 'ADDED TO COMPARE' : 'ADD TO COMPARE (MAX 3)'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Broker Insight Tab */}
                        {activeTab === 'insight' && (
                            <div style={{ marginTop: '16px' }}>
                                {isPro ? (
                                    <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '12px' }}>HOW TO SELL THIS AIRCRAFT</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85 }}>
                                            {selected.brokerInsight}
                                        </p>
                                    </div>
                                ) : (
                                    <ProLock navigate={navigate} label="Broker Insights tell you exactly how to position and sell each aircraft.">
                                        <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '12px' }}>HOW TO SELL THIS AIRCRAFT</p>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85 }}>
                                                {selected.brokerInsight}
                                            </p>
                                        </div>
                                    </ProLock>
                                )}
                            </div>
                        )}

                        {/* Cockpit Brief Tab */}
                        {activeTab === 'cockpit' && (
                            <div style={{ marginTop: '16px' }}>
                                {isPro ? (
                                    <div className="space-y-3">
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '12px' }}>COCKPIT BRIEF — {selected.model}</p>
                                        {[
                                            { label: 'Avionics', value: 'Honeywell Primus Elite / Garmin G5000 (model dependent)' },
                                            { label: 'Crew', value: '2 pilots required, type-rated' },
                                            { label: 'Climb Rate', value: 'FL450 in approximately 20 minutes from brake release' },
                                            { label: 'Runway', value: `${Math.round(selected.range * 0.08).toLocaleString()} ft balanced field length (approx)` },
                                            { label: 'Fuel Burn', value: `${Math.round(selected.charterHr * 0.055).toLocaleString()} lbs/hr at cruise` },
                                            { label: 'Reserves', value: 'NBAA IFR — 45min alternate + 30min final' },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1c1c1c' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{item.label.toUpperCase()}</p>
                                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', textAlign: 'right', maxWidth: '60%' }}>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ProLock navigate={navigate} label="Cockpit briefs give you technical depth for client conversations.">
                                        <div className="space-y-3">
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '12px' }}>COCKPIT BRIEF</p>
                                            {[{ label: 'Avionics', value: '————' }, { label: 'Crew', value: '————' }, { label: 'Climb Rate', value: '————' }].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1c1c1c' }}>
                                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{item.label.toUpperCase()}</p>
                                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ProLock>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Compare panel — Pro only */}
                    {isPro && compareIds.length > 0 && (
                        <ComparePanel aircraft={compareAircraft} onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))} navigate={navigate} />
                    )}
                </div>

                {/* Right — Aircraft List */}
                <div className="space-y-2">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p className="section-label">SELECT AIRCRAFT ({filtered.length})</p>
                    </div>
                    <div style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }} className="space-y-2">
                        {filtered.map((a) => (
                            <div
                                key={a.id}
                                onClick={() => handleSelect(a)}
                                style={{
                                    padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                                    border: `1px solid ${selected?.id === a.id ? 'rgba(212,175,55,0.4)' : '#1c1c1c'}`,
                                    background: selected?.id === a.id ? 'rgba(212,175,55,0.05)' : '#0d0d0d',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => { if (selected?.id !== a.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                                onMouseLeave={(e) => { if (selected?.id !== a.id) e.currentTarget.style.borderColor = '#1c1c1c' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: selected?.id === a.id ? '#D4AF37' : '#fff', letterSpacing: '0.04em' }}>{a.model}</p>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{a.category.split(' ').map(w => w[0]).join('')}</span>
                                </div>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                                    {a.manufacturer} · {a.range.toLocaleString()}nm · {a.paxMax} pax
                                </p>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                                    <div>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>CHARTER/HR</p>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>${(a.charterHr / 1000).toFixed(0)}k</p>
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>PURCHASE</p>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>${a.purchase}M</p>
                                    </div>
                                    {isPro && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleCompare(a.id) }}
                                            style={{
                                                marginLeft: 'auto', padding: '2px 8px', borderRadius: '5px', border: 'none', cursor: 'pointer',
                                                background: compareIds.includes(a.id) ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                                                color: compareIds.includes(a.id) ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                                                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.08em',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {compareIds.includes(a.id) ? 'COMPARING' : 'COMPARE'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
