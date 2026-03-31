import { mockFlights } from './_data.js'

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { type } = req.query
    let flights = mockFlights
    if (type) flights = flights.filter(f => f.aircraft.includes(type))
    res.json({ success: true, airport: req.query.airport || 'VABB', data: flights })
}
