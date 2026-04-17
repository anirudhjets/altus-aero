import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const AIRCRAFT = [
    { id: 'g650er', model: 'G650ER', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range: 7500, speed: 516, paxMax: 19, ceiling: 51000, cabin: { length: 53.6, width: 8.2, height: 6.3 }, charterHr: 12000, purchase: 75, description: 'The benchmark ultra-long-range aircraft. Capable of nonstop Mumbai to London, New York to Hong Kong, and Los Angeles to Sydney with reserves.', brokerInsight: 'Lead with the nonstop argument on routes where competitors need a tech stop. VABB to EGLL is 4,387nm — G650ER clears it with reserves. Clients who have done the route on commercial or a connecting charter immediately understand the value. On price: $12k/hr sounds high until you compare per-seat to business class on a group of eight. Do the math in front of them. Most close on the spot.' },
    { id: 'g700', model: 'G700', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range: 7750, speed: 526, paxMax: 19, ceiling: 51000, cabin: { length: 56.1, width: 8.2, height: 6.2 }, charterHr: 14000, purchase: 90, description: 'Gulfstream\'s flagship. Longer range and more cabin volume than the G650ER. The aircraft for routes over 7,000nm where no tech stop is acceptable.', brokerInsight: 'The G700 has 20% more cabin volume than the G650ER and a longer range. On routes over 7,000nm — VABB to KSFO or EGLL to YSSY — it is the only option for nonstop. On shorter routes, position it as the ultimate comfort play: 13 passengers in a cabin designed for eight. The per-hour premium over a G650ER is real — earn it by anchoring on the cabin experience difference, not the range.' },
    { id: 'global7500', model: 'Global 7500', manufacturer: 'Bombardier', category: 'Ultra Long Range', range: 7700, speed: 516, paxMax: 19, ceiling: 51000, cabin: { length: 57.1, width: 8.2, height: 6.3 }, charterHr: 13000, purchase: 73, description: 'Bombardier\'s answer to the G700. A dedicated stateroom and four living spaces make it the choice for clients who want a private bedroom at altitude.', brokerInsight: 'Range and speed are nearly identical to the G700 — the decision comes down to cabin layout. The Global 7500 has a dedicated stateroom with a real bed, not a fold-flat seat. For clients flying VABB-EGLL overnight, that one detail often closes the deal. Price is slightly below the G700 — if you are positioning against Gulfstream, lead with the stateroom and the Bombardier maintenance network in India.' },
    { id: 'falcon7x', model: 'Falcon 7X', manufacturer: 'Dassault', category: 'Large Jet', range: 5950, speed: 482, paxMax: 14, ceiling: 51000, cabin: { length: 39.1, width: 8.2, height: 6.2 }, charterHr: 9500, purchase: 45, description: 'Three-engine large jet with transcontinental range. The only trijet in this category — relevant for remote or overwater routes where engine-out policy matters.', brokerInsight: 'Three-engine safety is real and resonates with clients who fly over remote terrain or water. ETOPS restrictions are not a concern with three engines. Works particularly well in the Middle East and African markets. Price is 30-40% below ULR — easy to justify on routes under 5,500nm. If the client is deciding between Falcon 7X and G650ER, ask how often they actually fly routes over 5,500nm. For most, the answer is rarely.' },
    { id: 'challenger604', model: 'Challenger 604', manufacturer: 'Bombardier', category: 'Large Jet', range: 4077, speed: 459, paxMax: 12, ceiling: 41000, cabin: { length: 28.4, width: 8.2, height: 6.1 }, charterHr: 8500, purchase: 15, description: 'Pre-owned large jet with proven reliability. A 4,000nm range at significantly lower acquisition cost than new large jets.', brokerInsight: 'A $75M new large jet for $12-18M pre-owned. For cost-sensitive clients who need 10-plus passengers and 4,000nm range, this is the argument. Cabin is dated by current standards — your job is making sure the client is buying range and capacity, not interior. Maintenance reserves matter on a 2005-2010 aircraft: make sure they understand the cost-per-hour difference vs a new midsize before they anchor on acquisition price alone.' },
    { id: 'challenger350', model: 'Challenger 350', manufacturer: 'Bombardier', category: 'Super Midsize', range: 3200, speed: 470, paxMax: 10, ceiling: 45000, cabin: { length: 24.6, width: 7.8, height: 6.1 }, charterHr: 6500, purchase: 26, description: 'The benchmark super midsize. Best range-to-cost ratio in its class, with a flat-floor cabin and strong operator network.', brokerInsight: 'Most value-efficient super midsize on the market. $6,500/hr for 3,200nm range covers most Asian domestic and regional international routes without compromise. Compare to the Latitude: Challenger wins on range and speed. Compare to the G280: Challenger has a larger cabin. Position it as best-in-class in the $25M new aircraft range. For Indian regional clients — VABB to OMDB — it is the default recommendation before you go larger.' },
    { id: 'g280', model: 'G280', manufacturer: 'Gulfstream', category: 'Super Midsize', range: 3600, speed: 482, paxMax: 10, ceiling: 45000, cabin: { length: 25.2, width: 7.2, height: 6.3 }, charterHr: 7000, purchase: 25, description: 'Gulfstream branding at the super midsize price point. Best range in its category with the Gulfstream operator network.', brokerInsight: 'Gulfstream branding at the super midsize price. Clients who want to say they fly Gulfstream but are not ready for a large jet — this is the aircraft. Range of 3,600nm is genuine — covers VABB to OMDB nonstop with margin. Often overlooked because it sits between the 350 and the G450, but it outperforms both on range at this price. Use it to qualify clients before moving them up the Gulfstream line.' },
    { id: 'citationlatitude', model: 'Citation Latitude', manufacturer: 'Cessna', category: 'Super Midsize', range: 2700, speed: 446, paxMax: 9, ceiling: 45000, cabin: { length: 21.8, width: 6.4, height: 6.0 }, charterHr: 5500, purchase: 17, description: 'Entry point to stand-up cabin territory. Flat floor and a 45,000ft ceiling in a super midsize package.', brokerInsight: 'Entry to stand-up cabin at the lowest cost in the category. A 45,000ft ceiling and flat floor makes it feel larger than the numbers suggest. Best argument: compare total trip cost across 50 flights per year against a Challenger 350 — the Latitude saves $400-600k annually. Best positioned for routes under 2,500nm with 6-8 passengers.' },
    { id: 'learjet75', model: 'Learjet 75 Liberty', manufacturer: 'Bombardier', category: 'Midsize', range: 2080, speed: 465, paxMax: 9, ceiling: 51000, cabin: { length: 19.9, width: 5.9, height: 4.9 }, charterHr: 4500, purchase: 13, description: 'The final production Learjet. Highest climb rate in its class with a 51,000ft ceiling — above most weather.', brokerInsight: 'The last Learjet. Bombardier discontinued the line in 2021, which makes pre-owned values interesting — finite supply. Fastest climb rate in its class gets clients to FL510 before most competitors pass FL350. Best positioned for short-to-medium routes where speed matters: VABB to VIDP in under 2 hours.' },
    { id: 'hawker900xp', model: 'Hawker 900XP', manufacturer: 'Hawker Beechcraft', category: 'Midsize', range: 2810, speed: 448, paxMax: 8, ceiling: 41000, cabin: { length: 21.5, width: 6.0, height: 5.7 }, charterHr: 4200, purchase: 8, description: 'Pre-owned midsize with real range. One of the longer-ranging aircraft in the pre-owned midsize segment.', brokerInsight: 'Pre-owned bargain with genuine range. A 2,800nm midsize for under $4M makes it one of the most cost-effective options in the market. Be direct about maintenance: the cost-per-hour on a 2005-2010 aircraft is higher than a new midsize. Run those numbers before the client does.' },
    { id: 'citationxls', model: 'Citation XLS+', manufacturer: 'Cessna', category: 'Midsize', range: 2100, speed: 442, paxMax: 9, ceiling: 45000, cabin: { length: 18.7, width: 5.6, height: 5.7 }, charterHr: 3800, purchase: 12, description: 'The most popular midsize in the charter market. Wide operator network and strong availability across India and the Middle East.', brokerInsight: 'Best availability in the midsize category in India. More operators fly the XLS than any other midsize, which means better charter availability, more competitive pricing, and faster response times. The XLS is often the most practical recommendation — not because it is the best aircraft, but because it is consistently available when they need it.' },
    { id: 'phenom300e', model: 'Phenom 300E', manufacturer: 'Embraer', category: 'Light Jet', range: 2010, speed: 453, paxMax: 9, ceiling: 45000, cabin: { length: 17.6, width: 5.1, height: 4.9 }, charterHr: 2200, purchase: 10, description: 'Six consecutive years as the world\'s best-selling light jet. Best-in-class performance for the category.', brokerInsight: 'Six consecutive years as the world\'s best-selling light jet. That is the pitch — the market voted. Best on shorter routes under 2,000nm with 4-6 passengers where operational cost matters. When a client asks why not a bigger aircraft: at $2,200/hr vs $4,000/hr, the difference over 100 hours per year is $180,000. Show them what that buys.' },
    { id: 'cj4', model: 'Citation CJ4', manufacturer: 'Cessna', category: 'Light Jet', range: 2165, speed: 451, paxMax: 8, ceiling: 45000, cabin: { length: 17.3, width: 4.8, height: 4.8 }, charterHr: 2400, purchase: 9.5, description: 'Reliable entry-level light jet with a strong operator base. Proven on short regional routes.', brokerInsight: 'Excellent entry for clients new to private aviation. Lower operating cost than the Phenom 300E with comparable performance on short legs. First-time buyer pitch: understand your flight-hour needs on a CJ4 for two to three years. You will have real data when it is time to step up. This positions you as the advisor, not the salesperson.' },
    { id: 'hondajet', model: 'HondaJet Elite II', manufacturer: 'Honda', category: 'Light Jet', range: 1437, speed: 422, paxMax: 5, ceiling: 43000, cabin: { length: 14.9, width: 5.0, height: 4.8 }, charterHr: 1900, purchase: 6.7, description: 'Unconventional over-wing engine design dramatically reduces cabin noise. Built for short routes with a focus on interior quality.', brokerInsight: 'The disruption story is part of the pitch. Over-wing engine mounting significantly reduces cabin noise — measurably quieter than any comparable light jet. Do not position it against the Phenom 300E on range — it loses at 1,437nm. Position it on the cabin experience for 4-passenger short-leg flying, where noise and interior quality matter more than the range numbers.' },
]

const CATEGORIES = ['All', 'Ultra Long Range', 'Large Jet', 'Super Midsize', 'Midsize', 'Light Jet']

function incrementFleetViews() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!raw[monthKey]) raw[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        raw[monthKey].fleetViews = (raw[monthKey].fleetViews || 0) + 1
        localStorage.setItem('altus_usage', JSON.stringify(raw))
    } catch { /* silent */ }
}

const D = { fontFamily: 'Bebas Neue, sans-serif' }
const M = { fontFamily: 'JetBrains Mono, monospace' }
const B = { fontFamily: 'DM Sans, sans-serif' }

function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.35 }}>
                {children}
            </div>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.78)', gap: '12px', padding: '24px',
            }}>
                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.25em' }}>PRO FEATURE</p>
                {label && <p style={{ ...B, fontSize: '13px', color: '#999999', textAlign: 'center', maxWidth: '220px', lineHeight: 1.6 }}>{label}</p>}
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{ ...M, fontSize: '10px', letterSpacing: '0.15em', padding: '10px 28px', borderRadius: '9999px', background: 'transparent', color: '#ffffff', border: '1px solid #ffffff', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#000000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff' }}
                >
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

function ComparePanel({ aircraft, onRemove }) {
    if (!aircraft.length) return null
    const fields = [
        { label: 'Range', fn: (a) => `${a.range.toLocaleString()} nm` },
        { label: 'Speed', fn: (a) => `${a.speed} kts` },
        { label: 'Max Pax', fn: (a) => `${a.paxMax}` },
        { label: 'Cabin Length', fn: (a) => `${a.cabin.length} ft` },
        { label: 'Charter / Hr', fn: (a) => `$${a.charterHr.toLocaleString()}` },
        { label: 'Purchase', fn: (a) => `$${a.purchase}M` },
    ]
    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: '#000000', borderTop: '1px solid #ffffff', padding: '18px 32px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.2em' }}>COMPARING {aircraft.length} AIRCRAFT</p>
                    <button onClick={() => aircraft.forEach((a) => onRemove(a.id))} style={{ ...M, fontSize: '9px', color: '#999999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>CLEAR ALL</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `110px repeat(${aircraft.length}, 1fr)`, gap: 0 }}>
                    <div>
                        <div style={{ height: '40px' }} />
                        {fields.map((f) => (
                            <div key={f.label} style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.1em' }}>{f.label.toUpperCase()}</p>
                            </div>
                        ))}
                    </div>
                    {aircraft.map((a) => (
                        <div key={a.id} style={{ paddingLeft: '16px' }}>
                            <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ ...D, fontSize: '18px', color: '#ffffff' }}>{a.model}</p>
                                    <p style={{ ...M, fontSize: '8px', color: '#999999' }}>{a.manufacturer}</p>
                                </div>
                                <button onClick={() => onRemove(a.id)} style={{ background: 'none', border: 'none', color: '#999999', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                            </div>
                            {fields.map((f) => (
                                <div key={f.label} style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                    <p style={{ ...D, fontSize: '18px', color: '#ffffff' }}>{f.fn(a)}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

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
        const matchSearch = a.model.toLowerCase().includes(search.toLowerCase()) || a.manufacturer.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const handleSelect = (a) => { setSelected(a); setActiveTab('specs'); incrementFleetViews() }

    const toggleCompare = (id) => {
        if (!isPro) { navigate('/app/billing'); return }
        setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev)
    }

    const tabs = [
        { key: 'specs', label: 'SPECIFICATIONS' },
        { key: 'insight', label: isPro ? 'BROKER INSIGHT' : 'BROKER INSIGHT (PRO)' },
        { key: 'cockpit', label: isPro ? 'COCKPIT BRIEF' : 'COCKPIT BRIEF (PRO)' },
    ]

    const specRows = [
        { label: 'Range', value: `${selected.range.toLocaleString()} nm` },
        { label: 'Cruise Speed', value: `${selected.speed} kts` },
        { label: 'Max Passengers', value: `${selected.paxMax}` },
        { label: 'Service Ceiling', value: `${selected.ceiling.toLocaleString()} ft` },
        { label: 'Cabin Length', value: `${selected.cabin.length} ft` },
        { label: 'Cabin Width', value: `${selected.cabin.width} ft` },
    ]

    const cockpitRows = [
        { label: 'Avionics', value: 'Honeywell Primus Elite / Garmin G5000 (model dependent)' },
        { label: 'Crew Required', value: '2 pilots, type-rated' },
        { label: 'Climb Rate', value: 'FL450 in approximately 20 minutes from brake release' },
        { label: 'Runway Required', value: `${Math.round(selected.range * 0.08).toLocaleString()} ft balanced field length (approx)` },
        { label: 'Fuel Burn', value: `${Math.round(selected.charterHr * 0.055).toLocaleString()} lbs/hr at cruise` },
        { label: 'Reserves', value: 'NBAA IFR — 45min alternate + 30min final' },
    ]

    return (
        <div style={{ paddingBottom: compareIds.length > 0 ? '240px' : '0' }}>

            {/* Page header */}
            <div style={{ paddingBottom: '28px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.25em', marginBottom: '6px' }}>ALTUS AERO — FLEET INTELLIGENCE</p>
                <h1 style={{ ...D, fontSize: 'clamp(72px, 10vw, 120px)', color: '#ffffff', lineHeight: 1, margin: '0 0 12px 0' }}>FLEET</h1>
                <p style={{ ...B, fontSize: '14px', color: '#999999', lineHeight: 1.65, maxWidth: '480px' }}>
                    A broker who cannot explain the difference between a G650 and a Global 7500 loses the client to someone who can.
                </p>
            </div>

            {/* Search + category filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
                <input
                    type="text"
                    placeholder="SEARCH"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ ...M, flex: '0 0 160px', padding: '9px 14px', fontSize: '10px', letterSpacing: '0.12em', background: '#000000', border: '1px solid #999999', borderRadius: '6px', color: '#ffffff', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                    onBlur={(e) => (e.target.style.borderColor = '#999999')}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            style={{ ...M, fontSize: '9px', letterSpacing: '0.13em', padding: '9px 16px', borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.15s', border: '1px solid', background: category === c ? '#ffffff' : 'transparent', borderColor: category === c ? '#ffffff' : '#999999', color: category === c ? '#000000' : '#999999' }}
                        >
                            {c.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Free tier notice */}
            {!isPro && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '14px 20px', marginBottom: '32px', border: '1px solid rgba(10,191,188,0.25)', borderRadius: '6px' }}>
                    <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.1em' }}>BROKER INSIGHT · COCKPIT BRIEF · COMPARE — PRO FEATURES</p>
                    <button
                        onClick={() => navigate('/app/billing')}
                        style={{ ...M, fontSize: '9px', letterSpacing: '0.15em', padding: '8px 20px', borderRadius: '9999px', background: 'transparent', color: '#0ABFBC', border: '1px solid #0ABFBC', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#0ABFBC'; e.currentTarget.style.color = '#000000' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0ABFBC' }}
                    >
                        UPGRADE TO PRO
                    </button>
                </div>
            )}

            {/* Main grid */}
            <div className="fleet-main-grid grid-cols-1" style={{ display: 'grid', gap: '0' }}>

                {/* Left — detail panel */}
                <div className="fleet-detail-panel">

                    {/* Monumental name */}
                    <div style={{ marginBottom: '28px' }}>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.2em', marginBottom: '4px' }}>{selected.manufacturer.toUpperCase()} · {selected.category.toUpperCase()}</p>
                        <h2 style={{ ...D, fontSize: 'clamp(68px, 9vw, 112px)', color: '#ffffff', lineHeight: 1, margin: '0 0 14px 0' }}>{selected.model}</h2>
                        <p style={{ ...B, fontSize: '14px', color: '#999999', lineHeight: 1.75, maxWidth: '540px' }}>{selected.description}</p>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '28px', gap: '0' }}>
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                style={{ ...M, fontSize: '9px', letterSpacing: '0.14em', padding: '10px 0', marginRight: '28px', background: 'none', border: 'none', borderBottom: activeTab === t.key ? '1px solid #ffffff' : '1px solid transparent', marginBottom: '-1px', cursor: 'pointer', color: activeTab === t.key ? '#ffffff' : '#999999', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Specs */}
                    {activeTab === 'specs' && (
                        <div>
                            {specRows.map((s, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <p style={{ ...M, fontSize: '10px', color: '#999999', letterSpacing: '0.1em' }}>{s.label.toUpperCase()}</p>
                                    <p style={{ ...D, fontSize: '26px', color: '#ffffff', letterSpacing: '0.02em' }}>{s.value}</p>
                                </div>
                            ))}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {[{ label: 'Charter / Hour', value: `$${selected.charterHr.toLocaleString()}` }, { label: 'Purchase (New)', value: `$${selected.purchase}M` }].map((item, i) => (
                                    <div key={i} style={{ padding: '18px 22px', borderRight: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>{item.label.toUpperCase()}</p>
                                        <p style={{ ...D, fontSize: '34px', color: '#ffffff', lineHeight: 1 }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            {isPro && (
                                <button
                                    onClick={() => toggleCompare(selected.id)}
                                    style={{ ...M, fontSize: '9px', letterSpacing: '0.15em', marginTop: '20px', padding: '10px 24px', borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.15s', background: compareIds.includes(selected.id) ? '#ffffff' : 'transparent', border: '1px solid', borderColor: compareIds.includes(selected.id) ? '#ffffff' : '#999999', color: compareIds.includes(selected.id) ? '#000000' : '#999999' }}
                                >
                                    {compareIds.includes(selected.id) ? 'ADDED TO COMPARE' : 'ADD TO COMPARE — MAX 3'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Broker Insight */}
                    {activeTab === 'insight' && (
                        isPro ? (
                            <div>
                                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '20px' }}>HOW TO SELL THIS AIRCRAFT</p>
                                <p style={{ ...B, fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.9 }}>{selected.brokerInsight}</p>
                            </div>
                        ) : (
                            <ProLock navigate={navigate} label="Broker Insights tell you exactly how to position and sell each aircraft.">
                                <div>
                                    <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '20px' }}>HOW TO SELL THIS AIRCRAFT</p>
                                    <p style={{ ...B, fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.9 }}>{selected.brokerInsight}</p>
                                </div>
                            </ProLock>
                        )
                    )}

                    {/* Cockpit Brief */}
                    {activeTab === 'cockpit' && (
                        isPro ? (
                            <div>
                                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '20px' }}>COCKPIT BRIEF — {selected.model}</p>
                                {cockpitRows.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.1em', flexShrink: 0, marginRight: '24px' }}>{item.label.toUpperCase()}</p>
                                        <p style={{ ...B, fontSize: '13px', color: 'rgba(255,255,255,0.65)', textAlign: 'right' }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ProLock navigate={navigate} label="Cockpit briefs give you technical depth for client conversations.">
                                <div>
                                    <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '20px' }}>COCKPIT BRIEF</p>
                                    {[{ label: 'Avionics', value: '————' }, { label: 'Crew Required', value: '————' }, { label: 'Climb Rate', value: '————' }].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.1em' }}>{item.label.toUpperCase()}</p>
                                            <p style={{ ...B, fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </ProLock>
                        )
                    )}
                </div>

                {/* Right — aircraft list */}
                <div style={{ paddingLeft: '28px' }}>
                    <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.2em', marginBottom: '16px' }}>SELECT AIRCRAFT ({filtered.length})</p>
                    <div style={{ maxHeight: '74vh', overflowY: 'auto' }}>
                        {filtered.map((a) => {
                            const isSel = selected?.id === a.id
                            return (
                                <div
                                    key={a.id}
                                    onClick={() => handleSelect(a)}
                                    style={{ padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'opacity 0.15s' }}
                                    onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.opacity = '0.6' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <p style={{ ...D, fontSize: '20px', color: isSel ? '#0ABFBC' : '#ffffff', lineHeight: 1 }}>{a.model}</p>
                                        <p style={{ ...M, fontSize: '8px', color: '#999999' }}>{a.category.split(' ').map(w => w[0]).join('')}</p>
                                    </div>
                                    <p style={{ ...M, fontSize: '9px', color: '#999999', marginBottom: '6px' }}>{a.manufacturer}</p>
                                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>RANGE</p>
                                            <p style={{ ...M, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{a.range.toLocaleString()}nm</p>
                                        </div>
                                        <div>
                                            <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>CHARTER/HR</p>
                                            <p style={{ ...M, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>${(a.charterHr / 1000).toFixed(0)}k</p>
                                        </div>
                                        {isPro && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleCompare(a.id) }}
                                                style={{ ...M, fontSize: '8px', letterSpacing: '0.1em', marginLeft: 'auto', padding: '3px 10px', borderRadius: '9999px', background: 'transparent', cursor: 'pointer', border: '1px solid', borderColor: compareIds.includes(a.id) ? '#ffffff' : '#999999', color: compareIds.includes(a.id) ? '#ffffff' : '#999999', transition: 'all 0.15s' }}
                                            >
                                                {compareIds.includes(a.id) ? 'ADDED' : 'COMPARE'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {isPro && compareIds.length > 0 && (
                <ComparePanel aircraft={AIRCRAFT.filter((a) => compareIds.includes(a.id))} onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))} />
            )}
        </div>
    )
}