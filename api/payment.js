import Razorpay from 'razorpay'

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { plan } = req.body

    const prices = {
        pro_monthly: 249900,
        pro_annual: 239880,
    }

    const amount = prices[plan]
    if (!amount) return res.status(400).json({ error: 'Invalid plan' })

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `altus_${plan}_${Date.now()}`,
            notes: { plan }
        })

        res.json({ success: true, order })
    } catch (err) {
        console.error('Razorpay order error:', err)
        res.status(500).json({ error: 'Failed to create order' })
    }
}