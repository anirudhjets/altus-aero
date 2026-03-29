import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const airports = [
    { code: 'VABB', name: 'Mumbai', city: 'Mumbai, India', lat: 19.0896, lng: 72.8656 },
    { code: 'VIDP', name: 'Delhi', city: 'Delhi, India', lat: 28.5562, lng: 77.1000 },
    { code: 'VOBL', name: 'Bangalore', city: 'Bangalore, India', lat: 13.1986, lng: 77.7066 },
    { code: 'VOGO', name: 'Goa', city: 'Goa, India', lat: 15.3808, lng: 73.8314 },
    { code: 'EGLL', name: 'London Heathrow', city: 'London, UK', lat: 51.4775, lng: -0.4614 },
    { code: 'LFPB', name: 'Le Bourget', city: 'Paris, France', lat: 48.9694, lng: 2.4414 },
    { code: 'OMDB', name: 'Dubai', city: 'Dubai, UAE', lat: 25.2528, lng: 55.3644 },
    { code: 'OMAA', name: 'Abu Dhabi', city: 'Abu Dhabi, UAE', lat: 24.4330, lng: 54.6511 },
    { code: 'KLAX', name: 'Los Angeles', city: 'Los Angeles, USA', lat: 33.9425, lng: -118.4081 },
    { code: 'KJFK', name: 'New York JFK', city: 'New York, USA', lat: 40.6413, lng: -73.7781 },
    { code: 'YSSY', name: 'Sydney', city: 'Sydney, Australia', lat: -33.9461, lng: 151.1772 },
    { code: 'RJTT', name: 'Tokyo Haneda', city: 'Tokyo, Japan', lat: 35.5494, lng: 139.7798 },
]

const aircraft = [
    { model: 'G650ER', manufacturer: 'Gulfstream', range_nm: 7500, speed_kts: 516, pax: 19, hourly: 12000, purchase: 75 },
    { model: 'G700', manufacturer: 'Gulfstream', range_nm: 7750, speed_kts: 526, pax: 19, hourly: 14000, purchase: 90 },
    { model: 'G800', manufacturer: 'Gulfstream', range_nm: 8000, speed_kts: 516, pax: 19, hourly: 15000, purchase: 95 },
    { model: 'Global 7500', manufacturer: 'Bombardier', range_nm: 7700, speed_kts: 516, pax: 19, hourly: 13500, purchase: 85 },
    { model: 'Falcon 7X', manufacturer: 'Dassault', range_nm: 5950, speed_kts: 482, pax: 16, hourly: 10500, purchase: 55 },
    { model: 'Phenom 300E', manufacturer: 'Embraer', range_nm: 2010, speed_kts: 453, pax: 10, hourly: 4500, purchase: 10.5 },
]

function toRad(deg) { return deg * Math.PI / 180 }

function getDistanceNm(lat1, lng1, lat2, lng2) {
    const R = 3440.065
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getGreatCirclePoints(lat1, lng1, lat2, lng2, n = 80) {
    const points = []
    for (let i = 0; i <= n; i++) {
        const f = i / n
        const d = toRad(getDistanceNm(lat1, lng1, lat2, lng2) / 3440.065 * 180 / Math.PI)
        if (d === 0) { points.push([lat1, lng1]); continue }
        const A = Math.sin((1 - f) * d) / Math.sin(d)
        const B = Math.sin(f * d) / Math.sin(d)
        const x = A * Math.cos(toRad(lat1)) * Math.cos(toRad(lng1)) + B * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2))
        const y = A * Math.cos(toRad(lat1)) * Math.sin(toRad(lng1)) + B * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2))
        const z = A * Math.sin(toRad(lat1)) + B * Math.sin(toRad(lat2))
        points.push([
            Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180 / Math.PI,
            Math.atan2(y, x) * 180 / Math.PI
        ])
    }
    return points
}

function MapUpdater({ from, to }) {
    const map = useMap()
    useEffect(() => {
        if (from && to) {
            const bounds = L.latLngBounds([
                [from.lat, from.lng],
                [to.lat, to.lng]
            ])
            map.fitBounds(bounds, { padding: [60, 60] })
        } else if (from) {
            map.setView([from.lat, from.lng], 5)
        }
    }, [from, to, map])
    return null
}

export default function Mission() {
    const [from, setFrom] = useState(airports[0])
    const [to, setTo] = useState(airports[4])
    const [selectedAircraft, setSelectedAircraft] = useState(aircraft[0])
    const [hours, setHours] = useState(200)
    const [passengers, setPassengers] = useState(4)

    const distance = from && to ? Math.round(getDistanceNm(from.lat, from.lng, to.lat, to.lng)) : 0
    const flightTime = selectedAircraft ? (distance / selectedAircraft.speed_kts).toFixed(1) : 0
    const nonstop = selectedAircraft ? distance <= selectedAircraft.range_nm : false

    const fuelCost = Math.round(distance * 8.5)
    const landingFee = 2200
    const handlingFee = 1800
    const overflightPermits = distance > 2000 ? 3500 : 1200
    const crewExpenses = parseFloat(flightTime) > 8 ? 6000 : 4000
    const totalTripCost = fuelCost + landingFee + handlingFee + overflightPermits + crewExpenses

    const annualCharterCost = hours * selectedAircraft.hourly
    const annualOwnershipCost = Math.round(selectedAircraft.purchase * 1000000 * 0.12 + 800000)
    const breakevenHours = Math.round(annualOwnershipCost / selectedAircraft.hourly)
    const recommendation = hours >= breakevenHours ? 'ownership' : 'charter'

    const routePoints = from && to ? getGreatCirclePoints(from.lat, from.lng, to.lat, to.lng) : []

    const darkMapStyle = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    return (
        <div className="space-y-6">
            <div>
                <p className="section-label">MISSION PLANNING CENTER</p>
                <h1 className="font-display text-4xl text-white">PLAN MISSION</h1>
                <p className="font-body text-gray-400 mt-2">
                    Plan every detail before the client asks. Route, aircraft, cost — all in one place.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left — Controls */}
                <div className="space-y-4">
                    {/* Route Selection */}
                    <div className="glass p-5">
                        <p className="section-label mb-4">ROUTE</p>
                        <div className="space-y-3">
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">DEPARTURE</p>
                                <select
                                    value={from.code}
                                    onChange={e => setFrom(airports.find(a => a.code === e.target.value))}
                                    className="w-full bg-[#0d0d0d] border border-[#1c1c1c] rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-gold focus:outline-none"
                                >
                                    {airports.map(a => (
                                        <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="h-px flex-1 bg-[#1c1c1c]" />
                                <span className="font-mono text-xs text-gold mx-3">→</span>
                                <div className="h-px flex-1 bg-[#1c1c1c]" />
                            </div>
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">DESTINATION</p>
                                <select
                                    value={to.code}
                                    onChange={e => setTo(airports.find(a => a.code === e.target.value))}
                                    className="w-full bg-[#0d0d0d] border border-[#1c1c1c] rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-gold focus:outline-none"
                                >
                                    {airports.map(a => (
                                        <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Route Stats */}
                        {from && to && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Distance</p>
                                    <p className="font-display text-lg text-white">{distance.toLocaleString()}<span className="text-xs text-gray-500 ml-1">nm</span></p>
                                </div>
                                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Flight Time</p>
                                    <p className="font-display text-lg text-white">{flightTime}<span className="text-xs text-gray-500 ml-1">hrs</span></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Aircraft Selection */}
                    <div className="glass p-5">
                        <p className="section-label mb-4">AIRCRAFT</p>
                        <div className="space-y-2">
                            {aircraft.map((ac, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedAircraft(ac)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedAircraft.model === ac.model
                                            ? 'border-gold bg-gold/5'
                                            : 'border-[#1c1c1c] hover:border-gulf'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-display text-sm text-white">{ac.model}</p>
                                            <p className="font-mono text-xs text-gray-500">{ac.manufacturer} · {ac.range_nm.toLocaleString()}nm</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-xs text-gold">${ac.hourly.toLocaleString()}/hr</p>
                                            <p className="font-mono text-xs text-gray-600">{ac.pax} pax</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mission Parameters */}
                    <div className="glass p-5">
                        <p className="section-label mb-4">PARAMETERS</p>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-mono text-xs text-gray-500">Annual Hours</p>
                                    <p className="font-mono text-xs text-gold">{hours} hrs</p>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="600"
                                    step="10"
                                    value={hours}
                                    onChange={e => setHours(parseInt(e.target.value))}
                                    className="w-full accent-gold"
                                />
                                <div className="flex justify-between mt-1">
                                    <span className="font-mono text-xs text-gray-600">50</span>
                                    <span className="font-mono text-xs text-gray-600">600</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-mono text-xs text-gray-500">Passengers</p>
                                    <p className="font-mono text-xs text-gold">{passengers} pax</p>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max={selectedAircraft.pax}
                                    step="1"
                                    value={passengers}
                                    onChange={e => setPassengers(parseInt(e.target.value))}
                                    className="w-full accent-gold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center — Map */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Nonstop Banner */}
                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${nonstop
                            ? 'border-green-400/30 bg-green-400/5'
                            : 'border-red-400/30 bg-red-400/5'
                        }`}>
                        <span className={`font-display text-2xl ${nonstop ? 'text-green-400' : 'text-red-400'}`}>
                            {nonstop ? 'NONSTOP' : 'FUEL STOP REQUIRED'}
                        </span>
                        <p className="font-body text-sm text-gray-300">
                            {nonstop
                                ? `${selectedAircraft.model} can fly ${from.code} → ${to.code} nonstop. Range: ${selectedAircraft.range_nm.toLocaleString()}nm. Distance: ${distance.toLocaleString()}nm.`
                                : `${selectedAircraft.model} range (${selectedAircraft.range_nm.toLocaleString()}nm) is insufficient for this ${distance.toLocaleString()}nm route. A fuel stop is required.`
                            }
                        </p>
                    </div>

                    {/* Map */}
                    <div className="glass overflow-hidden" style={{ height: '380px' }}>
                        <MapContainer
                            center={[20, 50]}
                            zoom={3}
                            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                            zoomControl={true}
                        >
                            <TileLayer
                                url={darkMapStyle}
                                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                            />
                            <MapUpdater from={from} to={to} />
                            {from && (
                                <Marker position={[from.lat, from.lng]}>
                                    <Popup className="dark-popup">
                                        <div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '12px', padding: '4px' }}>
                                            <strong>{from.code}</strong><br />{from.city}
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                            {to && (
                                <Marker position={[to.lat, to.lng]}>
                                    <Popup>
                                        <div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '12px', padding: '4px' }}>
                                            <strong>{to.code}</strong><br />{to.city}
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                            {routePoints.length > 0 && (
                                <Polyline
                                    positions={routePoints}
                                    color="#D4AF37"
                                    weight={2}
                                    opacity={0.8}
                                    dashArray="6 4"
                                />
                            )}
                        </MapContainer>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass p-5">
                            <p className="section-label mb-4">TRIP COST BREAKDOWN</p>
                            <div className="space-y-2">
                                {[
                                    { label: 'Fuel Cost', value: fuelCost },
                                    { label: 'Landing Fee', value: landingFee },
                                    { label: 'Handling Fee', value: handlingFee },
                                    { label: 'Overflight Permits', value: overflightPermits },
                                    { label: 'Crew Expenses', value: crewExpenses },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1c1c1c]">
                                        <p className="font-mono text-xs text-gray-400">{item.label}</p>
                                        <p className="font-mono text-xs text-white">${item.value.toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-2">
                                    <p className="font-display text-sm text-gold">TOTAL TRIP COST</p>
                                    <p className="font-display text-lg text-gold">${totalTripCost.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charter vs Ownership */}
                        <div className="glass p-5">
                            <p className="section-label mb-4">CHARTER VS OWNERSHIP</p>
                            <div className="space-y-3">
                                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Annual Charter ({hours} hrs)</p>
                                    <p className="font-display text-xl text-white">${annualCharterCost.toLocaleString()}</p>
                                </div>
                                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Annual Ownership Cost</p>
                                    <p className="font-display text-xl text-white">${annualOwnershipCost.toLocaleString()}</p>
                                </div>
                                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Breakeven Point</p>
                                    <p className="font-display text-xl text-white">{breakevenHours} hrs/year</p>
                                </div>
                                <div className={`p-3 rounded-lg border ${recommendation === 'ownership' ? 'border-gold bg-gold/5' : 'border-gulf bg-gulf/5'}`}>
                                    <p className="font-mono text-xs text-gray-500 mb-1">RECOMMENDATION</p>
                                    <p className="font-display text-xl text-gold">{recommendation.toUpperCase()}</p>
                                    <p className="font-body text-xs text-gray-400 mt-1">
                                        {recommendation === 'ownership'
                                            ? `At ${hours} hrs/year, ownership saves $${(annualCharterCost - annualOwnershipCost).toLocaleString()} annually.`
                                            : `At ${hours} hrs/year, charter saves $${(annualOwnershipCost - annualCharterCost).toLocaleString()} annually.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Summary Card */}
                    <div className="glass-gold p-5">
                        <div className="flex items-center justify-between mb-4">
                            <p className="section-label">MISSION SUMMARY</p>
                            <button className="btn-secondary text-xs py-1.5 px-4">EXPORT PDF</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">Route</p>
                                <p className="font-display text-lg text-white">{from.code} → {to.code}</p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">Aircraft</p>
                                <p className="font-display text-lg text-white">{selectedAircraft.model}</p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">Trip Cost</p>
                                <p className="font-display text-lg text-gold">${totalTripCost.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">Recommendation</p>
                                <p className="font-display text-lg text-gold">{recommendation.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}