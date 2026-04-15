import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProPreview } from '../../context/proPreview'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }

const SIGNALS = [
    {
        id: 'demand', category: 'CHARTER DEMAND', label: 'Charter Demand Index', value: '+12%', direction: 'up', note: 'vs last month globally',
        detail: 'Ultra-long-range demand is outpacing supply in Q2 2026. VABB-originating charters up 18% year-on-year.',
        brokerContext: 'Demand outpacing supply means operators have leverage on pricing. When a client pushes back on charter cost right now, the honest answer is: there are fewer aircraft available than there are buyers. Use the demand data as a reason to act quickly, not as a pressure tactic — the urgency is real. Lock availability for repeat clients before the summer peak.',
    },
    {
        id: 'preowned', category: 'PRE-OWNED MARKET', label: 'Pre-owned Values', value: '-8%', direction: 'down', note: 'Q1 2026 correction across all categories',
        detail: 'Pre-owned business jet values have corrected from 2023-24 highs. Ultra-long-range category most affected at -11%.',
        brokerContext: 'A buyer\'s market is the single clearest urgency argument for acquisition clients. Values are down from 2023-24 peaks across every category. For a client who has been considering purchase for 12-18 months, this is the moment. Run a comparison: what a G650ER pre-owned cost in early 2024 versus today. The difference funds two to three years of operating costs. That conversation belongs in your next client meeting.',
    },
    {
        id: 'vabb', category: 'ROUTE INTELLIGENCE', label: 'VABB Active Private Flights', value: '47', direction: 'up', note: 'right now — Mumbai airport',
        detail: '47 business aircraft currently active on VABB-originating or inbound routes. Peak window 06:00-11:00 IST.',
        brokerContext: 'Monitor the peak windows. 06:00-11:00 IST is when VABB availability tightens fastest — operators prioritise early slots for confirmed bookings. If your client has a flexible departure time, positioning them in the 12:00-16:00 window typically yields better availability and occasionally lower positioning fees.',
    },
    {
        id: 'ulr', category: 'SEGMENT PERFORMANCE', label: 'Ultra Long Range Utilisation', value: '84%', direction: 'up', note: 'fleet utilisation — ULR category',
        detail: 'ULR fleet utilisation at 84% globally. Highest since Q3 2023. Available aircraft for one-way positioning are constrained.',
        brokerContext: '84% utilisation means 16% of the global ULR fleet is available at any given moment. For one-way charters with short lead times — 48 hours or less — you are competing with every other broker for the same aircraft. Build your operator relationships before you need them. The broker who calls at 10pm and gets a confirmed tail number is the one with a relationship, not a cold inquiry.',
    },
    {
        id: 'midsize', category: 'SEGMENT PERFORMANCE', label: 'Midsize Charter Growth', value: '+21%', direction: 'up', note: 'year-on-year — South Asia',
        detail: 'Midsize charter inquiries in South Asia up 21% year-on-year. Challenger 350 and G280 are the most-requested types.',
        brokerContext: 'The midsize segment is the fastest-growing charter category in South Asia. First-time private flyers are entering at midsize — they want private but are not ready for the ULR commitment. This is your pipeline: get them on a Challenger 350 for a regional route, deliver a flawless experience, and the ULR conversation happens naturally in 12-18 months. Do not try to upsell on the first flight.',
    },
    {
        id: 'fractional', category: 'MARKET STRUCTURE', label: 'Fractional vs Charter — Cost Crossover', value: '200hr', direction: 'neutral', note: 'breakeven threshold — annually',
        detail: 'At 200 flight hours per year, fractional ownership costs align with full charter. Below that, charter almost always wins on total cost.',
        brokerContext: 'The 200-hour crossover is the most useful number in private aviation for client education. Under 200 hours annually — charter wins on cost. Over 200 — fractional or ownership starts to make economic sense. Ask your client about their expected usage before recommending anything. If they say 50-100 hours, charter is the right answer and you should say so. Clients who trust your honesty on this question become acquisition clients when they hit the threshold.',
    },
]

function ProLock({ navigate, label, children }) {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>{children}</div>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(2px)', gap: '10px', padding: '16px',
            }}>
                <span style={{ ...MONO, fontSize: '9px', color: '#C8C8C8', letterSpacing: '0.2em' }}>PRO FEATURE</span>
                {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#555', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>{label}</p>}
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{ ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 20px', background: '#C8C8C8', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer' }}
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
    const updatedLabel = isPro ? `Updated ${Math.floor(Math.random() * 4) + 1} minutes ago` : 'Updated 24 hours ago'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <p style={EYEBROW}>Market Intelligence</p>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginTop: '6px' }}>INTEL</h1>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', marginTop: '6px' }}>Private aviation market signals with broker context on every data point.</p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', alignSelf: 'flex-start', flexShrink: 0,
                    background: isPro ? 'rgba(74,222,128,0.06)' : 'rgba(200,200,200,0.06)',
                    border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(200,200,200,0.2)'}`,
                    borderRadius: '9999px',
                }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isPro ? '#4ade80' : '#C8C8C8', flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ ...MONO, fontSize: '9px', color: isPro ? '#4ade80' : '#C8C8C8', letterSpacing: '0.12em' }}>
                        {isPro ? 'LIVE DATA' : '24HR DELAYED'}
                    </span>
                </div>
            </div>

            {/* Free tier banner */}
            {!isPro && (
                <div style={{ padding: '14px 20px', border: '1px solid rgba(200,200,200,0.15)', background: 'rgba(200,200,200,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555' }}>
                        You are seeing 24-hour delayed signals. Pro unlocks live data and Broker Context on every signal.
                    </p>
                    <button onClick={() => navigate('/app/billing')} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 16px', background: '#C8C8C8', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer', flexShrink: 0 }}>
                        GO PRO
                    </button>
                </div>
            )}

            {/* Signals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                {SIGNALS.map((signal) => {
                    const isExpanded = expanded === signal.id
                    const valueColor = signal.direction === 'up' ? '#4ade80' : signal.direction === 'down' ? '#C8C8C8' : '#ffffff'
                    return (
                        <div key={signal.id} style={{ background: '#0a0a0a', overflow: 'hidden' }}>
                            <div
                                onClick={() => setExpanded(isExpanded ? null : signal.id)}
                                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: valueColor, opacity: 0.8 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ ...EYEBROW, marginBottom: '3px' }}>{signal.category}</p>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{signal.label}</p>
                                </div>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '0.03em', flexShrink: 0, color: valueColor, lineHeight: 1 }}>{signal.value}</p>
                                <span style={{ color: '#333', fontSize: '10px', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                            </div>

                            {isExpanded && (
                                <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', lineHeight: 1.75, padding: '16px 0 8px' }}>{signal.detail}</p>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#333', letterSpacing: '0.08em', marginBottom: '16px' }}>{updatedLabel} · {signal.note}</p>

                                    {isPro ? (
                                        <div style={{ padding: '20px', border: '1px solid rgba(200,200,200,0.15)', background: 'rgba(200,200,200,0.02)' }}>
                                            <p style={{ ...EYEBROW, color: '#C8C8C8', marginBottom: '12px' }}>Broker Context</p>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>{signal.brokerContext}</p>
                                        </div>
                                    ) : (
                                        <ProLock navigate={navigate} label="Broker Context explains what each signal means for your next deal.">
                                            <div style={{ padding: '20px', border: '1px solid rgba(200,200,200,0.15)', background: 'rgba(200,200,200,0.02)' }}>
                                                <p style={{ ...EYEBROW, color: '#C8C8C8', marginBottom: '12px' }}>Broker Context</p>
                                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>{signal.brokerContext}</p>
                                            </div>
                                        </ProLock>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Bottom note */}
            <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.05)', background: '#080808' }}>
                <p style={{ ...EYEBROW, marginBottom: '10px' }}>How to use Intel</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#444', lineHeight: 1.8 }}>
                    Market signals are data points. Broker Context is what makes them useful in a client conversation. A signal that says pre-owned values are down 8% is interesting. Knowing how to turn that into a close is the difference between a broker and an order-taker.
                    {!isPro && ' Unlock Broker Context with Pro to get both.'}
                </p>
            </div>
        </div>
    )
}