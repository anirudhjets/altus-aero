import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const CATEGORIES = [
    { label: 'Light Jet', rateMin: 3200, rateMax: 4500, speed: 450, examples: 'Phenom 300E, Citation CJ4' },
    { label: 'Midsize', rateMin: 4000, rateMax: 6000, speed: 460, examples: 'Challenger 350 entry, Hawker 900XP' },
    { label: 'Super Midsize', rateMin: 5500, rateMax: 8500, speed: 475, examples: 'Challenger 350, G280' },
    { label: 'Large Jet', rateMin: 8500, rateMax: 12000, speed: 480, examples: 'Falcon 7X, Challenger 604' },
    { label: 'Ultra Long Range', rateMin: 11000, rateMax: 16000, speed: 510, examples: 'G650ER, G700, Global 7500' },
]

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
    const R = 3440
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const sin = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
    return Math.round(R * 2 * Math.asin(Math.sqrt(sin)))
}

function recordMissionPlan() {
    try {
        const monthKey = new Date().toISOString().slice(0, 7)
        const raw = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!raw[monthKey]) raw[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        raw[monthKey].routesPlanned = (raw[monthKey].routesPlanned || 0) + 1
        localStorage.setItem('altus_usage', JSON.stringify(raw))
    } catch { /* silent */ }
}

const D = { fontFamily: 'Bebas Neue, sans-serif' }
const M = { fontFamily: 'JetBrains Mono, monospace' }
const B = { fontFamily: 'DM Sans, sans-serif' }

const inputStyle = {
    ...M, width: '100%', padding: '11px 14px', fontSize: '11px', letterSpacing: '0.1em',
    background: '#000000', border: '1px solid #999999', borderRadius: '6px',
    color: '#ffffff', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
}

function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.35 }}>
                {children}
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.78)', gap: '12px', padding: '28px' }}>
                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.25em' }}>PRO FEATURE</p>
                {label && <p style={{ ...B, fontSize: '13px', color: '#999999', textAlign: 'center', maxWidth: '240px', lineHeight: 1.6 }}>{label}</p>}
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

    const cat = CATEGORIES[categoryIndex]

    const handleCalculate = () => {
        setError('')
        setResult(null)
        let nm = null
        const origUpper = origin.trim().toUpperCase()
        const destUpper = destination.trim().toUpperCase()

        if (origUpper && destUpper) {
            nm = greatCircleNm(origUpper, destUpper)
            if (!nm && !manualNm) {
                setError('Airport code not found. Enter distance in nm manually, or use a known code: VABB, EGLL, OMDB, KJFK.')
                return
            }
        }

        if (!nm && manualNm) {
            nm = parseInt(manualNm, 10)
            if (isNaN(nm) || nm < 50 || nm > 12000) {
                setError('Enter a valid distance between 50 and 12,000nm.')
                return
            }
        }

        if (!nm) {
            setError('Enter origin and destination airport codes, or a distance in nm.')
            return
        }

        const adjustedNm = Math.round(nm * 1.10)
        const hours = adjustedNm / cat.speed
        const costMin = Math.round(hours * cat.rateMin / 1000) * 1000
        const costMax = Math.round(hours * cat.rateMax / 1000) * 1000
        const perSeatMin = Math.round(costMin / pax / 100) * 100
        const perSeatMax = Math.round(costMax / pax / 100) * 100
        const midCost = Math.round((costMin + costMax) / 2)

        recordMissionPlan()

        setResult({ nm, adjustedNm, hours, costMin, costMax, perSeatMin, perSeatMax, midCost, categoryLabel: cat.label, aircraftExamples: cat.examples, pax })
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
            ? `Your distance of ${r.nm}nm is within range of a ${lowerCat.label}. At $${Math.round(r.hours * lowerCat.rateMin / 1000) * 1000 / 1000}k–$${Math.round(r.hours * lowerCat.rateMax / 1000) * 1000 / 1000}k estimated, you save meaningfully on cost. If the client can accommodate a smaller cabin, present this as the cost-optimised option and let them choose. You look like the advisor, not the salesperson.`
            : `A ${r.categoryLabel} is the right category for this route at ${r.nm}nm. Going down a category would compromise range safety margins. Going up a category unlocks a larger cabin — worth presenting to clients who mention comfort or need to work in flight.`
    }

    return (
        <div style={{ maxWidth: '680px' }}>

            {/* Page header */}
            <div style={{ paddingBottom: '28px', marginBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.25em', marginBottom: '6px' }}>ALTUS AERO — CHARTER COST CALCULATOR</p>
                <h1 style={{ ...D, fontSize: 'clamp(72px, 10vw, 112px)', color: '#ffffff', lineHeight: 1, margin: '0 0 12px 0' }}>PLAN</h1>
                <p style={{ ...B, fontSize: '14px', color: '#999999', lineHeight: 1.65 }}>
                    Calculate any charter cost. Frame it for the client.
                </p>
            </div>

            {/* Input section */}
            <div style={{ marginBottom: '32px' }}>
                <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.2em', marginBottom: '20px' }}>ROUTE DETAILS</p>

                {/* Origin + Destination */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>ORIGIN (ICAO)</p>
                        <input
                            type="text" placeholder="VABB" value={origin}
                            onChange={(e) => setOrigin(e.target.value.toUpperCase().slice(0, 4))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                            onBlur={(e) => (e.target.style.borderColor = '#999999')}
                        />
                    </div>
                    <div>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>DESTINATION (ICAO)</p>
                        <input
                            type="text" placeholder="EGLL" value={destination}
                            onChange={(e) => setDestination(e.target.value.toUpperCase().slice(0, 4))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                            onBlur={(e) => (e.target.style.borderColor = '#999999')}
                        />
                    </div>
                </div>

                {/* Supported airports */}
                <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.7, marginBottom: '16px', letterSpacing: '0.05em' }}>
                    SUPPORTED: VABB · VIDP · VOBL · VOMM · EGLL · LFPG · OMDB · OTHH · KJFK · KLAX · YSSY · RJTT · ZBAA · WSSS
                </p>

                {/* Manual nm */}
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>DISTANCE (NM) — OPTIONAL OVERRIDE</p>
                    <input
                        type="number" placeholder="Enter distance in nautical miles" value={manualNm}
                        onChange={(e) => setManualNm(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                        onBlur={(e) => (e.target.style.borderColor = '#999999')}
                    />
                </div>

                {/* Pax + Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>PASSENGERS</p>
                        <input
                            type="number" min={1} max={19} value={pax}
                            onChange={(e) => setPax(Math.min(19, Math.max(1, parseInt(e.target.value) || 1)))}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                            onBlur={(e) => (e.target.style.borderColor = '#999999')}
                        />
                    </div>
                    <div>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>AIRCRAFT CATEGORY</p>
                        <select
                            value={categoryIndex}
                            onChange={(e) => setCategoryIndex(parseInt(e.target.value))}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            {CATEGORIES.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
                        </select>
                    </div>
                </div>

                <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', marginBottom: '20px' }}>
                    {cat.label.toUpperCase()}: {cat.examples}
                </p>

                {/* Error */}
                {error && (
                    <div style={{ padding: '12px 16px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', marginBottom: '16px' }}>
                        <p style={{ ...M, fontSize: '10px', color: '#ffffff', letterSpacing: '0.06em' }}>{error}</p>
                    </div>
                )}

                {/* Calculate button — pill */}
                <button
                    onClick={handleCalculate}
                    style={{ ...M, fontSize: '11px', letterSpacing: '0.18em', width: '100%', padding: '14px', borderRadius: '9999px', background: '#ffffff', color: '#000000', border: '1px solid #ffffff', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    CALCULATE CHARTER COST
                </button>
            </div>

            {/* Result */}
            {result && (
                <div>
                    {/* Hairline divider */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '32px', marginBottom: '28px' }}>

                        {/* Monumental cost */}
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.2em', marginBottom: '8px' }}>ESTIMATED CHARTER COST</p>
                        <p style={{ ...D, fontSize: 'clamp(56px, 8vw, 96px)', color: '#ffffff', lineHeight: 1, margin: '0 0 4px 0' }}>
                            ${(result.costMin / 1000).toFixed(0)}k – ${(result.costMax / 1000).toFixed(0)}k
                        </p>
                        <p style={{ ...M, fontSize: '9px', color: '#999999', letterSpacing: '0.1em', marginBottom: '24px' }}>
                            ONE WAY · {result.categoryLabel.toUpperCase()} · {result.hours.toFixed(1)} HRS
                        </p>

                        {/* Per seat */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '28px' }}>
                            <div>
                                <p style={{ ...M, fontSize: '8px', color: '#999999', letterSpacing: '0.15em', marginBottom: '4px' }}>PER SEAT</p>
                                <p style={{ ...D, fontSize: '32px', color: '#0ABFBC', lineHeight: 1 }}>
                                    ${result.perSeatMin.toLocaleString()} – ${result.perSeatMax.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                            {[
                                { label: 'Route Distance', value: `${result.nm.toLocaleString()} nm` },
                                { label: 'With Reserves', value: `${result.adjustedNm.toLocaleString()} nm` },
                                { label: 'Passengers', value: `${result.pax}` },
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '16px 18px', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ ...M, fontSize: '8px', color: '#999999', letterSpacing: '0.12em', marginBottom: '6px' }}>{item.label.toUpperCase()}</p>
                                    <p style={{ ...D, fontSize: '22px', color: '#ffffff', lineHeight: 1 }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <p style={{ ...M, fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginTop: '12px', lineHeight: 1.7, letterSpacing: '0.04em' }}>
                            Estimates based on current charter market rates for {result.categoryLabel} category aircraft. Always verify with operators before quoting to a client.
                        </p>
                    </div>

                    {/* Client Framing */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px', marginBottom: '28px' }}>
                        {isPro ? (
                            <div>
                                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '16px' }}>CLIENT FRAMING</p>
                                <p style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>{getClientFraming(result)}</p>
                            </div>
                        ) : (
                            <ProLock navigate={navigate} label="Client Framing shows you exactly how to present this number so the client understands the value.">
                                <div>
                                    <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '16px' }}>CLIENT FRAMING</p>
                                    <p style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>
                                        At approximately $X per seat — comparable to business class, but with full privacy and no connections — the conversation is not about price. It is about what the client is buying per dollar.
                                    </p>
                                </div>
                            </ProLock>
                        )}
                    </div>

                    {/* Route Optimisation */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px', marginBottom: '28px' }}>
                        {isPro ? (
                            <div>
                                <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '16px' }}>ROUTE OPTIMISATION</p>
                                <p style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>{getRouteOptimisation(result)}</p>
                            </div>
                        ) : (
                            <ProLock navigate={navigate} label="Route Optimisation suggests the best aircraft category for this budget and route.">
                                <div>
                                    <p style={{ ...M, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em', marginBottom: '16px' }}>ROUTE OPTIMISATION</p>
                                    <p style={{ ...B, fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
                                        Consider a different aircraft category for this route and passenger count. Pro unlocks the full optimisation.
                                    </p>
                                </div>
                            </ProLock>
                        )}
                    </div>
                </div>
            )}

            {/* Education note */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px', marginTop: result ? '0' : '8px' }}>
                <p style={{ ...M, fontSize: '8px', color: '#999999', letterSpacing: '0.15em', marginBottom: '8px' }}>HOW THIS WORKS</p>
                <p style={{ ...B, fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.75 }}>
                    Estimates use great-circle distance plus 10% for reserves and routing deviations, multiplied by current market charter rate ranges for the selected aircraft category. Never quote these numbers to a client without confirming with an operator first. Use them to qualify the conversation, not close the deal.
                </p>
            </div>
        </div>
    )
}