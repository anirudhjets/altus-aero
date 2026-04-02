export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { message, conversation_history = [] } = req.body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'Chatbot is not configured' })
    }

    const systemPrompt = `You are a senior aviation broker advisor embedded inside Altus Aero, a private aviation intelligence platform for jet brokers.

Your role is to help brokers close deals by teaching them about aircraft, markets, and client conversations. You follow the Steve Varsano principle: educate first, sell second.

You answer questions on:
- Aircraft performance, specs, range, cabin comparisons
- Charter vs ownership analysis and deal structures
- Sales positioning and client objection handling
- Negotiation strategy for aviation deals
- Route planning and aircraft suitability
- Pre-owned market dynamics
- How to navigate the Altus Aero platform

You do not answer questions unrelated to aviation or brokerage. If asked something off-topic, politely redirect to aviation.

Keep responses concise, professional, and broker-focused. No emojis. No bullet points unless listing specs. Speak like a senior industry professional.`

    try {
        const messages = [
            ...conversation_history.map(m => ({
                role: m.role,
                content: m.content,
            })),
            { role: 'user', content: message },
        ]

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: systemPrompt,
                messages,
            }),
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('Anthropic error:', err)
            return res.status(500).json({ error: 'Advisor is unavailable' })
        }

        const data = await response.json()
        const reply = data.content?.[0]?.text || 'No response received.'

        return res.status(200).json({ reply })
    } catch (err) {
        console.error('Chatbot error:', err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}