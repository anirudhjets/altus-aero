import { useState } from 'react'

const plans = [
  { name: 'Starter', tag: 'Learn the market', price: 49, features: ['Flight data access', 'Cost calculators', 'Fleet specifications', 'Email support'], highlight: false },
  { name: 'Pro', tag: 'Master the fleet', price: 99, features: ['Everything in Starter', '3D aircraft models', 'Live flight tracking', 'Branded client proposals', 'Priority support'], highlight: true },
  { name: 'Enterprise', tag: 'Own the intelligence', price: 199, features: ['Everything in Pro', 'JETNET market data', 'White-label reports', 'Team access', 'Dedicated account manager'], highlight: false },
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
    <div className="space-y-6">
      <div>
        <p className="section-label">ACCOUNT AND BILLING</p>
        <h1 className="font-display text-4xl text-white">YOUR PLAN</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-gold p-6 md:col-span-1">
          <p className="section-label mb-2">CURRENT PLAN</p>
          <p className="font-display text-4xl text-gold mb-1">PRO</p>
          <p className="font-display text-3xl text-white mb-4">$99<span className="text-sm text-gray-400">/mo</span></p>
          <p className="font-mono text-xs text-gray-500">Next billing: Apr 1, 2026</p>
        </div>
        <div className="glass p-6 md:col-span-2">
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
                  <div className="h-2 rounded-full" style={{ width: (m.used / m.total * 100) + '%', background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <div key={i} className={'p-6 rounded-xl border transition-all ' + (plan.highlight ? 'border-gold bg-gold/5' : 'border-[#1c1c1c] glass')}>
            <p className="font-display text-2xl text-white mb-1">{plan.name}</p>
            <p className="font-mono text-xs text-gold mb-4">{plan.tag}</p>
            <p className="font-display text-4xl text-white mb-4">${annual ? Math.round(plan.price * 0.8) : plan.price}<span className="text-sm text-gray-400">/mo</span></p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 font-body text-xs text-gray-300">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={'w-full py-2.5 rounded-lg font-display text-sm tracking-widest ' + (plan.highlight ? 'bg-gold/20 text-gold border border-gold' : 'border border-[#1c1c1c] text-white')}>
              {plan.highlight ? 'CURRENT PLAN' : 'SWITCH PLAN'}
            </button>
          </div>
        ))}
      </div>
      <div className="glass-gold p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl text-white mb-1">REFER A BROKER. EARN 20% RECURRING.</p>
          <p className="font-body text-gray-300 text-sm">They learn more, you earn more.</p>
        </div>
        <button className="btn-primary" onClick={() => window.open('https://jetadvisor.pro/ref/anirudh-shinde', '_blank')}>
          GET REFERRAL LINK
        </button>
      </div>
    </div>
  )
}
