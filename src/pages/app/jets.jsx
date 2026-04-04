import { useState, Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const fleet = [
    { id: 1, model: 'G650ER', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 7500, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 53.6, cabin_height_ft: 6.3, baggage_cuft: 195, hourly_rate_usd: 12000, purchase_price_usd: 75000000, color: '#0d1b3e', broker_insight: 'The default answer for Mumbai HNWI clients wanting London or New York nonstop. If they say I want a Gulfstream — this is what they mean. VABB to EGLL nonstop with full passengers and bags.' },
    { id: 2, model: 'G700', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 7750, passengers: 19, cruise_speed_kts: 526, cabin_length_ft: 56.2, cabin_height_ft: 6.3, baggage_cuft: 207, hourly_rate_usd: 14000, purchase_price_usd: 90000000, color: '#1e3a8a', broker_insight: 'Newer, larger, slightly faster than the G650ER. 20% more cabin volume. If a client already owns a G650 and wants an upgrade conversation, start here. The stateroom option closes deals.' },
    { id: 3, model: 'G800', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 8000, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 56.2, cabin_height_ft: 6.3, baggage_cuft: 207, hourly_rate_usd: 15000, purchase_price_usd: 95000000, color: '#0a1628', broker_insight: 'Longest range Gulfstream ever built. Singapore to New York nonstop. Lead with the range when clients ask about ultra-long-range options.' },
    { id: 4, model: 'Global 7500', manufacturer: 'Bombardier', category: 'Ultra Long Range', range_nm: 7700, passengers: 19, cruise_speed_kts: 516, cabin_length_ft: 54.5, cabin_height_ft: 6.2, baggage_cuft: 195, hourly_rate_usd: 13500, purchase_price_usd: 85000000, color: '#0f3460', broker_insight: 'The range leader. VABB to KLAX nonstop — no other production jet does this reliably. Four living spaces including a permanent bedroom. Lead with the range fact and the bedroom.' },
    { id: 5, model: 'Global 6500', manufacturer: 'Bombardier', category: 'Super Long Range', range_nm: 6600, passengers: 17, cruise_speed_kts: 513, cabin_length_ft: 48.4, cabin_height_ft: 6.2, baggage_cuft: 195, hourly_rate_usd: 11000, purchase_price_usd: 55000000, color: '#1a3a6c', broker_insight: 'Best value Bombardier. Mumbai to London with ease. Clients who cannot justify the Global 7500 price find this a natural step down without losing much range.' },
    { id: 6, model: 'Falcon 8X', manufacturer: 'Dassault', category: 'Ultra Long Range', range_nm: 6450, passengers: 16, cruise_speed_kts: 482, cabin_length_ft: 43.1, cabin_height_ft: 6.2, baggage_cuft: 140, hourly_rate_usd: 11500, purchase_price_usd: 58000000, color: '#2a4a8a', broker_insight: 'Three engines means access to airports others cannot use. High altitude airstrips in Asia and Africa. Clients who need flexibility in their destinations should know this first.' },
    { id: 7, model: 'Falcon 7X', manufacturer: 'Dassault', category: 'Long Range', range_nm: 5950, passengers: 16, cruise_speed_kts: 482, cabin_length_ft: 39.1, cabin_height_ft: 6.2, baggage_cuft: 140, hourly_rate_usd: 10500, purchase_price_usd: 55000000, color: '#2d4a7a', broker_insight: 'The European choice. Three engines means a different insurance profile and access to airports others cannot use. Clients who have flown NetJets Europe often prefer this.' },
    { id: 8, model: 'Challenger 350', manufacturer: 'Bombardier', category: 'Super Midsize', range_nm: 3200, passengers: 10, cruise_speed_kts: 466, cabin_length_ft: 24.0, cabin_height_ft: 6.1, baggage_cuft: 106, hourly_rate_usd: 5500, purchase_price_usd: 27000000, color: '#1e4a6a', broker_insight: 'Most sold business jet in the world. Mumbai to Dubai to Delhi routes. If a client is flying regionally and wants value — this is the answer every time.' },
    { id: 9, model: 'Challenger 650', manufacturer: 'Bombardier', category: 'Large Cabin', range_nm: 4000, passengers: 12, cruise_speed_kts: 459, cabin_length_ft: 28.6, cabin_height_ft: 6.1, baggage_cuft: 115, hourly_rate_usd: 7000, purchase_price_usd: 32000000, color: '#1a3a5c', broker_insight: 'Best large cabin value in the market. Excellent for regional Asia routes where cabin space matters but ultra-long range is not needed.' },
    { id: 10, model: 'Citation Longitude', manufacturer: 'Cessna', category: 'Super Midsize', range_nm: 3500, passengers: 12, cruise_speed_kts: 476, cabin_length_ft: 25.2, cabin_height_ft: 6.0, baggage_cuft: 127, hourly_rate_usd: 5800, purchase_price_usd: 26000000, color: '#2a3a5a', broker_insight: 'Quietest cabin in the super midsize category. Clients who value comfort over range find this compelling. First class experience at midsize pricing.' },
    { id: 11, model: 'Praetor 600', manufacturer: 'Embraer', category: 'Super Midsize', range_nm: 4018, passengers: 12, cruise_speed_kts: 466, cabin_length_ft: 27.3, cabin_height_ft: 6.0, baggage_cuft: 114, hourly_rate_usd: 6200, purchase_price_usd: 21000000, color: '#1e3050', broker_insight: 'Best range in the super midsize class. Mumbai to Riyadh nonstop easily. Exceptional value proposition — lead with the range-to-cost ratio.' },
    { id: 12, model: 'Phenom 300E', manufacturer: 'Embraer', category: 'Light Jet', range_nm: 2010, passengers: 10, cruise_speed_kts: 453, cabin_length_ft: 17.2, cabin_height_ft: 4.9, baggage_cuft: 84, hourly_rate_usd: 4500, purchase_price_usd: 10500000, color: '#1a3a5c', broker_insight: 'Best entry level jet for new private flyers. Regional India routes — Mumbai to Delhi, Bangalore, Goa. First time ownership conversation starter. Lowest operating cost in its class.' },
    { id: 13, model: 'Citation CJ4', manufacturer: 'Cessna', category: 'Light Jet', range_nm: 2165, passengers: 9, cruise_speed_kts: 451, cabin_length_ft: 17.3, cabin_height_ft: 4.8, baggage_cuft: 77, hourly_rate_usd: 3800, purchase_price_usd: 9000000, color: '#162a4a', broker_insight: 'Popular entry light jet for short regional hops. Easy to operate and maintain. Good first ownership conversation for clients flying under 2 hours regularly.' },
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

function JetModel3D() {
    const groupRef = useRef()
    const { scene } = useGLTF('/models/jet.glb')

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene)
            const center = box.getCenter(new THREE.Vector3())
            scene.position.set(-center.x, -center.y, -center.z)
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: '#dce8f5',
                        metalness: 0.92,
                        roughness: 0.08,
                    })
                }
            })
        }
    }, [scene])

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    return (
        <group ref={groupRef} scale={0.28}>
            <primitive object={scene} />
        </group>
    )
}

function CockpitViewer() {
    return (
        <Canvas
            camera={{ position: [0, 1, 4], fov: 50 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4, alpha: true }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.8} color="#ffffff" />
                <directionalLight position={[10, 10, 5]} color="#ffffff" intensity={4} />
                <directionalLight position={[-8, 4, -5]} color="#D4AF37" intensity={2} />
                <pointLight position={[0, 5, 8]} color="#b0c4ff" intensity={2} distance={25} />
                <JetModel3D />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Suspense>
        </Canvas>
    )
}

export default function Jets() {
    const [selected, setSelected] = useState(fleet[0])
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('ALL')
    const [compareList, setCompareList] = useState([])
    const [showCompare, setShowCompare] = useState(false)
    const { plan } = useAuth()
    const navigate = useNavigate()
    const isPro = plan === 'pro'

    const categories = ['ALL', 'Ultra Long Range', 'Super Long Range', 'Long Range', 'Large Cabin', 'Super Midsize', 'Light Jet']

    const filtered = fleet.filter(j => {
        const matchSearch = j.model.toLowerCase().includes(search.toLowerCase()) || j.manufacturer.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'ALL' || j.category === category
        return matchSearch && matchCat
    })

    const toggleCompare = (jet) => {
        if (!isPro) return
        setCompareList(prev => {
            const exists = prev.find(j => j.id === jet.id)
            if (exists) return prev.filter(j => j.id !== jet.id)
            if (prev.length >= 3) return prev
            return [...prev, jet]
        })
    }

    const inCompare = (jet) => compareList.some(j => j.id === jet.id)

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="section-label text-xs sm:text-sm">FLEET INTELLIGENCE</p>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">FLEET</h1>
                    <p className="font-body text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl">
                        A broker who cannot explain the difference between a G650 and a Global 7500 loses the client to someone who can.
                    </p>
                </div>
                {isPro && compareList.length > 0 && (
                    <button
                        onClick={() => setShowCompare(true)}
                        className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg font-display text-sm tracking-wider transition-all"
                        style={{ background: '#D4AF37', color: '#0a0a0a' }}
                    >
                        COMPARE ({compareList.length}/3)
                    </button>
                )}
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

            {/* Pro compare hint for free users */}
            {!isPro && (
                <div className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-xl p-4 flex items-center justify-between gap-4">
                    <p className="font-body text-sm text-white/60">Side-by-side aircraft comparison and 3D cockpit view are available on Pro.</p>
                    <button
                        onClick={() => navigate('/app/billing')}
                        className="font-display text-sm px-4 py-2 rounded-lg flex-shrink-0 transition-colors"
                        style={{ background: '#D4AF37', color: '#0a0a0a' }}
                    >
                        Upgrade to Pro
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">

                {/* Left — Detail */}
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

                    {/* 3D Cockpit View */}
                    {isPro ? (
                        <div className="glass p-4 sm:p-5">
                            <p className="section-label mb-3">3D AIRCRAFT VIEW</p>
                            <div className="rounded-xl overflow-hidden border border-[#1c1c1c]" style={{ height: '220px' }}>
                                <CockpitViewer />
                            </div>
                            <p className="font-mono text-xs text-gray-600 mt-2 text-center">
                                Drag to rotate · {selected.model}
                            </p>
                        </div>
                    ) : (
                        <div className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-xl p-6 text-center">
                            <p className="font-mono text-xs text-gold mb-1 tracking-widest">3D AIRCRAFT VIEW</p>
                            <p className="text-white/60 text-sm mb-3">Interactive 3D view available on Pro</p>
                            <button
                                onClick={() => navigate('/app/billing')}
                                className="font-display text-sm px-5 py-2 rounded-lg transition-colors"
                                style={{ background: '#D4AF37', color: '#0a0a0a' }}
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    )}

                    {/* Broker Insight */}
                    {isPro ? (
                        <div className="glass-gold p-4 sm:p-5">
                            <p className="section-label mb-2">BROKER INSIGHT</p>
                            <p className="font-body text-sm sm:text-base text-white leading-relaxed">{selected.broker_insight}</p>
                        </div>
                    ) : (
                        <div className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-xl p-6 text-center">
                            <p className="font-mono text-xs text-gold mb-1 tracking-widest">BROKER INSIGHT</p>
                            <p className="text-white/60 text-sm mb-3">Sales positioning and client objection handling — available on Pro</p>
                            <button
                                onClick={() => navigate('/app/billing')}
                                className="font-display text-sm px-5 py-2 rounded-lg transition-colors"
                                style={{ background: '#D4AF37', color: '#0a0a0a' }}
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    )}
                </div>

                {/* Right — Fleet List */}
                <div className="glass p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <p className="section-label">SELECT AIRCRAFT ({filtered.length})</p>
                        {isPro && (
                            <p className="font-mono text-xs text-gray-500">
                                {compareList.length === 0 ? 'Tap + to compare' : `${compareList.length}/3 selected`}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2 sm:space-y-3 max-h-[600px] sm:max-h-[800px] overflow-y-auto pr-1">
                        {filtered.map((jet) => (
                            <div
                                key={jet.id}
                                className={`rounded-xl border transition-all ${selected.id === jet.id ? 'border-gold bg-gold/5' : 'border-[#1c1c1c] hover:border-gulf'}`}
                            >
                                <button
                                    onClick={() => setSelected(jet)}
                                    className="w-full text-left p-3 sm:p-4"
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
                                            <div className="flex items-center gap-3 sm:gap-4">
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

                                {/* Compare toggle — Pro only */}
                                {isPro && (
                                    <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-[#1c1c1c]">
                                        <button
                                            onClick={() => toggleCompare(jet)}
                                            className={`font-mono text-xs px-3 py-1 rounded-lg border transition-all ${inCompare(jet)
                                                    ? 'border-gold text-gold bg-gold/10'
                                                    : compareList.length >= 3 && !inCompare(jet)
                                                        ? 'border-[#1c1c1c] text-gray-600 cursor-not-allowed'
                                                        : 'border-[#2a2a2a] text-gray-500 hover:border-gold/40 hover:text-gold'
                                                }`}
                                            disabled={compareList.length >= 3 && !inCompare(jet)}
                                        >
                                            {inCompare(jet) ? '✓ In compare' : '+ Compare'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Compare Panel — full width overlay */}
            {showCompare && isPro && compareList.length >= 2 && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
                    <div
                        className="w-full max-w-5xl rounded-2xl border border-[#1c1c1c] overflow-hidden"
                        style={{ background: '#0d0d0d', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c] sticky top-0" style={{ background: '#0d0d0d' }}>
                            <p className="font-display text-xl text-white">COMPARE AIRCRAFT</p>
                            <button onClick={() => setShowCompare(false)} className="text-gray-400 hover:text-white text-xl transition-colors">✕</button>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <td className="font-mono text-xs text-gray-600 pb-4 pr-6 w-32">SPEC</td>
                                        {compareList.map(jet => (
                                            <td key={jet.id} className="pb-4 pr-6 text-center">
                                                <div
                                                    className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                                                    style={{ background: jet.color }}
                                                >
                                                    <span className="text-white text-sm">✈</span>
                                                </div>
                                                <p className="font-display text-lg text-white">{jet.model}</p>
                                                <p className="font-mono text-xs text-gold">{jet.manufacturer}</p>
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {specs.map((s, i) => {
                                        const values = compareList.map(j => j[s.key])
                                        const best = s.key === 'purchase_price_usd' || s.key === 'hourly_rate_usd'
                                            ? Math.min(...values)
                                            : Math.max(...values)
                                        return (
                                            <tr key={i} className="border-t border-[#1c1c1c]">
                                                <td className="py-3 pr-6 font-mono text-xs text-gray-500">{s.label}</td>
                                                {compareList.map(jet => {
                                                    const val = jet[s.key]
                                                    const isBest = val === best
                                                    return (
                                                        <td key={jet.id} className="py-3 pr-6 text-center">
                                                            <span
                                                                className="font-display text-base"
                                                                style={{ color: isBest ? '#D4AF37' : 'rgba(255,255,255,0.6)' }}
                                                            >
                                                                {s.format(val)}
                                                                <span className="text-xs ml-1 font-mono" style={{ color: isBest ? '#D4AF37' : '#4b5563' }}>{s.unit}</span>
                                                            </span>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                    <tr className="border-t border-[#1c1c1c]">
                                        <td className="py-3 pr-6 font-mono text-xs text-gray-500">Broker Insight</td>
                                        {compareList.map(jet => (
                                            <td key={jet.id} className="py-3 pr-6 align-top">
                                                <p className="font-body text-xs text-gray-400 leading-relaxed">{jet.broker_insight}</p>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-[#1c1c1c] flex items-center justify-between" style={{ background: '#111111' }}>
                            <p className="font-mono text-xs text-gray-600">Gold = best value in each category</p>
                            <button
                                onClick={() => { setCompareList([]); setShowCompare(false) }}
                                className="font-mono text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Clear compare
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}