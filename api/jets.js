const jets = [
    {
        id: 1,
        model: 'G650ER',
        manufacturer: 'Gulfstream',
        range_nm: 7500,
        passengers: 19,
        cruise_speed_kts: 516,
        cabin_length_ft: 53.6,
        cabin_height_ft: 6.3,
        baggage_cuft: 195,
        hourly_rate_usd: 12000,
        purchase_price_usd: 75000000,
        color: '#0d1b3e',
        broker_insight: 'The default answer for Mumbai HNWI clients wanting London or New York nonstop. If they say I want a Gulfstream — this is what they mean. VABB to EGLL nonstop with full passengers and bags.',
        category: 'Ultra Long Range'
    },
    {
        id: 2,
        model: 'G700',
        manufacturer: 'Gulfstream',
        range_nm: 7750,
        passengers: 19,
        cruise_speed_kts: 526,
        cabin_length_ft: 56.2,
        cabin_height_ft: 6.3,
        baggage_cuft: 207,
        hourly_rate_usd: 14000,
        purchase_price_usd: 90000000,
        color: '#1e3a8a',
        broker_insight: 'Newer, larger, slightly faster than the G650ER. 20% more cabin volume. If a client already owns a G650 and wants an upgrade conversation, start here. The stateroom option closes deals.',
        category: 'Ultra Long Range'
    },
    {
        id: 3,
        model: 'Global 7500',
        manufacturer: 'Bombardier',
        range_nm: 7700,
        passengers: 19,
        cruise_speed_kts: 516,
        cabin_length_ft: 54.5,
        cabin_height_ft: 6.2,
        baggage_cuft: 195,
        hourly_rate_usd: 13500,
        purchase_price_usd: 85000000,
        color: '#0f3460',
        broker_insight: 'The range leader. VABB to KLAX nonstop — no other production jet does this reliably. Four living spaces including a permanent bedroom. Lead with the range fact and the bedroom.',
        category: 'Ultra Long Range'
    },
    {
        id: 4,
        model: 'Falcon 7X',
        manufacturer: 'Dassault',
        range_nm: 5950,
        passengers: 16,
        cruise_speed_kts: 482,
        cabin_length_ft: 39.1,
        cabin_height_ft: 6.2,
        baggage_cuft: 140,
        hourly_rate_usd: 10500,
        purchase_price_usd: 55000000,
        color: '#2d4a7a',
        broker_insight: 'The European choice. Three engines means a different insurance profile and access to airports others cannot use. Clients who have flown NetJets Europe often prefer this. Fuel efficiency is best in class.',
        category: 'Long Range'
    },
    {
        id: 5,
        model: 'Phenom 300E',
        manufacturer: 'Embraer',
        range_nm: 2010,
        passengers: 10,
        cruise_speed_kts: 453,
        cabin_length_ft: 17.2,
        cabin_height_ft: 4.9,
        baggage_cuft: 84,
        hourly_rate_usd: 4500,
        purchase_price_usd: 10500000,
        color: '#1a3a5c',
        broker_insight: 'Best entry level jet for new private flyers. Regional India routes — Mumbai to Delhi, Bangalore, Goa. First time ownership conversation starter. Lowest operating cost in its class.',
        category: 'Light Jet'
    }
]

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    res.status(200).json({ success: true, data: jets })
}