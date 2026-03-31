import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.82 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5 },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.90 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
    { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
    { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', rate: 3.64 },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.72 },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 35.1 },
]

const airports = [
    { code: 'VABB', name: 'Chhatrapati Shivaji', city: 'Mumbai, India', lat: 19.0896, lng: 72.8656 },
    { code: 'VIDP', name: 'Indira Gandhi Intl', city: 'Delhi, India', lat: 28.5562, lng: 77.1000 },
    { code: 'VOBL', name: 'Kempegowda Intl', city: 'Bangalore, India', lat: 13.1986, lng: 77.7066 },
    { code: 'VOGO', name: 'Mopa Intl', city: 'Goa, India', lat: 15.3808, lng: 73.8314 },
    { code: 'VOCI', name: 'Cochin Intl', city: 'Kochi, India', lat: 10.1520, lng: 76.4019 },
    { code: 'VOHY', name: 'Rajiv Gandhi Intl', city: 'Hyderabad, India', lat: 17.2313, lng: 78.4298 },
    { code: 'VOMM', name: 'Chennai Intl', city: 'Chennai, India', lat: 12.9900, lng: 80.1693 },
    { code: 'VAAH', name: 'Sardar Vallabhbhai', city: 'Ahmedabad, India', lat: 23.0772, lng: 72.6347 },
    { code: 'EGLL', name: 'Heathrow', city: 'London, UK', lat: 51.4775, lng: -0.4614 },
    { code: 'EGLF', name: 'Farnborough', city: 'Farnborough, UK', lat: 51.2775, lng: -0.7764 },
    { code: 'LFPB', name: 'Le Bourget', city: 'Paris, France', lat: 48.9694, lng: 2.4414 },
    { code: 'LFPO', name: 'Orly', city: 'Paris, France', lat: 48.7233, lng: 2.3794 },
    { code: 'EDDB', name: 'Brandenburg', city: 'Berlin, Germany', lat: 52.3667, lng: 13.5033 },
    { code: 'LIML', name: 'Linate', city: 'Milan, Italy', lat: 45.4453, lng: 9.2768 },
    { code: 'LEMD', name: 'Barajas', city: 'Madrid, Spain', lat: 40.4936, lng: -3.5668 },
    { code: 'LSZH', name: 'Zurich', city: 'Zurich, Switzerland', lat: 47.4647, lng: 8.5492 },
    { code: 'EHAM', name: 'Schiphol', city: 'Amsterdam, Netherlands', lat: 52.3086, lng: 4.7639 },
    { code: 'OMDB', name: 'Dubai Intl', city: 'Dubai, UAE', lat: 25.2528, lng: 55.3644 },
    { code: 'OMDW', name: 'Al Maktoum Intl', city: 'Dubai World Central, UAE', lat: 24.8963, lng: 55.1614 },
    { code: 'OMAA', name: 'Zayed Intl', city: 'Abu Dhabi, UAE', lat: 24.4330, lng: 54.6511 },
    { code: 'OTHH', name: 'Hamad Intl', city: 'Doha, Qatar', lat: 25.2731, lng: 51.6081 },
    { code: 'OERK', name: 'King Khalid Intl', city: 'Riyadh, Saudi Arabia', lat: 24.9578, lng: 46.6989 },
    { code: 'OEJN', name: 'King Abdulaziz Intl', city: 'Jeddah, Saudi Arabia', lat: 21.6796, lng: 39.1565 },
    { code: 'OKBK', name: 'Kuwait Intl', city: 'Kuwait City, Kuwait', lat: 29.2267, lng: 47.9689 },
    { code: 'KTEB', name: 'Teterboro', city: 'New York, USA', lat: 40.8501, lng: -74.0608 },
    { code: 'KJFK', name: 'JFK Intl', city: 'New York, USA', lat: 40.6413, lng: -73.7781 },
    { code: 'KLAX', name: 'LAX', city: 'Los Angeles, USA', lat: 33.9425, lng: -118.4081 },
    { code: 'KVNY', name: 'Van Nuys', city: 'Los Angeles, USA', lat: 34.2098, lng: -118.4898 },
    { code: 'KORD', name: "O'Hare Intl", city: 'Chicago, USA', lat: 41.9742, lng: -87.9073 },
    { code: 'KMIA', name: 'Miami Intl', city: 'Miami, USA', lat: 25.7959, lng: -80.2870 },
    { code: 'KSFO', name: 'San Francisco Intl', city: 'San Francisco, USA', lat: 37.6213, lng: -122.3790 },
    { code: 'VHHH', name: 'Hong Kong Intl', city: 'Hong Kong', lat: 22.3080, lng: 113.9185 },
    { code: 'WSSS', name: 'Changi', city: 'Singapore', lat: 1.3644, lng: 103.9915 },
    { code: 'RJTT', name: 'Haneda', city: 'Tokyo, Japan', lat: 35.5494, lng: 139.7798 },
    { code: 'RKSS', name: 'Gimpo Intl', city: 'Seoul, South Korea', lat: 37.5583, lng: 126.7906 },
    { code: 'ZBAA', name: 'Capital Intl', city: 'Beijing, China', lat: 40.0799, lng: 116.6031 },
    { code: 'VTBS', name: 'Suvarnabhumi', city: 'Bangkok, Thailand', lat: 13.6900, lng: 100.7501 },
    { code: 'WMKK', name: 'KLIA', city: 'Kuala Lumpur, Malaysia', lat: 2.7456, lng: 101.7072 },
    { code: 'YSSY', name: 'Kingsford Smith', city: 'Sydney, Australia', lat: -33.9461, lng: 151.1772 },
    { code: 'YMML', name: 'Melbourne Intl', city: 'Melbourne, Australia', lat: -37.6733, lng: 144.8433 },
    { code: 'FAOR', name: 'O.R. Tambo Intl', city: 'Johannesburg, South Africa', lat: -26.1392, lng: 28.2460 },
    { code: 'HECA', name: 'Cairo Intl', city: 'Cairo, Egypt', lat: 30.1219, lng: 31.4056 },
]

const aircraft = [
    { model: 'G650ER', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 7500, speed_kts: 516, pax: 19, hourly: 12000, purchase: 75, notes: 'Default for Mumbai HNWI wanting London or NYC nonstop.' },
    { model: 'G700', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 7750, speed_kts: 526, pax: 19, hourly: 14000, purchase: 90, notes: '20% more cabin than G650. Stateroom option closes deals.' },
    { model: 'G800', manufacturer: 'Gulfstream', category: 'Ultra Long Range', range_nm: 8000, speed_kts: 516, pax: 19, hourly: 15000, purchase: 95, notes: 'Longest range Gulfstream. Singapore to NYC nonstop.' },
    { model: 'Global 7500', manufacturer: 'Bombardier', category: 'Ultra Long Range', range_nm: 7700, speed_kts: 516, pax: 19, hourly: 13500, purchase: 85, notes: 'Range leader. VABB to KLAX nonstop. 4 living spaces.' },
    { model: 'Global 6500', manufacturer: 'Bombardier', category: 'Super Long Range', range_nm: 6600, speed_kts: 513, pax: 17, hourly: 11000, purchase: 55, notes: 'Best value Bombardier. Mumbai to London with ease.' },
    { model: 'Falcon 8X', manufacturer: 'Dassault', category: 'Ultra Long Range', range_nm: 6450, speed_kts: 482, pax: 16, hourly: 11500, purchase: 58, notes: '3 engines. Access to high altitude airports others cannot use.' },
    { model: 'Falcon 7X', manufacturer: 'Dassault', category: 'Long Range', range_nm: 5950, speed_kts: 482, pax: 16, hourly: 10500, purchase: 55, notes: 'European favourite. NetJets Europe clients often prefer this.' },
    { model: 'Falcon 6X', manufacturer: 'Dassault', category: 'Long Range', range_nm: 5500, speed_kts: 480, pax: 16, hourly: 9500, purchase: 42, notes: 'Widest cabin in its class. Ideal for 8-10hr routes.' },
    { model: 'Challenger 350', manufacturer: 'Bombardier', category: 'Super Midsize', range_nm: 3200, speed_kts: 466, pax: 10, hourly: 5500, purchase: 27, notes: 'Most sold business jet globally. Mumbai-Dubai-Delhi routes.' },
    { model: 'Challenger 650', manufacturer: 'Bombardier', category: 'Large Cabin', range_nm: 4000, speed_kts: 459, pax: 12, hourly: 7000, purchase: 32, notes: 'Best large cabin value. Regional Asia routes.' },
    { model: 'Citation Longitude', manufacturer: 'Cessna', category: 'Super Midsize', range_nm: 3500, speed_kts: 476, pax: 12, hourly: 5800, purchase: 26, notes: 'Quietest cabin in super midsize. First class comfort.' },
    { model: 'Praetor 600', manufacturer: 'Embraer', category: 'Super Midsize', range_nm: 4018, speed_kts: 466, pax: 12, hourly: 6200, purchase: 21, notes: 'Best range in class. Mumbai to Riyadh nonstop easily.' },
    { model: 'Phenom 300E', manufacturer: 'Embraer', category: 'Light Jet', range_nm: 2010, speed_kts: 453, pax: 10, hourly: 4500, purchase: 10.5, notes: 'Best entry level jet. Regional India routes. Lowest cost.' },
    { model: 'Citation CJ4', manufacturer: 'Cessna', category: 'Light Jet', range_nm: 2165, speed_kts: 451, pax: 9, hourly: 3800, purchase: 9, notes: 'Popular light jet for short hops. Easy to operate.' },
]

function toRad(deg) { return deg * Math.PI / 180 }

function getDistanceNm(lat1, lng1, lat2, lng2) {
    const R = 3440.065
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getGreatCirclePoints(lat1, lng1, lat2, lng2, n = 80) {
    const points = []
    const d = toRad(getDistanceNm(lat1, lng1, lat2, lng2) / 3440.065 * 180 / Math.PI)
    if (d === 0) return [[lat1, lng1]]
    for (let i = 0; i <= n; i++) {
        const f = i / n
        const A = Math.sin((1 - f) * d) / Math.sin(d)
        const B = Math.sin(f * d) / Math.sin(d)
        const x = A * Math.cos(toRad(lat1)) * Math.cos(toRad(lng1)) + B * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2))
        const y = A * Math.cos(toRad(lat1)) * Math.sin(toRad(lng1)) + B * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2))
        const z = A * Math.sin(toRad(lat1)) + B * Math.sin(toRad(lat2))
        points.push([Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180 / Math.PI, Math.atan2(y, x) * 180 / Math.PI])
    }
    return points
}

function MapUpdater({ from, to }) {
    const map = useMap()
    useEffect(() => {
        if (from && to) {
            map.fitBounds(L.latLngBounds([[from.lat, from.lng], [to.lat, to.lng]]), { padding: [40, 40] })
        } else if (from) {
            map.setView([from.lat, from.lng], 5)
        }
    }, [from, to, map])
    return null
}

export default function Mission() {
    const [from, setFrom] = useState(airports[0])
    const [to, setTo] = useState(airports[8])
    const [selectedAircraft, setSelectedAircraft] = useState(aircraft[0])
    const [hours, setHours] = useState(200)
    const [passengers, setPassengers] = useState(4)
    const [currency, setCurrency] = useState(currencies[0])
    const [activeTab, setActiveTab] = useState('route')

    const [calcHours, setCalcHours] = useState(200)
    const [charterRate, setCharterRate] = useState(12000)
    const [fuelPrice, setFuelPrice] = useState(6.5)
    const [ownershipCost, setOwnershipCost] = useState(6888)
    const [crewCost, setCrewCost] = useState(400000)
    const [maintenance, setMaintenance] = useState(380000)
    const [hangar, setHangar] = useState(150000)
    const [insurance, setInsurance] = useState(120000)

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

    const annualCharterTotal = calcHours * charterRate
    const annualOwnershipTotal = ownershipCost * calcHours * fuelPrice + crewCost + maintenance + hangar + insurance
    const advBreakeven = Math.round(annualOwnershipTotal / charterRate)
    const advRecommendation = calcHours >= advBreakeven ? 'OWNERSHIP' : 'CHARTER'
    const saving = Math.abs(annualCharterTotal - annualOwnershipTotal)

    const fmt = (val) => {
        const converted = val * currency.rate
        if (converted >= 10000000) return `${currency.symbol}${(converted / 10000000).toFixed(1)}Cr`
        if (converted >= 100000) return `${currency.symbol}${(converted / 100000).toFixed(1)}L`
        if (converted >= 1000) return `${currency.symbol}${(converted / 1000).toFixed(0)}K`
        return `${currency.symbol}${converted.toFixed(0)}`
    }

    const routePoints = from && to ? getGreatCirclePoints(from.lat, from.lng, to.lat, to.lng) : []

    const selectStyle = {
        background: '#0d0d0d',
        border: '1px solid #1c1c1c',
        borderRadius: '8px',
        padding: '8px 12px',
        color: 'white',
        fontFamily: 'JetBrains Mono',
        fontSize: '12px',
        width: '100%',
        outline: 'none',
    }

    const tabs = [
        { key: 'route', label: 'ROUTE PLANNER' },
        { key: 'calculator', label: 'COST CALCULATOR' },
        { key: 'fleet', label: 'FLEET GUIDE' },
    ]

    return (
        <div className="space-y-4 md:space-y-6 max-w-screen-2xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="section-label">MISSION PLANNING CENTER</p>
                    <h1 className="font-display text-3xl md:text-4xl text-white">PLAN MISSION</h1>
                    <p className="font-body text-gray-400 text-sm mt-1">Plan every detail before the client asks.</p>
                </div>
                <div className="glass p-3 flex items-center gap-3 self-start">
                    <p className="font-mono text-xs text-gray-500 whitespace-nowrap">CURRENCY</p>
                    <select
                        value={currency.code}
                        onChange={e => setCurrency(currencies.find(c => c.code === e.target.value))}
                        style={{ ...selectStyle, width: 'auto', minWidth: '140px' }}
                    >
                        {currencies.map(c => (
                            <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`font-display text-xs sm:text-sm tracking-widest px-4 sm:px-6 py-2.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.key ? 'bg-gold text-jet' : 'glass text-gray-400 hover:text-gold'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ROUTE PLANNER */}
            {activeTab === 'route' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* Controls Column */}
                    <div className="space-y-4 lg:col-span-1">

                        {/* Route Selector */}
                        <div className="glass p-4 md:p-5">
                            <p className="section-label mb-4">ROUTE</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-mono text-xs text-gray-500 mb-1">DEPARTURE</p>
                                    <select value={from.code} onChange={e => setFrom(airports.find(a => a.code === e.target.value))} style={selectStyle}>
                                        {airports.map(a => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="h-px flex-1 bg-[#1c1c1c]" />
                                    <span className="font-mono text-xs text-gold mx-3">→</span>
                                    <div className="h-px flex-1 bg-[#1c1c1c]" />
                                </div>
                                <div>
                                    <p className="font-mono text-xs text-gray-500 mb-1">DESTINATION</p>
                                    <select value={to.code} onChange={e => setTo(airports.find(a => a.code === e.target.value))} style={selectStyle}>
                                        {airports.map(a => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}
                                    </select>
                                </div>
                            </div>
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

                        {/* Aircraft Selector */}
                        <div className="glass p-4 md:p-5">
                            <p className="section-label mb-4">AIRCRAFT</p>
                            <div className="space-y-2 max-h-64 md:max-h-80 overflow-y-auto pr-1">
                                {aircraft.map((ac, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedAircraft(ac)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${selectedAircraft.model === ac.model ? 'border-gold bg-gold/5' : 'border-[#1c1c1c] hover:border-gulf'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-display text-sm text-white">{ac.model}</p>
                                                <p className="font-mono text-xs text-gray-500 truncate">{ac.manufacturer} · {ac.range_nm.toLocaleString()}nm</p>
                                            </div>
                                            <p className="font-mono text-xs text-gold whitespace-nowrap flex-shrink-0">{fmt(ac.hourly)}/hr</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Parameters */}
                        <div className="glass p-4 md:p-5">
                            <p className="section-label mb-4">PARAMETERS</p>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-mono text-xs text-gray-500">Annual Hours</p>
                                        <p className="font-mono text-xs text-gold">{hours} hrs</p>
                                    </div>
                                    <input type="range" min="50" max="600" step="10" value={hours} onChange={e => setHours(parseInt(e.target.value))} className="w-full accent-gold" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-mono text-xs text-gray-500">Passengers</p>
                                        <p className="font-mono text-xs text-gold">{passengers} pax</p>
                                    </div>
                                    <input type="range" min="1" max={selectedAircraft.pax} step="1" value={passengers} onChange={e => setPassengers(parseInt(e.target.value))} className="w-full accent-gold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map + Results Column */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Nonstop Banner */}
                        <div className={`p-3 md:p-4 rounded-xl border flex flex-wrap items-center gap-3 ${nonstop ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5'}`}>
                            <span className={`font-display text-xl md:text-2xl ${nonstop ? 'text-green-400' : 'text-red-400'}`}>
                                {nonstop ? 'NONSTOP' : 'FUEL STOP REQUIRED'}
                            </span>
                            <p className="font-body text-xs md:text-sm text-gray-300">
                                {nonstop
                                    ? `${selectedAircraft.model} range: ${selectedAircraft.range_nm.toLocaleString()}nm. Route: ${distance.toLocaleString()}nm. Confirmed.`
                                    : `${selectedAircraft.model} range (${selectedAircraft.range_nm.toLocaleString()}nm) is less than ${distance.toLocaleString()}nm.`
                                }
                            </p>
                        </div>

                        {/* Map */}
                        <div className="glass overflow-hidden rounded-xl" style={{ height: '260px', minHeight: '220px' }}>
                            <div className="w-full h-full md:hidden" style={{ height: '260px' }}>
                                <MapContainer center={[20, 50]} zoom={2} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="CartoDB" />
                                    <MapUpdater from={from} to={to} />
                                    {from && <Marker position={[from.lat, from.lng]}><Popup><div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: '4px' }}><strong>{from.code}</strong><br />{from.city}</div></Popup></Marker>}
                                    {to && <Marker position={[to.lat, to.lng]}><Popup><div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: '4px' }}><strong>{to.code}</strong><br />{to.city}</div></Popup></Marker>}
                                    {routePoints.length > 0 && <Polyline positions={routePoints} color="#D4AF37" weight={2} opacity={0.8} dashArray="6 4" />}
                                </MapContainer>
                            </div>
                            <div className="hidden md:block h-full" style={{ height: '360px' }}>
                                <MapContainer center={[20, 50]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="CartoDB" />
                                    <MapUpdater from={from} to={to} />
                                    {from && <Marker position={[from.lat, from.lng]}><Popup><div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '12px', padding: '4px' }}><strong>{from.code}</strong><br />{from.city}</div></Popup></Marker>}
                                    {to && <Marker position={[to.lat, to.lng]}><Popup><div style={{ background: '#0a0a0a', color: '#D4AF37', fontFamily: 'JetBrains Mono', fontSize: '12px', padding: '4px' }}><strong>{to.code}</strong><br />{to.city}</div></Popup></Marker>}
                                    {routePoints.length > 0 && <Polyline positions={routePoints} color="#D4AF37" weight={2} opacity={0.8} dashArray="6 4" />}
                                </MapContainer>
                            </div>
                        </div>

                        {/* Trip Cost + Charter vs Ownership */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass p-4 md:p-5">
                                <p className="section-label mb-4">TRIP COST — {currency.code}</p>
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
                                            <p className="font-mono text-xs text-white">{fmt(item.value)}</p>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="font-display text-sm text-gold">TOTAL TRIP</p>
                                        <p className="font-display text-lg text-gold">{fmt(totalTripCost)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-4 md:p-5">
                                <p className="section-label mb-4">CHARTER VS OWNERSHIP</p>
                                <div className="space-y-3">
                                    <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                        <p className="font-mono text-xs text-gray-500 mb-1">Annual Charter ({hours} hrs)</p>
                                        <p className="font-display text-xl text-white">{fmt(annualCharterCost)}</p>
                                    </div>
                                    <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                        <p className="font-mono text-xs text-gray-500 mb-1">Annual Ownership</p>
                                        <p className="font-display text-xl text-white">{fmt(annualOwnershipCost)}</p>
                                    </div>
                                    <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#1c1c1c]">
                                        <p className="font-mono text-xs text-gray-500 mb-1">Breakeven</p>
                                        <p className="font-display text-xl text-white">{breakevenHours} hrs/year</p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${recommendation === 'ownership' ? 'border-gold bg-gold/5' : 'border-gulf bg-gulf/5'}`}>
                                        <p className="font-mono text-xs text-gray-500 mb-1">RECOMMENDATION</p>
                                        <p className="font-display text-xl text-gold">{recommendation.toUpperCase()}</p>
                                        <p className="font-body text-xs text-gray-400 mt-1">
                                            {recommendation === 'ownership'
                                                ? `At ${hours} hrs/yr, ownership saves ${fmt(annualCharterCost - annualOwnershipCost)} annually.`
                                                : `At ${hours} hrs/yr, charter saves ${fmt(annualOwnershipCost - annualCharterCost)} annually.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mission Summary */}
                        <div className="glass-gold p-4 md:p-5">
                            <div className="flex items-center justify-between mb-4">
                                <p className="section-label">MISSION SUMMARY</p>
                                <button className="btn-secondary text-xs py-1.5 px-3 md:px-4">EXPORT PDF</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                <div><p className="font-mono text-xs text-gray-500 mb-1">Route</p><p className="font-display text-base md:text-lg text-white">{from.code} → {to.code}</p></div>
                                <div><p className="font-mono text-xs text-gray-500 mb-1">Aircraft</p><p className="font-display text-base md:text-lg text-white">{selectedAircraft.model}</p></div>
                                <div><p className="font-mono text-xs text-gray-500 mb-1">Trip Cost</p><p className="font-display text-base md:text-lg text-gold">{fmt(totalTripCost)}</p></div>
                                <div><p className="font-mono text-xs text-gray-500 mb-1">Recommendation</p><p className="font-display text-base md:text-lg text-gold">{recommendation.toUpperCase()}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADVANCED CALCULATOR */}
            {activeTab === 'calculator' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="glass p-4 md:p-6">
                        <p className="section-label mb-5">ANNUAL PARAMETERS — {currency.code}</p>
                        <div className="space-y-5">
                            {[
                                { label: 'Annual Flight Hours', value: calcHours, setter: setCalcHours, min: 50, max: 800, step: 10, unit: 'hrs', raw: true },
                                { label: 'Charter Rate ($/hr)', value: charterRate, setter: setCharterRate, min: 2000, max: 20000, step: 500, unit: '/hr', raw: false },
                                { label: 'Fuel Price ($/gal)', value: fuelPrice, setter: setFuelPrice, min: 3, max: 15, step: 0.5, unit: '/gal', raw: true },
                                { label: 'Ownership Cost ($/hr)', value: ownershipCost, setter: setOwnershipCost, min: 1000, max: 20000, step: 100, unit: '/hr', raw: false },
                                { label: 'Crew Cost ($/year)', value: crewCost, setter: setCrewCost, min: 100000, max: 1000000, step: 10000, unit: '/yr', raw: false },
                                { label: 'Maintenance ($/year)', value: maintenance, setter: setMaintenance, min: 50000, max: 1000000, step: 10000, unit: '/yr', raw: false },
                                { label: 'Hangar ($/year)', value: hangar, setter: setHangar, min: 20000, max: 500000, step: 5000, unit: '/yr', raw: false },
                                { label: 'Insurance ($/year)', value: insurance, setter: setInsurance, min: 20000, max: 500000, step: 5000, unit: '/yr', raw: false },
                            ].map((field, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-mono text-xs text-gray-400">{field.label}</p>
                                        <p className="font-mono text-xs text-gold">
                                            {field.raw ? `${field.value} ${field.unit}` : fmt(field.value)}
                                        </p>
                                    </div>
                                    <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={e => field.setter(parseFloat(e.target.value))} className="w-full accent-gold" />
                                    <div className="flex justify-between mt-0.5">
                                        <span className="font-mono text-xs text-gray-600">{field.raw ? field.min : fmt(field.min)}</span>
                                        <span className="font-mono text-xs text-gray-600">{field.raw ? field.max : fmt(field.max)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="glass-gold p-4 md:p-6">
                            <p className="section-label mb-5">CALCULATION RESULTS</p>
                            <div className="space-y-4">
                                <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Annual Charter Cost ({calcHours} hrs)</p>
                                    <p className="font-display text-2xl md:text-3xl text-white">{fmt(annualCharterTotal)}</p>
                                    <p className="font-mono text-xs text-gray-600 mt-1">{fmt(charterRate)}/hr × {calcHours} hrs</p>
                                </div>
                                <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Annual Ownership Cost</p>
                                    <p className="font-display text-2xl md:text-3xl text-white">{fmt(annualOwnershipTotal)}</p>
                                    <p className="font-mono text-xs text-gray-600 mt-1">Fuel + Crew + Maintenance + Hangar + Insurance</p>
                                </div>
                                <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#1c1c1c]">
                                    <p className="font-mono text-xs text-gray-500 mb-1">Breakeven Point</p>
                                    <p className="font-display text-2xl md:text-3xl text-white">{advBreakeven} hrs/year</p>
                                    <p className="font-mono text-xs text-gray-600 mt-1">Below this — charter wins. Above — ownership wins.</p>
                                </div>
                                <div className={`rounded-xl p-4 md:p-5 border ${advRecommendation === 'OWNERSHIP' ? 'border-gold bg-gold/10' : 'border-gulf bg-gulf/10'}`}>
                                    <p className="font-mono text-xs text-gray-400 mb-2">RECOMMENDATION</p>
                                    <p className="font-display text-4xl md:text-5xl text-gold mb-2">{advRecommendation}</p>
                                    <p className="font-body text-sm text-gray-300">
                                        At {calcHours} hrs/year, {advRecommendation.toLowerCase()} saves {fmt(saving)} annually.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-4 md:p-5">
                            <p className="section-label mb-3">COST BREAKDOWN</p>
                            <div className="space-y-2">
                                {[
                                    { label: 'Fuel', value: ownershipCost * calcHours * fuelPrice / 6.5 },
                                    { label: 'Crew', value: crewCost },
                                    { label: 'Maintenance', value: maintenance },
                                    { label: 'Hangar', value: hangar },
                                    { label: 'Insurance', value: insurance },
                                ].map((item, i) => {
                                    const pct = Math.round((item.value / annualOwnershipTotal) * 100)
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-mono text-xs text-gray-400">{item.label}</p>
                                                <p className="font-mono text-xs text-white">{fmt(item.value)} <span className="text-gray-600">({pct}%)</span></p>
                                            </div>
                                            <div className="h-1.5 bg-[#1c1c1c] rounded-full">
                                                <div className="h-1.5 bg-gold rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FLEET GUIDE */}
            {activeTab === 'fleet' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {aircraft.map((ac, i) => (
                        <div key={i} className="glass p-4 md:p-5 hover:border-gold transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-display text-xl text-white">{ac.model}</p>
                                    <p className="font-mono text-xs text-gold">{ac.manufacturer}</p>
                                </div>
                                <span className="font-mono text-xs text-gray-500 bg-[#1c1c1c] px-2 py-1 rounded flex-shrink-0 ml-2">{ac.category}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {[
                                    { label: 'Range', value: `${ac.range_nm.toLocaleString()}nm` },
                                    { label: 'Speed', value: `${ac.speed_kts}kts` },
                                    { label: 'Passengers', value: `${ac.pax} max` },
                                    { label: 'Charter/hr', value: fmt(ac.hourly) },
                                    { label: 'Purchase', value: `${currency.symbol}${(ac.purchase * currency.rate).toFixed(0)}M` },
                                ].map((s, j) => (
                                    <div key={j} className="bg-[#0d0d0d] rounded-lg p-2 border border-[#1c1c1c]">
                                        <p className="font-mono text-xs text-gray-500">{s.label}</p>
                                        <p className="font-display text-sm text-white">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-gold p-3 rounded-lg">
                                <p className="font-mono text-xs text-gold mb-1">BROKER INSIGHT</p>
                                <p className="font-body text-xs text-gray-300 leading-relaxed">{ac.notes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}