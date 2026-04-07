import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

/* ─── AIRCRAFT CATEGORIES ────────────────────────────────────────── */
const CATEGORIES = [
    { label: 'Light Jet', rateMin: 3200, rateMax: 4500, speed: 450, examples: 'Phenom 300E, Citation CJ4', maxRange: 2100, fixedAnnual: 530000, variablePerHr: 800 },
    { label: 'Midsize', rateMin: 4000, rateMax: 6000, speed: 460, examples: 'Challenger 350 entry, Hawker 900XP', maxRange: 3200, fixedAnnual: 680000, variablePerHr: 1000 },
    { label: 'Super Midsize', rateMin: 5500, rateMax: 8500, speed: 475, examples: 'Challenger 350, G280', maxRange: 4500, fixedAnnual: 890000, variablePerHr: 1200 },
    { label: 'Large Jet', rateMin: 8500, rateMax: 12000, speed: 480, examples: 'Falcon 7X, Challenger 604', maxRange: 6000, fixedAnnual: 1230000, variablePerHr: 1500 },
    { label: 'Ultra Long Range', rateMin: 11000, rateMax: 16000, speed: 510, examples: 'G650ER, G700, Global 7500', maxRange: 8000, fixedAnnual: 1700000, variablePerHr: 2000 },
]

/* ─── AIRPORTS ───────────────────────────────────────────────────── */
const AIRPORTS = [
    { icao: 'VABB', city: 'Mumbai', country: 'India', lat: 19.09, lon: 72.87 },
    { icao: 'VIDP', city: 'Delhi', country: 'India', lat: 28.56, lon: 77.10 },
    { icao: 'VOBL', city: 'Bangalore', country: 'India', lat: 13.20, lon: 77.71 },
    { icao: 'VOMM', city: 'Chennai', country: 'India', lat: 12.99, lon: 80.18 },
    { icao: 'EGLL', city: 'London', country: 'UK', lat: 51.48, lon: -0.45 },
    { icao: 'LFPG', city: 'Paris', country: 'France', lat: 49.01, lon: 2.55 },
    { icao: 'OMDB', city: 'Dubai', country: 'UAE', lat: 25.25, lon: 55.36 },
    { icao: 'OTHH', city: 'Doha', country: 'Qatar', lat: 25.27, lon: 51.61 },
    { icao: 'KJFK', city: 'New York', country: 'USA', lat: 40.64, lon: -73.78 },
    { icao: 'KLAX', city: 'Los Angeles', country: 'USA', lat: 33.94, lon: -118.41 },
    { icao: 'YSSY', city: 'Sydney', country: 'Australia', lat: -33.95, lon: 151.18 },
    { icao: 'RJTT', city: 'Tokyo', country: 'Japan', lat: 35.55, lon: 139.78 },
    { icao: 'ZBAA', city: 'Beijing', country: 'China', lat: 40.08, lon: 116.58 },
    { icao: 'WSSS', city: 'Singapore', country: 'Singapore', lat: 1.36, lon: 103.99 },
]

const AIRPORT_MAP = Object.fromEntries(AIRPORTS.map(a => [a.icao, a]))

/* ─── RATE LIMITING ──────────────────────────────────────────────── */
const FREE_LIMIT = 20
const WINDOW_HOURS = 24

function getLimitStatus() {
    try {
        const raw = JSON.parse(localStorage.getItem('altus_plan_limit') || '{}')
        const now = Date.now()
        const windowStart = raw.windowStart || now
        const windowEnd = windowStart + WINDOW_HOURS * 3600000
        if (now > windowEnd) return { count: 0, locked: false, resetsAt: null }
        const count = raw.count || 0
        return { count, locked: count >= FREE_LIMIT, resetsAt: count >= FREE_LIMIT ? windowEnd : null }
    } catch {
        return { count: 0, locked: false, resetsAt: null }
    }
}

function incrementLimit() {
    try {
        const raw = JSON.parse(localStorage.getItem('altus_plan_limit') || '{}')
        const now = Date.now()
        const windowStart = raw.windowStart || now
        const windowEnd = windowStart + WINDOW_HOURS * 3600000
        const expired = now > windowEnd
        const count = expired ? 1 : (raw.count || 0) + 1
        const newWindowStart = expired ? now : windowStart
        localStorage.setItem('altus_plan_limit', JSON.stringify({ count, windowStart: newWindowStart }))
        // Also update altus_usage
        const monthKey = new Date().toISOString().slice(0, 7)
        const usage = JSON.parse(localStorage.getItem('altus_usage') || '{}')
        if (!usage[monthKey]) usage[monthKey] = { sessions: 0, days: [], routesPlanned: 0, fleetViews: 0 }
        usage[monthKey].routesPlanned = (usage[monthKey].routesPlanned || 0) + 1
        localStorage.setItem('altus_usage', JSON.stringify(usage))
    } catch { }
}

/* ─── HELPERS ────────────────────────────────────────────────────── */
function toRad(d) { return (d * Math.PI) / 180 }

function greatCircleNm(originIcao, destIcao) {
    const a = AIRPORT_MAP[originIcao]
    const b = AIRPORT_MAP[destIcao]
    if (!a || !b) return null
    const R = 3440
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const sin = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
    return Math.round(R * 2 * Math.asin(Math.sqrt(sin)))
}

function suggestCategory(nm) {
    if (nm <= 2100) return 0
    if (nm <= 3200) return 1
    if (nm <= 4500) return 2
    if (nm <= 6000) return 3
    return 4
}

function formatCountdown(ms) {
    if (ms <= 0) return '00:00:00'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/* ─── PRO LOCK ───────────────────────────────────────────────────── */
function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>{children}</div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(2px)', borderRadius: '12px', gap: '10px', padding: '16px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em' }}>PRO FEATURE</span>
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>{label}</p>}
                <button onClick={() => navigate('/app/billing')} style={{ padding: '8px 20px', borderRadius: '8px', background: '#D4AF37', color: '#0a0a0a', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', border: 'none', cursor: 'pointer' }}>
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

const selectStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid #1c1c1c',
    borderRadius: '10px', color: '#fff',
    fontFamily: 'DM Sans, sans-serif', fontSize: '13px', outline: 'none',
    cursor: 'pointer', boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid #1c1c1c',
    borderRadius: '10px', color: '#fff',
    fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
}

const labelStyle = {
    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
    color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px',
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function Plan() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('charter')

    // Charter calculator state
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [pax, setPax] = useState(4)
    const [categoryIndex, setCategoryIndex] = useState(2)
    const [result, setResult] = useState(null)
    const [autoCategory, setAutoCategory] = useState(true)

    // Rate limit state
    const [limitStatus, setLimitStatus] = useState(getLimitStatus)
    const [countdown, setCountdown] = useState('')

    // Charter vs ownership state
    const [cvoHours, setCvoHours] = useState(200)
    const [cvoCategoryIndex, setCvoCategoryIndex] = useState(2)
    const [cvoResult, setCvoResult] = useState(null)

    // Countdown ticker
    useEffect(() => {
        if (!limitStatus.resetsAt) return
        const tick = () => {
            const remaining = limitStatus.resetsAt - Date.now()
            if (remaining <= 0) {
                setLimitStatus(getLimitStatus())
                setCountdown('')
            } else {
                setCountdown(formatCountdown(remaining))
            }
        }
        tick()
        const iv = setInterval(tick, 1000)
        return () => clearInterval(iv)
    }, [limitStatus.resetsAt])

    // Auto-calculate when both airports selected
    useEffect(() => {
        if (!origin || !destination || origin === destination) return
        const nm = greatCircleNm(origin, destination)
        if (!nm) return
        if (autoCategory) {
            setCategoryIndex(suggestCategory(nm))
        }
        // Auto-run calculation
        runCalculation(nm)
    }, [origin, destination, pax, categoryIndex])

    const cat = CATEGORIES[categoryIndex]

    const runCalculation = (nmOverride) => {
        const nm = nmOverride ?? greatCircleNm(origin, destination)
        if (!nm) return

        if (!isPro) {
            const status = getLimitStatus()
            if (status.locked) { setLimitStatus(status); return }
        }

        const adjustedNm = Math.round(nm * 1.10)
        const hours = adjustedNm / cat.speed
        const costMin = Math.round(hours * cat.rateMin / 1000) * 1000
        const costMax = Math.round(hours * cat.rateMax / 1000) * 1000
        const perSeatMin = Math.round(costMin / pax / 100) * 100
        const perSeatMax = Math.round(costMax / pax / 100) * 100
        const midCost = Math.round((costMin + costMax) / 2)

        if (!isPro) {
            incrementLimit()
            setLimitStatus(getLimitStatus())
        }

        setResult({ nm, adjustedNm, hours, costMin, costMax, perSeatMin, perSeatMax, midCost, categoryLabel: cat.label, aircraftExamples: cat.examples, pax })
    }

    const handleManualCalculate = () => runCalculation()

    // Charter vs Ownership calculator
    const runCvoCalculation = () => {
        const c = CATEGORIES[cvoCategoryIndex]
        const midRate = (c.rateMin + c.rateMax) / 2
        const annualCharterCost = Math.round(cvoHours * midRate)
        const annualOwnershipCost = Math.round(c.fixedAnnual + cvoHours * c.variablePerHr)
        const breakeven = Math.round(c.fixedAnnual / (midRate - c.variablePerHr))
        const charterWins = cvoHours < breakeven
        const saving = Math.abs(annualCharterCost - annualOwnershipCost)
        setCvoResult({ annualCharterCost, annualOwnershipCost, breakeven, charterWins, saving, hours: cvoHours, category: c.label })
    }

    useEffect(() => { runCvoCalculation() }, [cvoHours, cvoCategoryIndex])

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
            ? `Your distance of ${r.nm}nm is within range of a ${lowerCat.label}. Estimated at $${Math.round(r.hours * lowerCat.rateMin / 1000) * 1000 / 1000}k–$${Math.round(r.hours * lowerCat.rateMax / 1000) * 1000 / 1000}k, this saves your client meaningful money. If they can accommodate a smaller cabin, present this as the cost-optimised option and let them choose. You look like the advisor, not the salesperson.`
            : `A ${r.categoryLabel} is the right category for this route at ${r.nm}nm. Going down a category would compromise range safety margins. Going up adds $${(Math.round(r.hours * CATEGORIES[Math.min(categoryIndex + 1, 4)].rateMin / 1000) * 1000 / 1000).toFixed(0)}k+ but unlocks a larger cabin — worth presenting to clients who mention comfort or need to work en route.`
    }

    const isLocked = !isPro && limitStatus.locked

    return (
        <div className="space-y-4 md:space-y-6 max-w-3xl">

            {/* Header */}
            <div>
                <p className="section-label">DEAL PLANNING</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">PLAN</h1>
                <p className="font-body text-gray-400 text-sm mt-1">
                    Calculate charter costs and compare ownership economics.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', border: '1px solid #1c1c1c' }}>
                {[
                    { key: 'charter', label: 'CHARTER CALCULATOR' },
                    { key: 'ownership', label: 'CHARTER VS OWNERSHIP' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                            fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', letterSpacing: '0.1em',
                            transition: 'all 0.2s',
                            background: activeTab === tab.key ? '#D4AF37' : 'transparent',
                            color: activeTab === tab.key ? '#0a0a0a' : 'rgba(255,255,255,0.35)',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── CHARTER CALCULATOR TAB ── */}
            {activeTab === 'charter' && (
                <div className="space-y-4">

                    {/* Rate limit banner for free users */}
                    {!isPro && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '10px',
                            background: isLocked ? 'rgba(248,113,113,0.06)' : 'rgba(212,175,55,0.04)',
                            border: `1px solid ${isLocked ? 'rgba(248,113,113,0.2)' : 'rgba(212,175,55,0.15)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                        }}>
                            <div>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: isLocked ? '#f87171' : 'rgba(212,175,55,0.7)', letterSpacing: '0.08em' }}>
                                    {isLocked ? 'LIMIT REACHED' : `FREE TIER — ${FREE_LIMIT - limitStatus.count} OF ${FREE_LIMIT} CALCULATIONS REMAINING`}
                                </p>
                                {isLocked && countdown && (
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#f87171', lineHeight: 1, marginTop: '4px' }}>
                                        {countdown} <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>until reset</span>
                                    </p>
                                )}
                            </div>
                            {isLocked && (
                                <button
                                    onClick={() => navigate('/app/billing')}
                                    style={{ padding: '8px 16px', borderRadius: '8px', background: '#D4AF37', color: '#0a0a0a', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', border: 'none', cursor: 'pointer' }}
                                >
                                    UPGRADE TO PRO
                                </button>
                            )}
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="glass p-5 md:p-6 space-y-5" style={{ opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
                        <p className="section-label">ROUTE DETAILS</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p style={labelStyle}>FROM</p>
                                <select
                                    value={origin}
                                    onChange={e => setOrigin(e.target.value)}
                                    style={selectStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                                    onBlur={e => e.target.style.borderColor = '#1c1c1c'}
                                >
                                    <option value="" style={{ background: '#0a0a0a' }}>Select departure city</option>
                                    {AIRPORTS.filter(a => a.icao !== destination).map(a => (
                                        <option key={a.icao} value={a.icao} style={{ background: '#0a0a0a' }}>
                                            {a.city} ({a.icao}) — {a.country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p style={labelStyle}>TO</p>
                                <select
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                    style={selectStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                                    onBlur={e => e.target.style.borderColor = '#1c1c1c'}
                                >
                                    <option value="" style={{ background: '#0a0a0a' }}>Select arrival city</option>
                                    {AIRPORTS.filter(a => a.icao !== origin).map(a => (
                                        <option key={a.icao} value={a.icao} style={{ background: '#0a0a0a' }}>
                                            {a.city} ({a.icao}) — {a.country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p style={labelStyle}>PASSENGERS</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        onClick={() => setPax(p => Math.max(1, p - 1))}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1c1c1c', color: '#fff', fontSize: '18px', cursor: 'pointer', flexShrink: 0 }}
                                    >−</button>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#D4AF37', minWidth: '40px', textAlign: 'center' }}>{pax}</p>
                                    <button
                                        onClick={() => setPax(p => Math.min(19, p + 1))}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1c1c1c', color: '#fff', fontSize: '18px', cursor: 'pointer', flexShrink: 0 }}
                                    >+</button>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <p style={labelStyle}>AIRCRAFT CATEGORY</p>
                                    <button
                                        onClick={() => setAutoCategory(!autoCategory)}
                                        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: autoCategory ? '#D4AF37' : 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}
                                    >
                                        {autoCategory ? 'AUTO' : 'MANUAL'}
                                    </button>
                                </div>
                                <select
                                    value={categoryIndex}
                                    onChange={e => { setCategoryIndex(parseInt(e.target.value)); setAutoCategory(false) }}
                                    style={selectStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                                    onBlur={e => e.target.style.borderColor = '#1c1c1c'}
                                >
                                    {CATEGORIES.map((c, i) => (
                                        <option key={i} value={i} style={{ background: '#0a0a0a' }}>{c.label}</option>
                                    ))}
                                </select>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '6px' }}>{cat.examples}</p>
                            </div>
                        </div>

                        {(!origin || !destination) && (
                            <button
                                onClick={handleManualCalculate}
                                disabled={!origin || !destination}
                                style={{
                                    width: '100%', padding: '14px', background: '#D4AF37', color: '#0a0a0a',
                                    border: 'none', borderRadius: '10px', fontFamily: 'Bebas Neue, sans-serif',
                                    fontSize: '15px', letterSpacing: '0.15em', cursor: 'pointer', opacity: (!origin || !destination) ? 0.4 : 1,
                                }}
                            >
                                SELECT ORIGIN AND DESTINATION
                            </button>
                        )}

                        {origin && destination && !result && (
                            <button
                                onClick={handleManualCalculate}
                                style={{ width: '100%', padding: '14px', background: '#D4AF37', color: '#0a0a0a', border: 'none', borderRadius: '10px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.15em', cursor: 'pointer' }}
                            >
                                CALCULATE CHARTER COST
                            </button>
                        )}
                    </div>

                    {/* Locked overlay for free users who hit limit */}
                    {isLocked && (
                        <div style={{ padding: '32px', borderRadius: '14px', background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(248,113,113,0.15)', textAlign: 'center' }}>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#f87171', marginBottom: '8px' }}>DAILY LIMIT REACHED</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px', lineHeight: 1.7 }}>
                                You have used all {FREE_LIMIT} free calculations for this 24-hour window. Upgrade to Pro for unlimited access, or wait for the reset.
                            </p>
                            {countdown && (
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                                    Resets in <span style={{ color: '#f87171', fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px' }}>{countdown}</span>
                                </p>
                            )}
                            <button
                                onClick={() => navigate('/app/billing')}
                                style={{ padding: '12px 28px', borderRadius: '10px', background: '#D4AF37', color: '#0a0a0a', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', letterSpacing: '0.15em', border: 'none', cursor: 'pointer' }}
                            >
                                UPGRADE TO PRO
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {result && !isLocked && (
                        <div className="space-y-4">
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
                                    Estimates based on current charter market rates for {result.categoryLabel} category. Actual pricing varies by operator, routing, and availability. Always verify with operators before quoting.
                                </p>
                            </div>

                            {/* Client Framing */}
                            {isPro ? (
                                <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                    <p className="section-label mb-3">CLIENT FRAMING</p>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85 }}>{getClientFraming(result)}</p>
                                </div>
                            ) : (
                                <ProLock navigate={navigate} label="Client Framing shows you exactly how to present this number so the client understands the value — not the price.">
                                    <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                        <p className="section-label mb-3">CLIENT FRAMING</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85 }}>
                                            At approximately $X per seat — comparable to business class, but with full privacy and no connections — the conversation is not about price. It is about what the client is buying per dollar.
                                        </p>
                                    </div>
                                </ProLock>
                            )}

                            {/* Route Optimisation */}
                            {isPro ? (
                                <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                    <p className="section-label mb-3">ROUTE OPTIMISATION</p>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>{getRouteOptimisation(result)}</p>
                                </div>
                            ) : (
                                <ProLock navigate={navigate} label="Route Optimisation suggests the best aircraft category for this route and budget.">
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

                    <div style={{ padding: '16px', borderRadius: '10px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '6px' }}>HOW THIS WORKS</p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                            Estimates use great-circle distance plus 10% for reserves and routing deviations, multiplied by current market charter rate ranges for the selected aircraft category. Never quote these numbers to a client without confirming with an operator first. Use them to qualify the conversation, not close the deal.
                        </p>
                    </div>
                </div>
            )}

            {/* ── CHARTER VS OWNERSHIP TAB ── */}
            {activeTab === 'ownership' && (
                <div className="space-y-4">
                    <div className="glass p-5 md:p-6 space-y-5">
                        <p className="section-label">OWNERSHIP ECONOMICS</p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                            Adjust the sliders to model when ownership makes financial sense versus chartering. Use this to advise acquisition-minded clients.
                        </p>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <p style={labelStyle}>FLIGHT HOURS PER YEAR</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#D4AF37', lineHeight: 1 }}>{cvoHours} HRS</p>
                            </div>
                            <input
                                type="range"
                                min={50} max={600} step={10}
                                value={cvoHours}
                                onChange={e => setCvoHours(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>50 hrs</span>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>600 hrs</span>
                            </div>
                        </div>

                        <div>
                            <p style={labelStyle}>AIRCRAFT CATEGORY</p>
                            <select
                                value={cvoCategoryIndex}
                                onChange={e => setCvoCategoryIndex(parseInt(e.target.value))}
                                style={selectStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                                onBlur={e => e.target.style.borderColor = '#1c1c1c'}
                            >
                                {CATEGORIES.map((c, i) => (
                                    <option key={i} value={i} style={{ background: '#0a0a0a' }}>{c.label} — {c.examples}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {cvoResult && (
                        <div className="space-y-3">
                            {/* Winner banner */}
                            <div style={{
                                padding: '20px 24px', borderRadius: '14px',
                                background: cvoResult.charterWins ? 'rgba(30,58,138,0.15)' : 'rgba(212,175,55,0.06)',
                                border: `1px solid ${cvoResult.charterWins ? 'rgba(30,58,138,0.4)' : 'rgba(212,175,55,0.3)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                            }}>
                                <div>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        AT {cvoResult.hours} HRS/YEAR
                                    </p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: cvoResult.charterWins ? '#60a5fa' : '#D4AF37', lineHeight: 1 }}>
                                        {cvoResult.charterWins ? 'CHARTER WINS' : 'OWNERSHIP WINS'}
                                    </p>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                                        Saves approximately ${(cvoResult.saving / 1000).toFixed(0)}k per year
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginBottom: '2px' }}>BREAKEVEN POINT</p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#fff', lineHeight: 1 }}>{cvoResult.breakeven} HRS</p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>per year</p>
                                </div>
                            </div>

                            {/* Cost comparison */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: '8px' }}>ANNUAL CHARTER COST</p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', color: '#60a5fa', lineHeight: 1 }}>
                                        ${(cvoResult.annualCharterCost / 1000).toFixed(0)}k
                                    </p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '8px', lineHeight: 1.6 }}>
                                        {cvoResult.hours} hrs × market rate
                                    </p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
                                        No fixed costs · No crew · No hangar
                                    </p>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: '8px' }}>ANNUAL OWNERSHIP COST</p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', color: '#D4AF37', lineHeight: 1 }}>
                                        ${(cvoResult.annualOwnershipCost / 1000).toFixed(0)}k
                                    </p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '8px', lineHeight: 1.6 }}>
                                        Fixed: ${(CATEGORIES[cvoCategoryIndex].fixedAnnual / 1000).toFixed(0)}k
                                    </p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
                                        Variable: ${CATEGORIES[cvoCategoryIndex].variablePerHr.toLocaleString()}/hr × {cvoResult.hours} hrs
                                    </p>
                                </div>
                            </div>

                            {/* Ownership cost breakdown */}
                            <div style={{ padding: '20px', borderRadius: '12px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                <p className="section-label mb-3">OWNERSHIP COST BREAKDOWN</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Flight Crew', value: `$${Math.round(CATEGORIES[cvoCategoryIndex].fixedAnnual * 0.42 / 1000)}k` },
                                        { label: 'Maintenance', value: `$${Math.round(CATEGORIES[cvoCategoryIndex].fixedAnnual * 0.31 / 1000)}k` },
                                        { label: 'Hangar', value: `$${Math.round(CATEGORIES[cvoCategoryIndex].fixedAnnual * 0.09 / 1000)}k` },
                                        { label: 'Insurance', value: `$${Math.round(CATEGORIES[cvoCategoryIndex].fixedAnnual * 0.18 / 1000)}k` },
                                    ].map((item, i) => (
                                        <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label.toUpperCase()}</p>
                                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: 'rgba(255,255,255,0.6)' }}>{item.value}</p>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.15)', marginTop: '2px' }}>per year</p>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)', marginTop: '12px', lineHeight: 1.6 }}>
                                    Fixed cost estimates for {CATEGORIES[cvoCategoryIndex].label} category. Does not include aircraft acquisition, depreciation, or financing costs. Use as a directional guide only.
                                </p>
                            </div>

                            {/* Broker framing */}
                            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                <p className="section-label mb-3">HOW TO USE THIS WITH A CLIENT</p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
                                    {cvoResult.charterWins
                                        ? `At ${cvoResult.hours} flight hours per year, your client saves approximately $${(cvoResult.saving / 1000).toFixed(0)}k annually by chartering versus owning. The breakeven for a ${CATEGORIES[cvoCategoryIndex].label} is ${cvoResult.breakeven} hours per year — well above their current usage. Present charter as the financially disciplined choice, not the budget option.`
                                        : `At ${cvoResult.hours} hours per year, ownership starts to make financial sense for a ${CATEGORIES[cvoCategoryIndex].label}. The fixed cost is now spread across enough hours to bring the per-hour cost below charter rates. This is the point where an acquisition conversation becomes rational — and where your value as an advisor goes up significantly.`
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}