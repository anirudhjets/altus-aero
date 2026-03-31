import { brokerInsights } from './_data.js'

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const today = new Date().getDay()
    const insight = brokerInsights[today % brokerInsights.length]
    res.json({
        success: true,
        date: new Date().toISOString().split('T')[0],
        insight,
        vabb_activity: {
            total_movements: 42,
            business_jets: 4,
            ultra_long_range: 2,
            charter_rate_mumbai_london: 185000
        }
    })
}