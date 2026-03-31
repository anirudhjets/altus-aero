import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const FREE_FEATURES = [
    'Fleet guide — all 14 aircraft specs',
    'Academy and learning section',
    'Basic charter vs ownership calculator',
    'One sample mission plan',
    'Market education content',
]

const PRO_FEATURES = [
    'Everything in Free',
    'Full mission planner with route map',
    'Live flight tracker',
    'Broker intelligence dashboard',
    'Unlimited cost calculations',
    'Branded client proposals',
    'Market data and insights',
    'Priority support',
]

const invoices = [
    { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '₹2,499', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '₹2,499', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '₹2,499', status: 'Paid' },
]

export default function Billing() {
    const { user } = useAuth()
    const [annual, setAnnual] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const monthlyPrice = 2499
    const annualMonthlyPrice = 1999
    const annualTotalPrice = annualMonthlyPrice * 12

    const currentPlan = user?.user_metadata?.plan || 'free'

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true)
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handleUpgrade = async () => {
        setError('')
        setSuccess('')
        setLoading(true)

        const loaded = await loadRazorpay()
        if (!loaded) {
            setError('Payment system failed to load. Please check your connection.')
            setLoading(false)
            return
        }

        const plan = annual ? 'pro_annual' : 'pro_monthly'

        try {
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            })
            const data = await res.json()

            if (!data.success) {
                setError('Could not create payment. Please try again.')
                setLoading(false)
                return
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: 'INR',
                name: 'Altus Aero',
                description: annual ? 'Pro Plan — Annual' : 'Pro Plan — Monthly',
                order_id: data.order.id,
                prefill: {
                    email: user?.email || '',
                },
                theme: {
                    color: '#D4AF37',
                    backdrop_color: '#0a0a0a',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false)
                    }
                },
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch('/api/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan
                            })
                        })
                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            setSuccess('Payment successful. Your Pro plan is now active.')
                        } else {
                            setError('Payment verification failed. Contact support.')
                        }
                    } catch {
                        setError('Verification error. Contact support with your payment ID.')
                    }
                    setLoading(false)
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch {
            setError('Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">

            {/* Header */}
            <div>
                <p className="section-label">ACCOUNT AND BILLING</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">YOUR PLAN</h1>
                <p className="font-body text-gray-400 text-sm md:text-base mt-2">
                    Learn for free. Go pro when you are ready to close.
                </p>
            </div>

            {/* Current Plan + Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-gold p-5 md:p-6">
                    <p className="section-label mb-2">CURRENT PLAN</p>
                    <p className="font-display text-3xl md:text-4xl text-gold mb-1">
                        {currentPlan === 'free' ? 'FREE' : 'PRO'}
                    </p>
                    <p className="font-mono text-xs text-gray-400 mb-4">
                        {currentPlan === 'free' ? 'Learning the market' : 'Master the fleet'}
                    </p>
                    {currentPlan === 'free' ? (
                        <p className="font-mono text-xs text-gray-500">Upgrade to Pro to unlock all tools.</p>
                    ) : (
                        <>
                            <p className="font-display text-2xl md:text-3xl text-white mb-1">
                                {annual ? '₹1,999' : '₹2,499'}
                                <span className="text-sm text-gray-400">/mo</span>
                            </p>
                            <p className="font-mono text-xs text-gray-500">Next billing: Apr 1, 2026</p>
                        </>
                    )}
                </div>

                <div className="glass p-5 md:p-6 md:col-span-2">
                    <p className="section-label mb-4">USAGE THIS MONTH</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Mission Plans', used: 12, total: currentPlan === 'free' ? 1 : 999, color: '#D4AF37' },
                            { label: 'Flight Searches', used: 34, total: currentPlan === 'free' ? 0 : 100, color: '#1e3a8a' },
                            { label: 'Reports Generated', used: currentPlan === 'free' ? 0 : 8, total: currentPlan === 'free' ? 0 : 25, color: '#0f3460' },
                        ].map((m, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-mono text-xs text-gray-400">{m.label}</p>
                                    <p className="font-mono text-xs text-gray-500">
                                        {m.total === 0 ? 'Pro only' : `${m.used} / ${m.total === 999 ? 'unlimited' : m.total}`}
                                    </p>
                                </div>
                                <div className="h-2 bg-[#1c1c1c] rounded-full">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: m.total === 0 ? '0%' : m.total === 999 ? '5%' : `${(m.used / m.total) * 100}%`,
                                            background: m.color
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Success / Error messages */}
            {success && (
                <div className="p-4 rounded-xl border border-green-400/30 bg-green-400/5">
                    <p className="font-mono text-sm text-green-400">{success}</p>
                </div>
            )}
            {error && (
                <div className="p-4 rounded-xl border border-red-400/30 bg-red-400/5">
                    <p className="font-mono text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* Plans */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <p className="section-label">CHOOSE YOUR PLAN</p>
                    <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs ${!annual ? 'text-gold' : 'text-gray-500'}`}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${annual ? 'bg-gold' : 'bg-[#1c1c1c]'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-jet transition-transform ${annual ? 'translate-x-5' : ''}`} />
                        </button>
                        <span className={`font-mono text-xs ${annual ? 'text-gold' : 'text-gray-500'}`}>
                            Annual <span className="text-green-400">-20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">

                    {/* Free Plan */}
                    <div className={`p-5 md:p-6 rounded-xl border transition-all ${currentPlan === 'free' ? 'border-gold bg-gold/5' : 'border-[#1c1c1c] glass'}`}>
                        {currentPlan === 'free' && (
                            <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3">CURRENT PLAN</p>
                        )}
                        <p className="font-display text-2xl text-white mb-1">Free</p>
                        <p className="font-mono text-xs text-gold mb-4">Learn the market</p>
                        <p className="font-display text-4xl text-white mb-1">
                            ₹0
                            <span className="text-sm text-gray-400"> forever</span>
                        </p>
                        <ul className="space-y-2 mt-5 mb-6">
                            {FREE_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-xs text-gray-300">
                                    <span className="text-gold mt-0.5">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled
                            className="w-full py-2.5 rounded-lg font-display text-sm tracking-widest border border-[#1c1c1c] text-gray-600 cursor-default"
                        >
                            {currentPlan === 'free' ? 'CURRENT PLAN' : 'FREE PLAN'}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`p-5 md:p-6 rounded-xl border transition-all ${currentPlan === 'pro' ? 'border-gold bg-gold/5' : 'border-gulf bg-gulf/5'}`}>
                        <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3">
                            {currentPlan === 'pro' ? 'CURRENT PLAN' : 'RECOMMENDED'}
                        </p>
                        <p className="font-display text-2xl text-white mb-1">Pro</p>
                        <p className="font-mono text-xs text-gold mb-4">Master the fleet</p>
                        <p className="font-display text-4xl text-white mb-1">
                            ₹{annual ? annualMonthlyPrice.toLocaleString() : monthlyPrice.toLocaleString()}
                            <span className="text-sm text-gray-400">/mo</span>
                        </p>
                        {annual && (
                            <p className="font-mono text-xs text-green-400 mb-1">
                                ₹{annualTotalPrice.toLocaleString()} billed annually
                            </p>
                        )}
                        <ul className="space-y-2 mt-5 mb-6">
                            {PRO_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-xs text-gray-300">
                                    <span className="text-gold mt-0.5">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        {currentPlan === 'pro' ? (
                            <button
                                disabled
                                className="w-full py-2.5 rounded-lg font-display text-sm tracking-widest bg-gold/20 text-gold border border-gold cursor-default"
                            >
                                CURRENT PLAN
                            </button>
                        ) : (
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg font-display text-sm tracking-widest transition-all"
                                style={{
                                    background: loading ? 'rgba(212,175,55,0.2)' : '#D4AF37',
                                    color: loading ? '#D4AF37' : '#0a0a0a',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    border: '1px solid #D4AF37'
                                }}
                            >
                                {loading ? 'OPENING PAYMENT...' : annual ? `UPGRADE — ₹${annualTotalPrice.toLocaleString()}/yr` : `UPGRADE — ₹${monthlyPrice.toLocaleString()}/mo`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Invoice History — only show for pro */}
            {currentPlan === 'pro' && (
                <div className="glass overflow-hidden">
                    <div className="p-4 md:p-5 border-b border-[#1c1c1c]">
                        <p className="section-label">INVOICE HISTORY</p>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#1c1c1c]">
                                    {['Invoice', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, i) => (
                                    <tr key={i} className="border-b border-[#1c1c1c] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-gold">{inv.id}</td>
                                        <td className="px-5 py-3 font-mono text-xs text-gray-300">{inv.date}</td>
                                        <td className="px-5 py-3 font-mono text-xs text-white">{inv.amount}</td>
                                        <td className="px-5 py-3">
                                            <span className="font-mono text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">{inv.status}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button className="font-mono text-xs text-gray-500 hover:text-gold transition-colors">Download PDF</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-[#1c1c1c]">
                        {invoices.map((inv, i) => (
                            <div key={i} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-xs text-gold mb-1">{inv.id}</p>
                                    <p className="font-mono text-xs text-gray-400">{inv.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-xs text-white">{inv.amount}</p>
                                    <span className="font-mono text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">{inv.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Referral */}
            <div className="glass-gold p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <p className="font-display text-lg md:text-xl text-white mb-1">REFER A BROKER. EARN 20% RECURRING.</p>
                    <p className="font-body text-gray-300 text-sm">
                        They learn more, you earn more. Share your referral link and earn on every payment they make.
                    </p>
                </div>
                <button
                    className="btn-primary whitespace-nowrap flex-shrink-0 w-full md:w-auto"
                    onClick={() => window.open('https://altusaero.com/ref/anirudh-shinde', '_blank')}
                >
                    GET REFERRAL LINK
                </button>
            </div>
        </div>
    )
}
