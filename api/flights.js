const mockFlights = [
    { id: 'AIC001', route: 'VABB to EGLL', aircraft: 'G650ER', dep: '08:30 IST', eta: '13:45 GMT', altitude: 45000, speed: 516, status: 'En Route' },
    { id: 'AIC002', route: 'VABB to OMDB', aircraft: 'Global 7500', dep: '10:15 IST', eta: '12:30 GST', altitude: 43000, speed: 490, status: 'En Route' },
    { id: 'AIC003', route: 'VABB to YSSY', aircraft: 'G700', dep: '23:00 IST', eta: '15:20 AEDT', altitude: 0, speed: 0, status: 'Scheduled' },
    { id: 'AIC004', route: 'VIDP to VABB', aircraft: 'Phenom 300E', dep: '06:00 IST', eta: '07:45 IST', altitude: 35000, speed: 453, status: 'En Route' },
    { id: 'AIC005', route: 'VABB to LFPB', aircraft: 'Falcon 7X', dep: '14:00 IST', eta: '18:30 CET', altitude: 41000, speed: 482, status: 'En Route' }
]

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    const { type } = req.query
    let flights = mockFlights
    if (type) {
        flights = flights.filter(f => f.aircraft.toLowerCase().includes(type.toLowerCase()))
    }
    res.status(200).json({ success: true, data: flights })
}