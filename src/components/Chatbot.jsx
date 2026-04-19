import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }

export default function Chatbot() {
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
                            <div>
                                <p style={{ ...MONO, fontSize: '11px', color: '#0ABFBC', letterSpacing: '0.15em', lineHeight: 1.2 }}>ALTUS AI ADVISOR</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                                    <span style={{ ...MONO, fontSize: '9px', color: '#444', letterSpacing: '0.06em' }}>Aviation broker intelligence</span>
                                </div>
                            </div>
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
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    transition: 'background 0.2s', borderRadius: '9999px',
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
