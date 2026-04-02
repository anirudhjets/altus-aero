import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chatbot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Welcome to Altus Aero. I am your aviation broker advisor. Ask me anything — aircraft specs, charter vs ownership, route planning, deal structures, or how to navigate the platform.',
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [open])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const send = async () => {
        const text = input.trim()
        if (!text || loading) return

        const userMsg = { role: 'user', content: text }
        const next = [...messages, userMsg]
        setMessages(next)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    conversation_history: messages,
                }),
            })
            const data = await res.json()
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Could not reach the advisor. Check your connection and try again.' }])
        }

        setLoading(false)
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 transition-all duration-200 hover:scale-105"
                style={{ background: '#1e3a8a', border: '1px solid rgba(212,175,55,0.3)' }}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} className="text-white text-xl">
                            ✕
                        </motion.span>
                    ) : (
                        <motion.svg key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </button>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        style={{
                            width: 'min(420px, calc(100vw - 48px))',
                            height: 'min(560px, calc(100vh - 160px))',
                            background: '#0d0d0d',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c1c1c]" style={{ background: '#111111' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gulf flex items-center justify-center">
                                    <span className="text-xs text-gold font-mono font-bold">AA</span>
                                </div>
                                <div>
                                    <p className="font-display text-sm text-white tracking-wider">BROKER ADVISOR</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="font-mono text-xs text-gray-500">Online</span>
                                    </div>
                                </div>
                            </div>
                            <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded">PRO</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className="max-w-[85%] px-4 py-3 rounded-2xl"
                                        style={{
                                            background: msg.role === 'user' ? '#1e3a8a' : '#1a1a1a',
                                            border: msg.role === 'assistant' ? '1px solid #1c1c1c' : 'none',
                                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        }}
                                    >
                                        <p className="font-body text-sm text-white leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 rounded-2xl border border-[#1c1c1c]" style={{ background: '#1a1a1a', borderRadius: '18px 18px 18px 4px' }}>
                                        <div className="flex items-center gap-1.5">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-gold"
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-[#1c1c1c]" style={{ background: '#111111' }}>
                            <div className="flex items-end gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Ask anything about aviation, aircraft, or deals..."
                                    rows={1}
                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 resize-none"
                                    style={{ maxHeight: '100px' }}
                                />
                                <button
                                    onClick={send}
                                    disabled={!input.trim() || loading}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                    style={{
                                        background: input.trim() && !loading ? '#D4AF37' : '#1a1a1a',
                                        border: '1px solid',
                                        borderColor: input.trim() && !loading ? '#D4AF37' : '#2a2a2a',
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() && !loading ? '#0a0a0a' : '#4b5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <p className="font-mono text-xs text-gray-700 mt-2 text-center">
                                Aviation, sales, deal structures, platform navigation
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}