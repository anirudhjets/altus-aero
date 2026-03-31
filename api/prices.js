export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { airport = 'VABB', aircraft = 'G650' } = req.query
    res.json({
        success: true,
        airport,
        aircraft,
        data: {
            fuel_cost_usd: 18500,
            landing_fee_usd: 2200,
            handling_fee_usd: 1800,
            overflight_permits_usd: 3500,
            crew_expenses_usd: 4000,
            total_estimated_usd: 30000,
            note: 'Estimates based on current VABB rates. Actual costs vary by operator and season.'
        }
    })
}