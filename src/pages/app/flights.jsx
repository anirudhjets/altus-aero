import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

/* Mock flight data — free users see previous day, pro users see live */
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

const STATUS_STYLE = {
    'En Route': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
    'Scheduled': { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)' },
    'Landed': { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
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

/* Simple SVG world map placeholder — React Leaflet would need the package installed */
function FlightMap({ flights, isPro }) {
    return (
        <div style={{
            width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #091223 100%)',
            border: '1px solid rgba(30,58,138,0.3)', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {/* Grid lines for map feel */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.15,
                backgroundImage: 'linear-gradient(rgba(30,58,138,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* Flight dots */}
            {flights.filter(f => f.status === 'En Route').map((f, i) => (
                <div key={f.id} style={{
                    position: 'absolute',
                    top: `${25 + (i * 18)}%`,
                    left: `${20 + (i * 15)}%`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#4ade80', boxShadow: '0 0 12px rgba(74,222,128,0.6)',
                        animation: 'pulse 2s infinite',
                    }} />
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                        {f.aircraft}
                    </p>
                </div>
            ))}

            {!isPro && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(4px)', gap: '8px',
                }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em' }}>PRO FEATURE</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                        Live interactive map with real-time aircraft positions
                    </p>
                </div>
            )}

            {isPro && (
                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4ade80', letterSpacing: '0.1em' }}>LIVE</span>
                    </div>
                </div>
            )}

            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
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
        const tick = () => {
            setTime(new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
            }).format(new Date()))
        }
        tick()
        const iv = setInterval(tick, 1000)
        return () => clearInterval(iv)
    }, [])

    const flights = isPro ? LIVE_FLIGHTS : PREV_DAY_FLIGHTS
    const categories = ['All', 'Ultra Long Range', 'Large Jet', 'Super Midsize', 'Light Jet']
    const filtered = filter === 'All' ? flights : flights.filter(f => f.category === filter)

    return (
        <div className="space-y-4 md:space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="section-label">FLIGHT INTELLIGENCE</p>
                    <h1 className="font-display text-3xl md:text-4xl text-white">TRACK</h1>
                    <p className="font-body text-gray-400 text-sm mt-1">
                        {isPro ? 'Live private aviation traffic — updated in real time.' : 'Previous day private aviation traffic — upgrade for live.'}
                    </p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                    borderRadius: '8px', alignSelf: 'flex-start', flexShrink: 0,
                    background: isPro ? 'rgba(74,222,128,0.08)' : 'rgba(212,175,55,0.08)',
                    border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(212,175,55,0.2)'}`,
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPro ? '#4ade80' : '#D4AF37', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: isPro ? '#4ade80' : '#D4AF37', letterSpacing: '0.1em' }}>
                        {isPro ? `LIVE · ${time} IST` : 'PREV DAY'}
                    </span>
                </div>
            </div>

            {/* Free tier prompt */}
            {!isPro && (
                <div style={{
                    padding: '12px 16px', borderRadius: '10px',
                    background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Showing {PREV_DAY_FLIGHTS.length} flights from yesterday. Pro shows {LIVE_FLIGHTS.length} live flights with interactive map.
                    </p>
                    <button onClick={() => navigate('/app/billing')} style={{
                        padding: '7px 14px', borderRadius: '7px', background: '#D4AF37', color: '#0a0a0a',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}>
                        GO PRO
                    </button>
                </div>
            )}

            {/* Map */}
            <div className="glass p-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p className="section-label">TRAFFIC MAP</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
                        {filtered.filter(f => f.status === 'En Route').length} AIRCRAFT EN ROUTE
                    </p>
                </div>
                <FlightMap flights={filtered} isPro={isPro} />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        style={{
                            padding: '6px 14px', borderRadius: '8px', whiteSpace: 'nowrap',
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.08em',
                            cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                            background: filter === c ? 'rgba(212,175,55,0.1)' : 'transparent',
                            borderColor: filter === c ? 'rgba(212,175,55,0.4)' : '#1c1c1c',
                            color: filter === c ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                        }}
                    >
                        {c.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Flight list */}
            <div className="space-y-2">
                <p className="section-label">ACTIVE FLIGHTS ({filtered.length})</p>
                {filtered.map((f) => {
                    const s = STATUS_STYLE[f.status]
                    return (
                        <div
                            key={f.id}
                            onClick={() => setSelected(selected?.id === f.id ? null : f)}
                            className="glass"
                            style={{
                                padding: '14px 16px', cursor: 'pointer',
                                borderColor: selected?.id === f.id ? 'rgba(212,175,55,0.3)' : undefined,
                                transition: 'all 0.15s',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#fff', letterSpacing: '0.04em' }}>
                                            {f.route}
                                        </p>
                                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                            {f.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                                        {f.aircraft} · {f.nm.toLocaleString()}nm · {f.dep} → {f.eta}
                                    </p>
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', transform: selected?.id === f.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                            </div>

                            {f.progress > 0 && f.progress < 100 && (
                                <div style={{ marginTop: '10px', height: '2px', background: '#1c1c1c', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: '#4ade80', width: `${f.progress}%`, borderRadius: '2px', transition: 'width 0.5s' }} />
                                </div>
                            )}

                            {selected?.id === f.id && (
                                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #1c1c1c' }}>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { label: 'Origin', value: f.origin },
                                            { label: 'Destination', value: f.dest },
                                            { label: 'Category', value: f.category },
                                            { label: 'Flight Progress', value: f.progress === 100 ? 'Complete' : f.progress === 0 ? 'Scheduled' : `${f.progress}%` },
                                        ].map((item, i) => (
                                            <div key={i} style={{ padding: '10px', borderRadius: '8px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label.toUpperCase()}</p>
                                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Route broker context — Pro only */}
                                    {isPro ? (
                                        <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.1em', marginBottom: '6px' }}>ROUTE CONTEXT</p>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                                                {f.nm > 4000
                                                    ? `${f.nm.toLocaleString()}nm — ultra-long-range routing. Only ULR aircraft qualify nonstop. Charter demand on this route is currently elevated.`
                                                    : f.nm > 2000
                                                        ? `${f.nm.toLocaleString()}nm — suitable for super midsize and above. Multiple aircraft options available, giving clients flexibility on cost versus cabin size.`
                                                        : `${f.nm.toLocaleString()}nm — regional route. Light jet or midsize is the practical recommendation. Midsize gives the cost-efficient option for 4-6 passengers.`
                                                }
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Pro feature — additional live flights teaser */}
            {!isPro && (
                <ProLock navigate={navigate} label={`${LIVE_FLIGHTS.length - PREV_DAY_FLIGHTS.length} more live flights visible on Pro, plus route context on every flight.`}>
                    <div className="glass p-4 space-y-2">
                        {LIVE_FLIGHTS.slice(4).map((f) => (
                            <div key={f.id} style={{ padding: '12px', borderRadius: '8px', background: '#0d0d0d', border: '1px solid #1c1c1c' }}>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#fff' }}>{f.route}</p>
                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{f.aircraft}</p>
                            </div>
                        ))}
                    </div>
                </ProLock>
            )}
        </div>
    )
}
