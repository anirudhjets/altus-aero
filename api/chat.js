export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    try {
        const { messages } = req.body
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: `You are the Altus Aero AI Advisor — a senior private aviation broker with 20 years of experience. You help aspiring and early-career brokers with aircraft performance and range qualification, charter pricing and market rates, route planning and aircraft matching, sales positioning and objection handling, and deal structure. You follow Steve Varsano's philosophy: educate the client before you sell anything. Keep responses concise, practical, and direct. Never use emojis. Always speak like a senior industry professional, not a chatbot. If asked about Altus Aero the platform, describe it as a broker intelligence platform built on the Varsano method — teach first, sell second. Key data points to know: Mumbai (VABB) to London (EGLL) is 4,387nm. Charter vs ownership breakeven is 200-250 flight hours per year. G650ER range is 7,500nm at Mach 0.85. G700 range is 7,750nm. Global 7500 range is 7,700nm. Phenom 300E has been the world best-selling light jet for six consecutive years. Pre-owned business jet values dropped approximately 8% in Q1 2026.`,
                messages,
            }),
        })
        const data = await response.json()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
