import { useState } from 'react'

const plans = [
    {
        name: 'Starter',
        tag: 'Learn the market',
        price: 49,
        features: ['Flight data access', 'Cost calculators', 'Fleet specifications', 'Email support'],
        highlight: false,
    },
    {
        name: 'Pro',
        tag: 'Master the fleet',
        price: 99,
        features: ['Everything in Starter', '3D aircraft models', 'Live flight tracking', 'Branded client proposals', 'Priority support'],
        highlight: true,
    },
    {
        name: 'Enterprise',
        tag: 'Own the intelligence',
        price: 199,
        features: ['Everything in Pro', 'JETNET market data', 'White-label reports', 'Team access', 'Dedicated account manager'],
        highlight: false,
    },
]

const invoices = [
    { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$99.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$99.00', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$99.00', status: 'Paid' },
    { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: '$99.00', status: 'Paid' },
]

export default function Billing() {
    const [annual, setAnnual] = useState(false)

    return (
        <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto">

            {/* Header */}
            <div>
                <p className="section-label">ACCOUNT AND BILLING</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">YOUR PLAN</h1>
                <p className="font-body text-gray-400 text-sm md:text-base mt-2">
                    Invest in your knowledge. Every tier unlocks a deeper level of market intelligence.
                </p>
            </div>

            {/* Current Plan + Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-gold p-5 md:p-6">
                    <p className="section-label mb-2">CURRENT PLAN</p>
                    <p className="font-display text-3xl md:text-4xl text-gold mb-1">PRO</p>
                    <p className="font-mono text-xs text-gray-400 mb-4">Master the fleet</p>
                    <p className="font-display text-2xl md:text-3xl text-white mb-4">
                        $99<span className="text-sm text-gray-400">/mo</span>
                    </p>
                    <p className="font-mono text-xs text-gray-500">Next billing: Apr 1, 2026</p>
                </div>

                <div className="glass p-5 md:p-6 md:col-span-2">
                    <p className="section-label mb-4">USAGE THIS MONTH</p>
                    <div className="space-y-4">
                        {[
                            { label: 'API Calls', used: 847, total: 1000, color: '#D4AF37' },
                            { label: 'Reports Generated', used: 12, total: 25, color: '#1e3a8a' },
                            { label: 'Flight Searches', used: 34, total: 100, color: '#0f3460' },
                        ].map((m, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-mono text-xs text-gray-400">{m.label}</p>
                                    <p className="font-mono text-xs text-gray-500">{m.used} / {m.total}</p>
                                </div>
                                <div className="h-2 bg-[#1c1c1c] rounded-full">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{ width: `${(m.used / m.total) * 100}%`, background: m.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <p className="section-label">UPGRADE YOUR KNOWLEDGE</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`p-5 md:p-6 rounded-xl border transition-all ${plan.highlight
                                ? 'border-gold bg-gold/5 shadow-gold'
                                : 'border-[#1c1c1c] glass'
                            }`}
                        >
                            {plan.highlight && (
                                <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3">CURRENT PLAN</p>
                            )}
                            <p className="font-display text-2xl text-white mb-1">{plan.name}</p>
                            <p className="font-mono text-xs text-gold mb-4">{plan.tag}</p>
                            <p className="font-display text-3xl md:text-4xl text-white mb-1">
                                ${annual ? Math.round(plan.price * 0.8) : plan.price}
                                <span className="text-sm text-gray-400">/mo</span>
                            </p>
                            {annual && (
                                <p className="font-mono text-xs text-green-400 mb-2">Billed annually</p>
                            )}
                            <ul className="space-y-2 mt-4 mb-6">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-2 font-body text-xs text-gray-300">
                                        <span className="text-gold mt-0.5">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full py-2.5 rounded-lg font-display text-sm tracking-widest transition-all ${plan.highlight
                                    ? 'bg-gold/20 text-gold border border-gold cursor-default'
                                    : 'border border-[#1c1c1c] text-white hover:border-gold hover:text-gold'
                                }`}
                            >
                                {plan.highlight ? 'CURRENT PLAN' : 'SWITCH PLAN'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoice History */}
            <div className="glass overflow-hidden">
                <div className="p-4 md:p-5 border-b border-[#1c1c1c]">
                    <p className="section-label">INVOICE HISTORY</p>
                </div>

                {/* Desktop Table */}
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
                                        <span className="font-mono text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button className="font-mono text-xs text-gray-500 hover:text-gold transition-colors">Download PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
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
