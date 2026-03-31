import { jets } from './_data.js'

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { model = 'G650', budget = '10M' } = req.query
    const jet = jets.find(j => j.model === model) || jets[0]
    const charterHours = 200
    const charterCost = charterHours * jet.hourly_rate_usd
    const ownershipAnnual = jet.purchase_price_usd * 0.12 + 800000
    const recommendation = charterCost < ownershipAnnual ? 'charter' : 'ownership'
    res.json({
        success: true,
        model: jet.model,
        budget,
        recommendation,
        data: {
            charter_annual_200hrs: charterCost,
            ownership_annual_cost: ownershipAnnual,
            purchase_price: jet.purchase_price_usd,
            breakeven_hours: Math.round(ownershipAnnual / jet.hourly_rate_usd),
            explanation: `At 200 hours per year, ${recommendation === 'charter' ? 'charter is more cost effective' : 'ownership makes financial sense'}. The breakeven point for the ${jet.model} is approximately ${Math.round(ownershipAnnual / jet.hourly_rate_usd)} flight hours annually. ${jet.broker_insight}`
        }
    })
}