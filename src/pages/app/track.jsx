import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }

const LIVE_FLIGHTS = [
    { id: 'PVT001', route: 'VABB → EGLL', origin: 'Mumbai', dest: 'London Heathrow', aircraft: 'G650ER', dep: '06:15 IST', eta: '11:30 GMT', status: 'En Route', progress: 72, category: 'Ultra Long Range', nm: 4387 },
    { id: 'PVT002', route: 'VABB → OMDB', origin: 'Mumbai', dest: 'Dubai', aircraft: 'Global 7500', dep: '07:40 IST', eta: '09:45 GST', status: 'En Route', progress: 88, category: 'Ultra Long Range', nm: 1193 },
    { id: 'PVT003', route: 'VABB → YSSY', origin: 'Mumbai', dest: 'Sydney', aircraft: 'G700', dep: '22:00 IST', eta: '14:20 AEDT+1', status: 'Scheduled', progress: 0, category: 'Ultra Long Range', nm: 6097 },
    { id: 'PVT004', route: 'VIDP → VABB', origin: 'Delhi', dest: 'Mumbai', aircraft: 'Phenom 300E', dep: '05:00 IST', eta: '06:30 IST', status: 'Landed', progress: 100, category: 'Light Jet', nm: 699 },
    { id: 'PVT005', route: 'VABB → LFPG', origin: 'Mumbai', dest: 'Paris CDG', aircraft: 'Falcon 7X', dep: '13:00 IST', eta: '17:30 CET', status: 'En Route', progress: 44, category: 'Large Jet', nm: 4238 },
    { id: 'PVT006', route: 'VOBL → OMDB', origin: 'Bangalore', dest: 'Dubai', aircraft: 'Challenger 350', dep: '08:30 IST', eta: '11:00 GST', status: 'En Route', progress: 61, category: 'Super Midsize', nm: 1800 },
    { id: 'PVT007', route: 'VOMM → WSSS', origin: 'Chennai', dest: 'Singapore', aircraft: 'Citation Latitude', dep: '10:15 IST', eta: '16:45 SGT', status: 'Scheduled', progress: 0, category: 'Super Midsize', nm: 1700 },
    { id: 'PVT008', route: 'VABB → KJFK', origin: 'Mumbai', dest: 'New York JFK', aircraft: 'G700', dep: '03:30 IST', eta: '12:00 EST', status: 'En Route', progress: 38, category: 'Ultra Long Range', nm: 7796 },
]

const PREV_DAY_FLIGHTS = LIVE_FLIGHTS.slice(0, 4)

const STATUS = {
    'En Route': { color: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)' },
    'Scheduled': { color: '#0ABFBC', bg: 'rgba(10,191,188,0.06)', border: 'rgba(10,191,188,0.2)' },
    'Landed': { color: '#444', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' },
}

function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>{children}</div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(2px)', gap: '10px', padding: '16px' }}>
                <span style={{ ...MONO, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em' }}>PRO FEATURE</span>
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#555', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>{label}</p>}
                <button onClick={() => navigate('/app/billing')} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 20px', background: '#0ABFBC', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer' }}>
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

function FlightMap({ flights, isPro }) {
    return (
        <div style={{
            width: '100%', height: '240px', background: 'linear-gradient(135deg, #080e1a 0%, #0d1a2e 100%)',
            border: '1px solid rgba(10,60,58,0.2)', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(10,60,58,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(10,60,58,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            {flights.filter(f => f.status === 'En Route').map((f, i) => (
                <div key={f.id} style={{ position: 'absolute', top: `${20 + i * 20}%`, left: `${15 + i * 14}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px rgba(74,222,128,0.5)' }} />
                    <p style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{f.aircraft}</p>
                </div>
            ))}
            {!isPro && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(4px)', gap: '8px' }}>
                    <p style={{ ...MONO, fontSize: '9px', color: '#0ABFBC', letterSpacing: '0.2em' }}>PRO FEATURE</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#444', textAlign: 'center' }}>Live interactive map with real-time aircraft positions</p>
                </div>
            )}
            {isPro && (
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.06)', borderRadius: '9999px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ ...MONO, fontSize: '8px', color: '#4ade80', letterSpacing: '0.12em' }}>LIVE</span>
                </div>
            )}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        </div>
    )
}

export default function Track() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()
    const [filter, setFilter] = useState('All')
    const [selected, setSelected] = useState(null)
    const [time, setTime] = useState('')

    useEffect(() => {
        const tick = () => setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()))
        tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv)
    }, [])

    const flights = isPro ? LIVE_FLIGHTS : PREV_DAY_FLIGHTS
    const categories = ['All', 'Ultra Long Range', 'Large Jet', 'Super Midsize', 'Light Jet']
    const filtered = filter === 'All' ? flights : flights.filter(f => f.category === filter)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <p style={EYEBROW}>Flight Intelligence</p>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginTop: '6px' }}>TRACK</h1>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', marginTop: '6px' }}>
                        {isPro ? 'Live private aviation traffic — updated in real time.' : 'Previous day private aviation traffic — upgrade for live.'}
                    </p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', alignSelf: 'flex-start', flexShrink: 0,
                    background: isPro ? 'rgba(74,222,128,0.06)' : 'rgba(10,191,188,0.06)',
                    border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(10,191,188,0.2)'}`,
                    borderRadius: '9999px',
                }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isPro ? '#4ade80' : '#0ABFBC', flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ ...MONO, fontSize: '9px', color: isPro ? '#4ade80' : '#0ABFBC', letterSpacing: '0.12em' }}>
                        {isPro ? `LIVE · ${time} IST` : 'PREV DAY'}
                    </span>
                </div>
            </div>

            {/* Free tier prompt */}
            {!isPro && (
                <div style={{ padding: '14px 20px', border: '1px solid rgba(10,191,188,0.15)', background: 'rgba(10,191,188,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555' }}>
                        Showing {PREV_DAY_FLIGHTS.length} flights from yesterday. Pro shows {LIVE_FLIGHTS.length} live flights with interactive map.
                    </p>
                    <button onClick={() => navigate('/app/billing')} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 16px', background: '#0ABFBC', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer', flexShrink: 0 }}>
                        GO PRO
                    </button>
                </div>
            )}

            {/* Map */}
            <div style={{ border: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0a' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={EYEBROW}>Traffic Map</p>
                    <p style={{ ...MONO, fontSize: '9px', color: '#333' }}>{filtered.filter(f => f.status === 'En Route').length} AIRCRAFT EN ROUTE</p>
                </div>
                <FlightMap flights={filtered} isPro={isPro} />
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        style={{
                            ...MONO, fontSize: '9px', letterSpacing: '0.12em', padding: '7px 14px', whiteSpace: 'nowrap',
                            cursor: 'pointer', transition: 'all 0.15s', border: '1px solid', borderRadius: '9999px',
                            background: filter === c ? 'rgba(10,191,188,0.06)' : 'transparent',
                            borderColor: filter === c ? 'rgba(10,191,188,0.3)' : 'rgba(255,255,255,0.08)',
                            color: filter === c ? '#0ABFBC' : '#444',
                        }}
                    >
                        {c.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Flight list */}
            <div>
                <p style={{ ...EYEBROW, marginBottom: '12px' }}>Active Flights ({filtered.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                    {filtered.map(f => {
                        const s = STATUS[f.status] || STATUS['Landed']
                        return (
                            <div
                                key={f.id}
                                onClick={() => setSelected(selected?.id === f.id ? null : f)}
                                style={{ background: '#0a0a0a', padding: '18px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>{f.route}</p>
                                            <span style={{ ...MONO, fontSize: '8px', letterSpacing: '0.1em', padding: '2px 8px', border: `1px solid ${s.border}`, color: s.color, background: s.bg, borderRadius: '9999px', flexShrink: 0 }}>
                                                {f.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ ...MONO, fontSize: '10px', color: '#444' }}>{f.aircraft} · {f.nm.toLocaleString()}nm · {f.dep} → {f.eta}</p>
                                    </div>
                                    <span style={{ color: '#333', fontSize: '10px', transform: selected?.id === f.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                                </div>

                                {f.progress > 0 && f.progress < 100 && (
                                    <div style={{ marginTop: '10px', height: '1px', background: 'rgba(255,255,255,0.06)' }}>
                                        <div style={{ height: '1px', background: '#4ade80', width: `${f.progress}%`, transition: 'width 0.5s' }} />
                                    </div>
                                )}

                                {selected?.id === f.id && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)' }} className="grid grid-cols-2 sm:grid-cols-4">
                                            {[
                                                { label: 'Origin', value: f.origin },
                                                { label: 'Destination', value: f.dest },
                                                { label: 'Category', value: f.category },
                                                { label: 'Progress', value: f.progress === 100 ? 'Complete' : f.progress === 0 ? 'Scheduled' : `${f.progress}%` },
                                            ].map((item, i) => (
                                                <div key={i} style={{ padding: '14px', background: '#0a0a0a' }}>
                                                    <p style={{ ...EYEBROW, marginBottom: '6px' }}>{item.label}</p>
                                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {isPro && (
                                            <div style={{ marginTop: '1px', padding: '16px 18px', border: '1px solid rgba(10,191,188,0.12)', background: 'rgba(10,191,188,0.02)' }}>
                                                <p style={{ ...EYEBROW, color: '#0ABFBC', marginBottom: '8px' }}>Route Context</p>
                                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.75 }}>
                                                    {f.nm > 4000
                                                        ? `${f.nm.toLocaleString()}nm — ultra-long-range routing. Only ULR aircraft qualify nonstop. Charter demand on this route is currently elevated.`
                                                        : f.nm > 2000
                                                            ? `${f.nm.toLocaleString()}nm — suitable for super midsize and above. Multiple aircraft options available, giving clients flexibility on cost versus cabin size.`
                                                            : `${f.nm.toLocaleString()}nm — regional route. Light jet or midsize is the practical recommendation. Midsize gives the cost-efficient option for 4-6 passengers.`
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Pro teaser */}
            {!isPro && (
                <ProLock navigate={navigate} label={`${LIVE_FLIGHTS.length - PREV_DAY_FLIGHTS.length} more live flights visible on Pro, plus route context on every flight.`}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0a' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                            {LIVE_FLIGHTS.slice(4).map(f => (
                                <div key={f.id} style={{ padding: '16px 20px', background: '#0a0a0a' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#ffffff', letterSpacing: '0.03em' }}>{f.route}</p>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '3px' }}>{f.aircraft}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ProLock>
            )}
        </div>
    )
}