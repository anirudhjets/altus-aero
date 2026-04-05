import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const SIGNALS = [
    {
        id: 'demand',
        category: 'CHARTER DEMAND',
        label: 'Charter Demand Index',
        value: '+12%',
        direction: 'up',
        note: 'vs last month globally',
        detail: 'Ultra-long-range demand is outpacing supply in Q2 2026. VABB-originating charters up 18% year-on-year.',
        brokerContext: 'Demand outpacing supply means operators have leverage on pricing. When a client pushes back on charter cost right now, the honest answer is: there are fewer aircraft available than there are buyers. Use the demand data as a reason to act quickly, not as a pressure tactic — the urgency is real. Lock availability for repeat clients before the summer peak.',
    },
    {
        id: 'preowned',
        category: 'PRE-OWNED MARKET',
        label: 'Pre-owned Values',
        value: '-8%',
        direction: 'down',
        note: 'Q1 2026 correction across all categories',
        detail: 'Pre-owned business jet values have corrected from 2023-24 highs. Ultra-long-range category most affected at -11%.',
        brokerContext: 'A buyer\'s market is the single clearest urgency argument for acquisition clients. Values are down from 2023-24 peaks across every category. For a client who has been considering purchase for 12-18 months, this is the moment. Run a comparison: what a G650ER pre-owned cost in early 2024 versus today. The difference funds two to three years of operating costs. That conversation belongs in your next client meeting.',
    },
    {
        id: 'vabb',
        category: 'ROUTE INTELLIGENCE',
        label: 'VABB Active Private Flights',
        value: '47',
        direction: 'up',
        note: 'right now — Mumbai airport',
        detail: '47 business aircraft currently active on VABB-originating or inbound routes. Peak window 06:00-11:00 IST.',
        brokerContext: 'Monitor the peak windows. 06:00-11:00 IST is when VABB availability tightens fastest — operators prioritise early slots for confirmed bookings. If your client has a flexible departure time, positioning them in the 12:00-16:00 window typically yields better availability and occasionally lower positioning fees. Knowing this makes you look sharp in front of the client without mentioning you read it off a market feed.',
    },
    {
        id: 'ulr',
        category: 'SEGMENT PERFORMANCE',
        label: 'Ultra Long Range Utilisation',
        value: '84%',
        direction: 'up',
        note: 'fleet utilisation — ULR category',
        detail: 'ULR fleet utilisation at 84% globally. Highest since Q3 2023. Available aircraft for one-way positioning are constrained.',
        brokerContext: '84% utilisation means 16% of the global ULR fleet is available at any given moment. For one-way charters with short lead times — 48 hours or less — you are competing with every other broker for the same aircraft. Build your operator relationships before you need them. The broker who calls at 10pm and gets a confirmed tail number is the one with a relationship, not a cold inquiry.',
    },
    {
        id: 'midsize',
        category: 'SEGMENT PERFORMANCE',
        label: 'Midsize Charter Growth',
        value: '+21%',
        direction: 'up',
        note: 'year-on-year — South Asia',
        detail: 'Midsize charter inquiries in South Asia up 21% year-on-year. Challenger 350 and G280 are the most-requested types.',
        brokerContext: 'The midsize segment is the fastest-growing charter category in South Asia. First-time private flyers are entering at midsize — they want private but are not ready for the ULR commitment. This is your pipeline: get them on a Challenger 350 for a regional route, deliver a flawless experience, and the ULR conversation happens naturally in 12-18 months. Do not try to upsell on the first flight.',
    },
    {
        id: 'fractional',
        category: 'MARKET STRUCTURE',
        label: 'Fractional vs Charter — Cost Crossover',
        value: '200hr',
        direction: 'neutral',
        note: 'breakeven threshold — annually',
        detail: 'At 200 flight hours per year, fractional ownership costs align with full charter. Below that, charter almost always wins on total cost.',
        brokerContext: 'The 200-hour crossover is the most useful number in private aviation for client education. Under 200 hours annually — charter wins on cost. Over 200 — fractional or ownership starts to make economic sense. Ask your client about their expected usage before recommending anything. If they say 50-100 hours, charter is the right answer and you should say so. Clients who trust your honesty on this question become acquisition clients when they hit the threshold.',
    },
]

function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>
                {children}
            </div>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(2px)',
                borderRadius: '12px', gap: '10px', padding: '16px',
            }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em' }}>PRO FEATURE</span>
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>{label}</p>}
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{
                        padding: '8px 20px', borderRadius: '8px', background: '#D4AF37', color: '#0a0a0a',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em',
                        border: 'none', cursor: 'pointer',
                    }}
                >
                    UPGRADE TO PRO
                </button>
            </div>
        </div>
    )
}

export default function Intel() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(null)

    const now = new Date()
    const updatedLabel = isPro
        ? `Updated ${Math.floor(Math.random() * 4) + 1} minutes ago`
        : 'Updated 24 hours ago'

    return (
        <div className="space-y-4 md:space-y-6 max-w-4xl">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="section-label">MARKET INTELLIGENCE</p>
                    <h1 className="font-display text-3xl md:text-4xl text-white">INTEL</h1>
                    <p className="font-body text-gray-400 text-sm mt-1">
                        Private aviation market signals with broker context on every data point.
                    </p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                    borderRadius: '8px', alignSelf: 'flex-start', flexShrink: 0,
                    background: isPro ? 'rgba(74,222,128,0.08)' : 'rgba(212,175,55,0.08)',
                    border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(212,175,55,0.2)'}`,
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPro ? '#4ade80' : '#D4AF37', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: isPro ? '#4ade80' : '#D4AF37', letterSpacing: '0.1em' }}>
                        {isPro ? 'LIVE DATA' : '24HR DELAYED'}
                    </span>
                </div>
            </div>

            {/* Free tier explanation */}
            {!isPro && (
                <div style={{
                    padding: '12px 16px', borderRadius: '10px',
                    background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        You are seeing 24-hour delayed signals. Pro unlocks live data and Broker Context on every signal.
                    </p>
                    <button onClick={() => navigate('/app/billing')} style={{
                        padding: '7px 14px', borderRadius: '7px', background: '#D4AF37', color: '#0a0a0a',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}>
                        GO PRO
                    </button>
                </div>
            )}

            {/* Signals */}
            <div className="space-y-3">
                {SIGNALS.map((signal) => {
                    const isExpanded = expanded === signal.id
                    return (
                        <div key={signal.id} className="glass overflow-hidden">
                            <div
                                onClick={() => setExpanded(isExpanded ? null : signal.id)}
                                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                            >
                                {/* Direction indicator */}
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                    background: signal.direction === 'up' ? '#4ade80' : signal.direction === 'down' ? '#D4AF37' : '#6b7280',
                                    boxShadow: signal.direction === 'up' ? '0 0 8px rgba(74,222,128,0.4)' : signal.direction === 'down' ? '0 0 8px rgba(212,175,55,0.4)' : 'none',
                                }} />

                                {/* Label */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: '3px' }}>
                                        {signal.category}
                                    </p>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                        {signal.label}
                                    </p>
                                </div>

                                {/* Value */}
                                <p style={{
                                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '0.03em', flexShrink: 0,
                                    color: signal.direction === 'up' ? '#4ade80' : signal.direction === 'down' ? '#D4AF37' : '#fff',
                                }}>
                                    {signal.value}
                                </p>

                                {/* Expand chevron */}
                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                            </div>

                            {isExpanded && (
                                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1c1c1c' }}>
                                    <div style={{ paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                                            {signal.detail}
                                        </p>
                                    </div>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginBottom: '16px' }}>
                                        {updatedLabel} · {signal.note}
                                    </p>

                                    {/* Broker Context */}
                                    {isPro ? (
                                        <div style={{
                                            padding: '16px', borderRadius: '10px',
                                            background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)',
                                        }}>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '10px' }}>
                                                BROKER CONTEXT
                                            </p>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>
                                                {signal.brokerContext}
                                            </p>
                                        </div>
                                    ) : (
                                        <ProLock navigate={navigate} label="Broker Context explains what each signal means for your next deal.">
                                            <div style={{
                                                padding: '16px', borderRadius: '10px',
                                                background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)',
                                            }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.15em', marginBottom: '10px' }}>
                                                    BROKER CONTEXT
                                                </p>
                                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>
                                                    {signal.brokerContext}
                                                </p>
                                            </div>
                                        </ProLock>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Bottom education note */}
            <div style={{
                padding: '20px', borderRadius: '12px',
                background: '#0d0d0d', border: '1px solid #1c1c1c',
            }}>
                <p className="section-label mb-2">HOW TO USE INTEL</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                    Market signals are data points. Broker Context is what makes them useful in a client conversation. A signal that says pre-owned values are down 8% is interesting. Knowing how to turn that into a close is the difference between a broker and an order-taker.
                    {!isPro && ' Unlock Broker Context with Pro to get both.'}
                </p>
            </div>
        </div>
    )
}