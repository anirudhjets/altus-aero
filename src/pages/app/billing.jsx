import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const FREE_FEATURES = [
    'Fleet guide — all 14 aircraft with full specs',
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

export default function Billing() {
    const { user, plan, refreshPlan } = useAuth()
    const [annual, setAnnual] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState(false)
    const [searchParams] = useSearchParams()

    const monthlyPrice = 2499
    const annualMonthlyPrice = 1999
    const annualTotalPrice = annualMonthlyPrice * 12

    const isPro = plan === 'pro'

    useEffect(() => {
        if (searchParams.get('upgrade') === 'true' && !isPro) {
            setTimeout(() => handleUpgrade(), 800)
        }
    }, [])

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

        const planKey = annual ? 'pro_annual' : 'pro_monthly'

        try {
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planKey })
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
                description: annual ? 'Pro — Annual' : 'Pro — Monthly',
                order_id: data.order.id,
                prefill: { email: user?.email || '' },
                theme: { color: '#D4AF37' },
                modal: {
                    ondismiss: () => setLoading(false)
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
                                plan: planKey,
                                user_id: user?.id
                            })
                        })
                        const verifyData = await verifyRes.json()
                        if (verifyData.success) {
                            await refreshPlan()
                            setSuccess('Payment confirmed. Your Pro plan is now active.')
                        } else {
                            setError('Payment could not be verified. Contact support with your payment ID: ' + response.razorpay_payment_id)
                        }
                    } catch {
                        setError('Something went wrong during verification. Contact support.')
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

    const handleCopyReferral = () => {
        const link = 'https://altus-aero.vercel.app'
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
    }

    const usageItems = [
        {
            label: 'Mission Plans',
            used: isPro ? 12 : 1,
            total: isPro ? null : 1,
            proOnly: false,
        },
        {
            label: 'Flight Searches',
            used: 0,
            total: null,
            proOnly: !isPro,
        },
        {
            label: 'Reports Generated',
            used: isPro ? 8 : 0,
            total: isPro ? 25 : null,
            proOnly: !isPro,
        },
    ]

    return (
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">

            {/* Header */}
            <div>
                <p className="section-label">ACCOUNT AND BILLING</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">YOUR PLAN</h1>
                <p className="font-body text-gray-400 text-sm mt-1">
                    Learn for free. Go Pro when you are ready to close.
                </p>
            </div>

            {/* Auto-upgrade notice */}
            {searchParams.get('upgrade') === 'true' && !isPro && (
                <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 flex items-start gap-3">
                    <span className="text-gold flex-shrink-0">◆</span>
                    <div>
                        <p className="font-display text-sm text-gold mb-1">OPENING CHECKOUT</p>
                        <p className="font-body text-xs text-gray-400">
                            The payment window is loading. If it does not appear, click the Upgrade button below.
                        </p>
                    </div>
                </div>
            )}

            {/* Current Plan + Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Current plan card */}
                <div className="glass-gold p-5 md:p-6">
                    <p className="section-label mb-2">CURRENT PLAN</p>
                    <p className="font-display text-3xl md:text-4xl text-gold mb-1">
                        {isPro ? 'PRO' : 'FREE'}
                    </p>
                    <p className="font-mono text-xs text-gray-400 mb-4">
                        {isPro ? 'Full access — all tools active' : 'Learning the market'}
                    </p>
                    {isPro ? (
                        <>
                            <p className="font-display text-2xl text-white mb-1">
                                {annual ? '₹1,999' : '₹2,499'}
                                <span className="text-sm text-gray-400">/mo</span>
                            </p>
                            <p className="font-mono text-xs text-gray-500">Next billing: May 1, 2026</p>
                        </>
                    ) : (
                        <p className="font-body text-xs text-gray-500">
                            Upgrade to Pro to unlock all the professional tools.
                        </p>
                    )}
                </div>

                {/* Usage card */}
                <div className="glass p-5 md:p-6 md:col-span-2">
                    <p className="section-label mb-4">USAGE THIS MONTH</p>
                    <div className="space-y-5">
                        {usageItems.map((m, i) => {
                            const pct = m.proOnly
                                ? 0
                                : m.total === null
                                    ? 5
                                    : Math.min((m.used / m.total) * 100, 100)

                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="font-mono text-xs text-gray-400">{m.label}</p>
                                        <p className="font-mono text-xs text-gray-500">
                                            {m.proOnly
                                                ? 'Pro only'
                                                : m.total === null
                                                    ? `${m.used} used`
                                                    : `${m.used} / ${m.total}`}
                                        </p>
                                    </div>
                                    <div className="h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
                                        <div
                                            className="h-1.5 rounded-full transition-all duration-700"
                                            style={{
                                                width: `${pct}%`,
                                                background: m.proOnly ? 'transparent' : '#D4AF37',
                                                opacity: m.proOnly ? 0 : 1,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Status messages */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Free */}
                    <div className={`p-5 md:p-6 rounded-xl border transition-all ${!isPro ? 'border-gold bg-gold/5' : 'border-[#1c1c1c] glass'}`}>
                        {!isPro && (
                            <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3">CURRENT PLAN</p>
                        )}
                        <p className="font-display text-2xl text-white mb-1">Free</p>
                        <p className="font-mono text-xs text-gold mb-4">Learn the market — always free</p>
                        <p className="font-display text-4xl text-white mb-6">
                            ₹0<span className="text-sm text-gray-400 font-body"> forever</span>
                        </p>
                        <ul className="space-y-2 mb-6">
                            {FREE_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-xs text-gray-300">
                                    <span className="text-gold mt-0.5 flex-shrink-0">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled
                            className="w-full py-2.5 rounded-lg font-display text-sm tracking-widest border border-[#1c1c1c] text-gray-600 cursor-default"
                        >
                            {!isPro ? 'YOUR CURRENT PLAN' : 'FREE PLAN'}
                        </button>
                    </div>

                    {/* Pro */}
                    <div className={`p-5 md:p-6 rounded-xl border transition-all ${isPro ? 'border-gold bg-gold/5' : 'border-gulf bg-gulf/5'}`}>
                        <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3">
                            {isPro ? 'CURRENT PLAN' : 'RECOMMENDED'}
                        </p>
                        <p className="font-display text-2xl text-white mb-1">Pro</p>
                        <p className="font-mono text-xs text-gold mb-4">Everything you need to close deals</p>
                        <p className="font-display text-4xl text-white mb-1">
                            ₹{annual ? annualMonthlyPrice.toLocaleString() : monthlyPrice.toLocaleString()}
                            <span className="text-sm text-gray-400 font-body">/mo</span>
                        </p>
                        {annual && (
                            <p className="font-mono text-xs text-green-400 mb-1">₹{annualTotalPrice.toLocaleString()} billed once a year</p>
                        )}
                        <p className="font-mono text-xs text-gray-500 mb-4">
                            {annual ? 'You save ₹6,000 vs monthly' : 'Switch to annual and save ₹6,000/year'}
                        </p>
                        <ul className="space-y-2 mb-6">
                            {PRO_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-xs text-gray-300">
                                    <span className="text-gold mt-0.5 flex-shrink-0">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        {isPro ? (
                            <button
                                disabled
                                className="w-full py-2.5 rounded-lg font-display text-sm tracking-widest bg-gold/20 text-gold border border-gold cursor-default"
                            >
                                YOUR CURRENT PLAN
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
                                {loading
                                    ? 'OPENING PAYMENT...'
                                    : annual
                                        ? `UPGRADE — ₹${annualTotalPrice.toLocaleString()}/yr`
                                        : `UPGRADE — ₹${monthlyPrice.toLocaleString()}/mo`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Referral */}
            <div className="glass-gold p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <p className="font-display text-lg md:text-xl text-white mb-1">REFER A BROKER. EARN 20% RECURRING.</p>
                    <p className="font-body text-gray-300 text-sm">
                        Share Altus Aero with another broker and earn on every payment they make.
                    </p>
                </div>
                <button
                    className="btn-primary whitespace-nowrap flex-shrink-0 w-full md:w-auto"
                    onClick={handleCopyReferral}
                >
                    {copied ? 'LINK COPIED' : 'COPY REFERRAL LINK'}
                </button>
            </div>
        </div>
    )
}