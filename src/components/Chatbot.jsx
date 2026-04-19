import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useProPreview } from '../context/proPreview'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }

const AVIATION_RESPONSES = [
    { triggers: ['hello', 'hi', 'hey', 'help', 'start', 'what can'], response: 'Welcome. I am your Altus Aero AI advisor. Ask me anything about aircraft performance, charter pricing, route planning, sales positioning, or how to handle specific client situations.' },
    { triggers: ['g650', 'gulfstream 650'], response: 'The Gulfstream G650ER has a range of 7,500nm at Mach 0.85 cruise. It accommodates up to 19 passengers. For a route like Mumbai to London at 4,387nm, it qualifies nonstop with reserves. Charter rates in Asia typically run USD 12,000–18,000 per flight hour. Lead with the nonstop capability — most competing options require a fuel stop that adds 90 minutes.' },
    { triggers: ['g700', 'gulfstream 700'], response: 'The G700 is the Gulfstream flagship at 7,750nm range with the widest cabin in its class — 8.2 feet. If your client values productivity over cost, the G700 justifies a 15–25% premium on comparable routes. If they are price-sensitive, the G650ER is the smarter pitch. Know which conversation you are in before you recommend.' },
    { triggers: ['global 7500', 'bombardier', 'global 6500'], response: 'The Bombardier Global 7500 at 7,700nm is the closest competitor to the G700. Its differentiator is the four-zone cabin with a true full-size kitchen and a dedicated bedroom. For clients who entertain on board or need genuine rest on 10-hour flights, the Global 7500 often wins the side-by-side comparison. Typical charter rate: USD 15,000–22,000 per flight hour in Asia-Pacific.' },
    { triggers: ['mumbai', 'london', 'vabb', 'egll', 'india', 'delhi'], response: 'Mumbai to London at 4,387nm — qualifying aircraft nonstop: G650ER, G700, Global 7500, Global 6500, and Falcon 8X. The G650ER is the most commonly chartered on this route. A tech stop adds 90 to 120 minutes total. Most ultra-long-range clients choose the premium once they see the math.' },
    { triggers: ['charter', 'ownership', 'buy', 'purchase', 'own', 'breakeven', 'cost'], response: 'Charter versus ownership breakeven sits at 200 to 250 flight hours per year for most heavy jet categories. Below that threshold, charter almost always wins on total cost. When advising an acquisition client, ask for their last 12 months of flight records before recommending either direction. That one question repositions you from salesperson to advisor immediately.' },
    { triggers: ['phenom', 'light jet', 'embraer', 'citation'], response: 'The Phenom 300E has been the world\'s best-selling light jet for six consecutive years. Range of 2,010nm and best-in-class cabin for the category. For routes under 2,000nm with 4 to 6 passengers, it is the first aircraft to recommend.' },
    { triggers: ['falcon', 'dassault', 'tri-engine'], response: 'The Falcon 7X from Dassault is a tri-engine heavy jet with 5,950nm range. The third engine opens certain remote airfields that twin-engine jets cannot access under ETOPS regulations. Charter rates typically run USD 9,000–14,000 per flight hour.' },
    { triggers: ['close', 'deal', 'sales', 'pitch', 'negotiate', 'objection'], response: 'Educate the client before you pitch anything. Walk them through three aircraft that qualify for their route — show the specs side by side. Let them ask questions. By the time you recommend one, they feel informed rather than sold to. The objection "that\'s too expensive" almost never comes when the client understands why the price is what it is.' },
    { triggers: ['expensive', 'too much', 'price', 'cheaper', 'discount'], response: 'When a client says the number is too high, do not drop the price — reframe the value. Four business class tickets often cost $4,000–6,000 combined. Break it down per seat on your aircraft. Then ask them what their time is worth. That question changes the conversation entirely.' },
    { triggers: ['pre-owned', 'used jet', 'second hand', 'market down', 'values'], response: 'Pre-owned business jet values dropped approximately 8% in Q1 2026. It is currently a buyer\'s market — inventory is elevated and prices have corrected from the post-pandemic peak. For acquisition clients sitting on the fence, the urgency argument is legitimate right now, not manufactured.' },
    { triggers: ['broker', 'what is a broker', 'jet broker', 'how to become', 'career'], response: 'A jet broker acts as the intermediary between clients who need aircraft and operators who fly them. The value you add is expertise — knowing which aircraft fits the route, which operators are reliable, and what the market rate should be. That expertise starts with knowing the aircraft cold.' },
    { triggers: ['platform', 'how to use', 'features', 'intel', 'fleet', 'track', 'plan'], response: 'Altus Aero has four main tools. Intel shows market signals with broker context. Fleet gives you full specs on every aircraft. Track shows live flight data. Plan calculates charter and ownership costs for any route. Start with Fleet if you are learning the aircraft. Start with Intel if you have a client meeting today.' },
]

function getHardcodedResponse(message) {
    const lower = message.toLowerCase()
    for (const item of AVIATION_RESPONSES) {
        if (item.triggers.some(t => lower.includes(t))) return item.response
    }
    return 'I can help with aircraft performance and range qualification, charter pricing and market rates, route planning and aircraft matching, and sales positioning. Upgrade to Pro for full AI-powered responses on any question.'
}

export default function Chatbot() {
    const { plan } = useAuth()
    const [isProPreview] = useProPreview()
    const isPro = plan === 'pro' || isProPreview

    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([{
        role: 'assistant',
        text: 'Your Altus Aero AI advisor is online. Ask me about aircraft, routes, charter pricing, or how to close a deal.',
    }])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => { if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
    useEffect(() => { if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || isTyping) return
        const newMessages = [...messages, { role: 'user', text }]
        setMessages(newMessages)
        setInput('')
        setIsTyping(true)

        if (isPro) {
            try {
                const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }))
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: apiMessages }),
                })
                const data = await response.json()
                const reply = data.content?.[0]?.text || 'I could not process that. Please try again.'
                setMessages(prev => [...prev, { role: 'assistant', text: reply }])
            } catch {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Connection issue. Please try again in a moment.' }])
            }
        } else {
            await new Promise(res => setTimeout(res, 900 + Math.random() * 600))
            setMessages(prev => [...prev, { role: 'assistant', text: getHardcodedResponse(text) }])
        }
        setIsTyping(false)
    }

    const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

    return (
        <>
            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                    position: 'fixed', bottom: '80px', right: '20px',
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#0a1a1a', border: '1px solid rgba(10,191,188,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100,
                }}
                className="md:bottom-6 md:right-6"
                title="AI Advisor"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#fff', lineHeight: 1 }}>✕</motion.span>
                    ) : (
                        <motion.svg key="chat" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0ABFBC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>

            {!open && (
                <div style={{ position: 'fixed', bottom: '106px', right: '20px', background: '#0ABFBC', color: '#0a0a0a', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', letterSpacing: '0.1em', padding: '2px 5px', borderRadius: '2px', zIndex: 101, pointerEvents: 'none' }} className="md:bottom-14 md:right-6">
                    AI
                </div>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                            position: 'fixed', bottom: '148px', right: '12px',
                            width: 'calc(100vw - 24px)', maxWidth: '360px', height: '460px',
                            background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.8)', zIndex: 99,
                        }}
                        className="md:bottom-20 md:right-6"
                    >
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px', background: '#080808', flexShrink: 0 }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0a1a1a', border: '1px solid rgba(10,191,188,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '10px', color: '#0ABFBC' }}>AI</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ ...MONO, fontSize: '11px', color: '#0ABFBC', letterSpacing: '0.15em', lineHeight: 1.2 }}>ALTUS AI ADVISOR</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                                    <span style={{ ...MONO, fontSize: '9px', color: '#444', letterSpacing: '0.06em' }}>{isPro ? 'Pro · Powered by Claude' : 'Free · Limited responses'}</span>
                                </div>
                            </div>
                            {!isPro && (
                                <span style={{ ...MONO, fontSize: '8px', letterSpacing: '0.1em', color: '#0a0a0a', background: '#0ABFBC', padding: '2px 7px', borderRadius: '9999px', flexShrink: 0 }}>FREE</span>
                            )}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'none' }}>
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{
                                        maxWidth: '85%', padding: '10px 14px',
                                        background: msg.role === 'user' ? 'rgba(10,191,188,0.08)' : 'rgba(255,255,255,0.03)',
                                        border: msg.role === 'user' ? '1px solid rgba(10,191,188,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        {msg.role === 'assistant' && <p style={{ ...MONO, fontSize: '8px', color: '#0ABFBC', letterSpacing: '0.15em', marginBottom: '5px' }}>ADVISOR</p>}
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {[0, 1, 2].map(dot => (
                                            <motion.span key={dot} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0ABFBC', display: 'inline-block' }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {!isPro && (
                            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexShrink: 0 }}>
                                <p style={{ ...MONO, fontSize: '8px', color: '#444', letterSpacing: '0.06em' }}>Upgrade for full Claude AI responses</p>
                                <button
                                    onClick={() => window.location.href = '/app/billing'}
                                    style={{ ...MONO, fontSize: '8px', letterSpacing: '0.12em', padding: '5px 12px', background: '#0ABFBC', color: '#0a0a0a', border: 'none', borderRadius: '9999px', cursor: 'pointer', flexShrink: 0 }}
                                >
                                    GO PRO
                                </button>
                            </div>
                        )}

                        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#080808', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about aircraft, routes, pricing..."
                                disabled={isTyping}
                                style={{
                                    flex: 1, padding: '9px 12px', background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none',
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '12px', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(10,191,188,0.4)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isTyping}
                                style={{
                                    width: '36px', height: '36px',
                                    background: !input.trim() || isTyping ? 'rgba(10,191,188,0.15)' : '#0ABFBC',
                                    border: 'none', cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, transition: 'background 0.2s', borderRadius: '9999px',
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={!input.trim() || isTyping ? 'rgba(10,191,188,0.4)' : '#0a0a0a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
