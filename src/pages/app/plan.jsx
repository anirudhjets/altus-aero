import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

/* ─── RATES ──────────────────────────────────────────────────────── */
const CATEGORIES = [
    { label: 'Light Jet', rateMin: 3200, rateMax: 4500, speed: 450, examples: 'Phenom 300E, Citation CJ4' },
    { label: 'Midsize', rateMin: 4000, rateMax: 6000, speed: 460, examples: 'Challenger 350 entry, Hawker 900XP' },
    { label: 'Super Midsize', rateMin: 5500, rateMax: 8500, speed: 475, examples: 'Challenger 350, G280' },
    { label: 'Large Jet', rateMin: 8500, rateMax: 12000, speed: 480, examples: 'Falcon 7X, Challenger 604' },
    { label: 'Ultra Long Range', rateMin: 11000, rateMax: 16000, speed: 510, examples: 'G650ER, G700, Global 7500' },
]

/* Common airports for range lookup */
const AIRPORTS = {
    VABB: { name: 'Mumbai', lat: 19.09, lon: 72.87 },
    VIDP: { name: 'Delhi', lat: 28.56, lon: 77.10 },
    VOBL: { name: 'Bangalore', lat: 13.20, lon: 77.71 },
    VOMM: { name: 'Chennai', lat: 12.99, lon: 80.18 },
    EGLL: { name: 'London Heathrow', lat: 51.48, lon: -0.45 },
    LFPG: { name: 'Paris CDG', lat: 49.01, lon: 2.55 },
    OMDB: { name: 'Dubai', lat: 25.25, lon: 55.36 },
    OTHH: { name: 'Doha', lat: 25.27, lon: 51.61 },
    KJFK: { name: 'New York JFK', lat: 40.64, lon: -73.78 },
    KLAX: { name: 'Los Angeles', lat: 33.94, lon: -118.41 },
    YSSY: { name: 'Sydney', lat: -33.95, lon: 151.18 },
    RJTT: { name: 'Tokyo', lat: 35.55, lon: 139.78 },
    ZBAA: { name: 'Beijing', lat: 40.08, lon: 116.58 },
    WSSS: { name: 'Singapore', lat: 1.36, lon: 103.99 },
}

function toRad(d) { return (d * Math.PI) / 180 }

function greatCircleNm(origin, dest) {
    const a = AIRPORTS[origin.toUpperCase()]
    const b = AIRPORTS[dest.toUpperCase()]
    if (!a || !b) return null
    const R = 3440 // nm
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const sin = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
    return Math.round(R * 2 * Math.asin(Math.sqrt(sin)))
}

/* ─── INCREMENT MISSION COUNTER ─────────────────────────────────── */
function recordMissionPlan() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!raw[monthKey]) raw[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        raw[monthKey].routesPlanned = (raw[monthKey].routesPlanned || 0) + 1
        localStorage.setItem('altus_usage', JSON.stringify(raw))
    } catch { /* silent */ }
}

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
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>{label}</p>}
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{ padding: '8px 20px', borderRadius: '8px', background: '#D4AF37', color: '#0a0a0a', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', border: 'none', cursor: 'pointer' }}
                >
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid #1c1c1c',
    borderRadius: '10px', color: '#fff',
    fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
}

export default function Plan() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()

    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [manualNm, setManualNm] = useState('')
    const [pax, setPax] = useState(4)
    const [categoryIndex, setCategoryIndex] = useState(2)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const [distanceUsed, setDistanceUsed] = useState(null)

    const cat = CATEGORIES[categoryIndex]

    const handleCalculate = () => {
        setError('')
        setResult(null)

        // Try ICAO lookup first, then fall back to manual distance
        let nm = null
        const origUpper = origin.trim().toUpperCase()
        const destUpper = destination.trim().toUpperCase()

        if (origUpper && destUpper) {
            nm = greatCircleNm(origUpper, destUpper)
            if (!nm && !manualNm) {
                setError(`Airport code not found. Enter distance in nm manually below, or use a known code like VABB, EGLL, OMDB, KJFK.`)
                return
            }
        }

        if (!nm && manualNm) {
            nm = parseInt(manualNm, 10)
            if (isNaN(nm) || nm < 50 || nm > 12000) {
                setError('Please enter a valid distance between 50 and 12,000nm.')
                return
            }
        }

        if (!nm) {
            setError('Enter origin and destination airport codes, or a distance in nm.')
            return
        }

        setDistanceUsed(nm)

        // Add 10% for reserves and routing deviations
        const adjustedNm = Math.round(nm * 1.10)
        const hours = adjustedNm / cat.speed
        const costMin = Math.round(hours * cat.rateMin / 1000) * 1000
        const costMax = Math.round(hours * cat.rateMax / 1000) * 1000
        const perSeatMin = Math.round(costMin / pax / 100) * 100
        const perSeatMax = Math.round(costMax / pax / 100) * 100
        const midCost = Math.round((costMin + costMax) / 2)

        recordMissionPlan()

        setResult({
            nm, adjustedNm, hours, costMin, costMax, perSeatMin, perSeatMax, midCost,
            categoryLabel: cat.label,
            aircraftExamples: cat.examples,
            pax,
        })
    }

    const getClientFraming = (r) => {
        const businessClassRate = 1800
        const bcTotal = businessClassRate * r.pax
        const bcVsCharter = Math.round(r.midCost / bcTotal * 10) / 10
        return `At approximately $${(r.midCost / 1000).toFixed(0)}k for ${r.pax} passengers, that is $${r.perSeatMax.toLocaleString()} per seat. Compare that to ${r.pax} business class tickets at roughly $${businessClassRate.toLocaleString()} each — a total of $${bcTotal.toLocaleString()} — and you are looking at ${bcVsCharter}x the cost for full privacy, no connections, door-to-door convenience, and zero time in an airport queue. For clients who value their time, the conversation is not about price. It is about what they are buying per dollar.`
    }

    const getRouteOptimisation = (r) => {
        const lowerCat = CATEGORIES[Math.max(0, categoryIndex - 1)]
        const canDowngrade = r.nm < 2800 && categoryIndex > 0
        return canDowngrade
            ? `Your distance of ${r.nm}nm is within range of a ${lowerCat.label}. At $${Math.round(r.hours * lowerCat.rateMin / 1000) * 1000 / 1000}k–$${Math.round(r.hours * lowerCat.rateMax / 1000) * 1000 / 1000}k estimated, you save ${Math.round((r.costMin - r.hours * lowerCat.rateMax) / 1000) * -1}k–${Math.round((r.costMax - r.hours * lowerCat.rateMin) / 1000)}k. If the client can accommodate a smaller cabin, present this as the cost-optimised option and let them choose. You look like the advisor, not the salesperson.`
            : `A ${r.categoryLabel} is the right category for this route at ${r.nm}nm. Going down a category would compromise range safety margins. Going up a category adds $${(Math.round(r.hours * CATEGORIES[Math.min(categoryIndex + 1, 4)].rateMin / 1000) * 1000 / 1000).toFixed(0)}k+ but unlocks a larger cabin — worth presenting to clients who mention comfort or need to work in flight.`
    }

    return (
        <div className="space-y-4 md:space-y-6 max-w-3xl">

            {/* Header */}
            <div>
                <p className="section-label">CHARTER COST CALCULATOR</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">PLAN</h1>
                <p className="font-body text-gray-400 text-sm mt-1">
                    Calculate any charter cost. Frame it for the client.
                </p>
            </div>

            {/* Inputs */}
            <div className="glass p-5 md:p-6 space-y-5">
                <p className="section-label">ROUTE DETAILS</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>ORIGIN (ICAO)</p>
                        <input
                            type="text"
                            placeholder="e.g. VABB"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value.toUpperCase().slice(0, 4))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                            onBlur={(e) => (e.target.style.borderColor = '#1c1c1c')}
                        />
                    </div>
                    <div>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>DESTINATION (ICAO)</p>
                        <input
                            type="text"
                            placeholder="e.g. EGLL"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value.toUpperCase().slice(0, 4))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                            onBlur={(e) => (e.target.style.borderColor = '#1c1c1c')}
                        />
                    </div>
                </div>

                {/* Supported airports hint */}
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
                    Supported: VABB · VIDP · VOBL · VOMM · EGLL · LFPG · OMDB · OTHH · KJFK · KLAX · YSSY · RJTT · ZBAA · WSSS
                </p>

                <div>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>DISTANCE (NM) — OPTIONAL IF USING ICAO CODES ABOVE</p>
                    <input
                        type="number"
                        placeholder="Enter distance in nautical miles"
                        value={manualNm}
                        onChange={(e) => setManualNm(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                        onBlur={(e) => (e.target.style.borderColor = '#1c1c1c')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>PASSENGERS</p>
                        <input
                            type="number"
                            min={1} max={19}
                            value={pax}
                            onChange={(e) => setPax(Math.min(19, Math.max(1, parseInt(e.target.value) || 1)))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                            onBlur={(e) => (e.target.style.borderColor = '#1c1c1c')}
                        />
                    </div>
                    <div>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>AIRCRAFT CATEGORY</p>
                        <select
                            value={categoryIndex}
                            onChange={(e) => setCategoryIndex(parseInt(e.target.value))}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            {CATEGORIES.map((c, i) => (
                                <option key={i} value={i}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
                    {cat.label}: {cat.examples}
                </p>

                {error && (
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#f87171', padding: '10px 14px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px' }}>
                        {error}
                    </p>
                )}

                <button
                    onClick={handleCalculate}
                    style={{
                        width: '100%', padding: '14px', background: '#D4AF37', color: '#0a0a0a',
                        border: 'none', borderRadius: '10px', fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '15px', letterSpacing: '0.15em', cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    CALCULATE CHARTER COST
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="space-y-4">

                    {/* Cost output */}
                    <div className="glass p-5 md:p-6">
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                            <div>
                                <p className="section-label mb-1">ESTIMATED CHARTER COST</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', color: '#fff', lineHeight: 1 }}>
                                    ${(result.costMin / 1000).toFixed(0)}k – ${(result.costMax / 1000).toFixed(0)}k
                                </p>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                                    One way · {result.categoryLabel} · {result.hours.toFixed(1)} hrs
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginBottom: '3px' }}>PER SEAT</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#D4AF37' }}>
                                    ${result.perSeatMin.toLocaleString()} – ${result.perSeatMax.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Route Distance', value: `${result.nm.toLocaleString()} nm` },
                                { label: 'With Reserves', value: `${result.adjustedNm.toLocaleString()} nm` },
                                { label: 'Passengers', value: result.pax },
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label.toUpperCase()}</p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)', marginTop: '12px', lineHeight: 1.6 }}>
                            Estimates based on current charter market rates for {result.categoryLabel} category aircraft. Actual pricing varies by operator, routing, and availability. Always verify with operators before quoting to a client.
                        </p>
                    </div>

                    {/* Client Framing — Pro only */}
                    {isPro ? (
                        <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                            <p className="section-label mb-3">CLIENT FRAMING</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85 }}>
                                {getClientFraming(result)}
                            </p>
                        </div>
                    ) : (
                        <ProLock navigate={navigate} label="Client Framing shows you exactly how to present this number so the client understands the value.">
                            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                <p className="section-label mb-3">CLIENT FRAMING</p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85 }}>
                                    At approximately $X per seat — comparable to business class, but with full privacy and no connections — the conversation is not about price. It is about what the client is buying per dollar.
                                </p>
                            </div>
                        </ProLock>
                    )}

                    {/* Route Optimisation — Pro only */}
                    {isPro ? (
                        <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                            <p className="section-label mb-3">ROUTE OPTIMISATION</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
                                {getRouteOptimisation(result)}
                            </p>
                        </div>
                    ) : (
                        <ProLock navigate={navigate} label="Route Optimisation suggests the best aircraft category for this budget and route.">
                            <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                <p className="section-label mb-3">ROUTE OPTIMISATION</p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
                                    Consider a different aircraft category for this route and passenger count. Pro unlocks the full optimisation.
                                </p>
                            </div>
                        </ProLock>
                    )}
                </div>
            )}

            {/* Education note */}
            <div style={{ padding: '16px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '6px' }}>HOW THIS WORKS</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                    Estimates use great-circle distance plus 10% for reserves and routing deviations, multiplied by current market charter rate ranges for the selected aircraft category. Never quote these numbers to a client without confirming with an operator first. Use them to qualify the conversation, not close the deal.
                </p>
            </div>
        </div>
    )
}
