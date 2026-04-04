import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ThreeJetHero from '../components/ThreeJetHero'

/* ─── PRIVACY POLICY MODAL ────────────────────────────────────────── */
function PrivacyModal({ onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                onClick={(e) => e.stopPropagation()}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '40px', maxWidth: '620px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer' }}
                >
                    ✕
                </button>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em', marginBottom: '12px' }}>LEGAL</p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#fff', letterSpacing: '0.05em', marginBottom: '24px' }}>Privacy Policy</h2>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9 }}>
                    <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>Last updated: April 2026</p>

                    <p style={{ marginBottom: '20px' }}>
                        Altus Aero is run by Anirudh Shinde, based in Mumbai, India. Here is what you need to know about how this platform handles your data.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>WHAT WE COLLECT</p>
                    <p style={{ marginBottom: '20px' }}>
                        When you create an account, we collect your email address and name. We also collect basic usage data — which pages you visit and how often you log in. We do not sell your data to anyone.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>HOW WE USE IT</p>
                    <p style={{ marginBottom: '20px' }}>
                        Your data is used to operate the platform and send you account-related emails when necessary. Subscription payments are handled by Razorpay. We do not store your payment details on our side.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>THIRD-PARTY SERVICES</p>
                    <p style={{ marginBottom: '20px' }}>
                        We use Supabase for authentication and data storage, Vercel for hosting, and Razorpay for payments. Each maintains their own privacy policy.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>QUESTIONS</p>
                    <p>
                        Write to <a href="mailto:anirudh.jets@gmail.com" style={{ color: '#D4AF37' }}>anirudh.jets@gmail.com</a> and I will get back to you.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── TERMS OF SERVICE MODAL ─────────────────────────────────────── */
function TermsModal({ onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                onClick={(e) => e.stopPropagation()}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '40px', maxWidth: '620px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer' }}
                >
                    ✕
                </button>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em', marginBottom: '12px' }}>LEGAL</p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#fff', letterSpacing: '0.05em', marginBottom: '24px' }}>Terms of Service</h2>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9 }}>
                    <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>Last updated: April 2026</p>

                    <p style={{ marginBottom: '20px' }}>
                        By using Altus Aero, you agree to these terms. The platform is operated by Anirudh Shinde, Mumbai, India.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>WHAT THIS PLATFORM IS</p>
                    <p style={{ marginBottom: '20px' }}>
                        Altus Aero is a broker intelligence and education tool. All charter pricing estimates shown are indicative only and not binding quotes. Verify market data independently before presenting anything to a client.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>SUBSCRIPTIONS</p>
                    <p style={{ marginBottom: '20px' }}>
                        Pro subscriptions are billed monthly or annually. You can cancel at any time and your access continues until the end of that billing period. If there is an error with a charge, contact us within 48 hours at anirudh.jets@gmail.com.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>INTELLECTUAL PROPERTY</p>
                    <p style={{ marginBottom: '20px' }}>
                        All content on Altus Aero including broker insights, educational material, and the platform design is owned by Anirudh Shinde. Please do not reproduce or redistribute it without written permission.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>LIABILITY</p>
                    <p style={{ marginBottom: '20px' }}>
                        Altus Aero is not liable for business decisions made based on data from the platform. Always verify independently before acting on anything shown here.
                    </p>

                    <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.08em' }}>QUESTIONS</p>
                    <p>
                        Write to <a href="mailto:anirudh.jets@gmail.com" style={{ color: '#D4AF37' }}>anirudh.jets@gmail.com</a>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── NAV ─────────────────────────────────────────────────────────── */
function Nav() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const links = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how' },
        { label: 'Pricing', href: '#pricing' },
    ]

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
            style={{
                background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
                borderBottom: scrolled ? '1px solid rgba(28,28,28,0.8)' : 'none',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="font-display text-gold text-2xl tracking-widest">ALTUS</span>
                    <span className="text-xs font-mono bg-gold text-jet px-2 py-0.5 rounded font-bold tracking-wider">AERO</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="font-mono text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wider">
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="font-mono text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg border border-[#1c1c1c] hover:border-gold/40 transition-all duration-200 tracking-wider">
                        SIGN IN
                    </Link>
                    <Link to="/login" className="font-mono text-xs text-jet bg-gold hover:bg-gold/90 px-5 py-2 rounded-lg font-bold tracking-wider transition-all duration-200">
                        START FREE
                    </Link>
                </div>

                <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 group" aria-label="Toggle menu">
                    <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-5 rotate-45 translate-y-[5px]' : 'w-5'}`} />
                    <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
                    <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-5 -rotate-45 -translate-y-[5px]' : 'w-5'}`} />
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                        style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid #1c1c1c' }}
                    >
                        <div className="px-6 py-4 space-y-1">
                            {links.map((l) => (
                                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block font-mono text-sm text-gray-400 hover:text-white py-3 border-b border-[#1c1c1c] tracking-wider transition-colors">
                                    {l.label}
                                </a>
                            ))}
                            <div className="pt-4 flex flex-col gap-2">
                                <Link to="/login" onClick={() => setOpen(false)} className="block text-center font-mono text-xs text-gray-400 border border-[#1c1c1c] py-3 rounded-lg tracking-wider">SIGN IN</Link>
                                <Link to="/login" onClick={() => setOpen(false)} className="block text-center font-mono text-xs text-jet bg-gold py-3 rounded-lg font-bold tracking-wider">START FREE</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

/* ─── REVEAL WRAPPER ───────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0"><ThreeJetHero /></div>
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
            <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.7) 70%, #0a0a0a 100%)' }} />

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex items-center gap-2 mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase">Broker Intelligence Platform</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="font-display text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight mb-6">
                    THE BROKER WHO
                    <br />
                    <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(212,175,55,0.7)' }}>EDUCATES</span>
                    <br />
                    CLOSES.
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }} className="font-body text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    Altus Aero gives you the market intelligence, fleet knowledge, and client tools to close deals with confidence — not guesswork.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/login" className="w-full sm:w-auto font-display text-sm text-jet px-8 py-3.5 rounded-lg tracking-widest transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5" style={{ background: '#D4AF37' }}>
                        START FOR FREE
                    </Link>
                    <a href="#features" className="w-full sm:w-auto font-display text-sm text-white px-8 py-3.5 rounded-lg tracking-widest border border-[#1c1c1c] hover:border-gold/40 hover:bg-white/5 transition-all duration-200">
                        SEE WHAT'S INSIDE
                    </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mt-16 flex flex-wrap items-center justify-center gap-8">
                    {[
                        { value: '14+', label: 'Aircraft Profiles' },
                        { value: '4,400nm', label: 'Longest tracked route' },
                        { value: '200hrs', label: 'Charter breakeven' },
                        { value: '2026', label: 'Market ready' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-display text-2xl text-gold">{s.value}</p>
                            <p className="font-mono text-xs text-gray-600 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="font-mono text-xs text-gray-600 tracking-widest">SCROLL</span>
                <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} className="text-gray-600 text-xs">↓</motion.span>
            </motion.div>
        </section>
    )
}

/* ─── MANIFESTO ────────────────────────────────────────────────────── */
function Manifesto() {
    return (
        <section style={{ borderTop: '1px solid #1c1c1c', borderBottom: '1px solid #1c1c1c', background: 'rgba(14,14,14,0.9)', padding: '64px 24px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <Reveal>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>Our Philosophy</p>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(22px, 4vw, 36px)', color: '#ffffff', lineHeight: 1.25, letterSpacing: '0.02em' }}>
                        The world's first platform that{' '}
                        <span style={{ color: '#D4AF37' }}>teaches you to become a jet broker</span>{' '}
                        while giving you the tools to{' '}
                        <span style={{ color: '#D4AF37' }}>operate like one.</span>
                    </p>
                    <div style={{ width: '48px', height: '1px', background: 'rgba(212,175,55,0.4)', margin: '32px auto 0' }} />
                </Reveal>
            </div>
        </section>
    )
}

/* ─── FEATURES ────────────────────────────────────────────────────── */
const featureTabs = [
    {
        id: 'intel', label: 'Market Intel', badge: 'Pro',
        title: 'Know the market. Lead every conversation.',
        description: 'Live market signals with broker context on every data point. Real-time charter demand, pre-owned valuations, and route intelligence — all annotated with what it means for your next deal. Free users see 24hr delayed data.',
        points: ['Live charter demand signals by region', 'Pre-owned market valuations updated regularly', 'Route activity with broker context on each signal', 'Free: 24hr delayed. Pro: real-time.'],
        visual: 'intel',
    },
    {
        id: 'fleet', label: 'Fleet Intelligence', badge: 'Free',
        title: 'Know every aircraft before your client asks.',
        description: 'Full specs on every aircraft in the database — range, speed, cabin dimensions, performance data. With Broker Insights on how to position each one, a 3D cockpit view, and side-by-side comparison for Pro users.',
        points: ['Full technical specs — descriptions never truncated', 'Broker Insight: how to position each aircraft (Pro)', '3D cockpit view per aircraft (Pro)', 'Compare up to 3 jets side by side (Pro)'],
        visual: 'fleet',
    },
    {
        id: 'track', label: 'Track', badge: 'Pro',
        title: 'See what is flying and where — right now.',
        description: 'Live flight intelligence via AviationStack. Know which routes are active, which aircraft are operating them, and what the route demand data means for your positioning. Free users see previous day data.',
        points: ['Live flight tracking on interactive map', 'Route demand context with broker annotations', 'Aircraft type filter by category', 'Free: previous day. Pro: live real-time.'],
        visual: 'track',
    },
    {
        id: 'plan', label: 'Plan', badge: 'Free',
        title: 'Calculate any charter cost. Frame it for the client.',
        description: 'Input any route, aircraft category, and passenger count. Get an estimated charter cost — with client framing built in for Pro users. Not just a number, but how to present it so the client understands the value.',
        points: ['Cost calculator with manual input fields — no sliders', 'Client framing block — how to present the number (Pro)', 'Route optimisation — best aircraft for the budget (Pro)', 'No artificial limits on calculations'],
        visual: 'plan',
    },
    {
        id: 'chatbot', label: 'AI Advisor', badge: 'Pro',
        title: 'A senior aviation advisor. On demand.',
        description: 'Pro subscribers get the Altus Aero AI Advisor — powered by Claude. Ask it anything: aircraft range, how to handle a price objection, what aircraft suits a specific route, how to structure a deal. It answers like a 20-year industry veteran.',
        points: ['Aircraft performance and route qualification', 'Sales positioning and objection handling', 'Deal structure and negotiation guidance', 'Available instantly — no waiting, no appointments'],
        visual: 'chatbot',
    },
]

function Features() {
    const [active, setActive] = useState('intel')
    const tab = featureTabs.find((t) => t.id === active)

    return (
        <section id="features" className="py-24 md:py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Platform Features</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Built for brokers who<br /><span className="text-gold">take the time to learn.</span></h2>
                    <p className="font-body text-gray-400 max-w-lg">Steve Varsano's principle: educate the client, and the sale takes care of itself. Every tool in Altus Aero is built on that belief.</p>
                </Reveal>

                <Reveal delay={0.1} className="mt-12">
                    <div className="flex flex-wrap gap-2">
                        {featureTabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActive(t.id)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all duration-200 border ${active === t.id ? 'border-gold bg-gold/10 text-gold' : 'border-[#1c1c1c] text-gray-500 hover:border-[#333] hover:text-gray-300'}`}
                            >
                                {t.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${t.badge === 'Free' ? 'bg-green-400/10 text-green-400' : 'bg-gold/10 text-gold'}`}>{t.badge}</span>
                            </button>
                        ))}
                    </div>
                </Reveal>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center"
                    >
                        <div className="p-8 rounded-2xl border border-[#1c1c1c]" style={{ background: 'rgba(14,14,14,0.8)' }}>
                            <p className="font-mono text-xs text-gold tracking-widest mb-4">{tab.badge === 'Free' ? 'FREE FEATURE' : 'PRO FEATURE'}</p>
                            <h3 className="font-display text-3xl text-white mb-4 leading-tight">{tab.title}</h3>
                            <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">{tab.description}</p>
                            <ul className="space-y-2.5">
                                {tab.points.map((p, i) => (
                                    <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                                        <span className="text-gold mt-0.5 flex-shrink-0">✓</span>{p}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-2xl border border-gold/20 min-h-64 flex flex-col justify-center" style={{ background: 'rgba(212,175,55,0.03)' }}>
                            {tab.visual === 'intel' && (
                                <div className="space-y-4">
                                    <p className="font-mono text-xs text-gray-600 tracking-widest">LIVE MARKET SIGNALS</p>
                                    {[
                                        { label: 'Charter Demand Index', value: '+12%', positive: true, note: 'vs last month' },
                                        { label: 'Pre-owned Values', value: '-8%', positive: false, note: 'Q1 2026 correction' },
                                        { label: 'VABB Active Flights', value: '47', positive: true, note: 'right now' },
                                    ].map((d, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#1c1c1c] bg-[#0d0d0d]">
                                            <div>
                                                <p className="font-mono text-xs text-gray-500">{d.label}</p>
                                                <p className="font-mono text-xs text-gray-600 mt-0.5">{d.note}</p>
                                            </div>
                                            <p className={`font-display text-2xl ${d.positive ? 'text-green-400' : 'text-gold'}`}>{d.value}</p>
                                        </div>
                                    ))}
                                    <div className="p-3 rounded-lg border border-gold/20 bg-gold/5">
                                        <p className="font-mono text-xs text-gold mb-1">BROKER CONTEXT</p>
                                        <p className="font-body text-xs text-gray-300 leading-relaxed">Pre-owned values at 3-year low — buyer's market. Urgency argument is legitimate right now.</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'fleet' && (
                                <div className="space-y-4">
                                    <p className="font-mono text-xs text-gray-600 tracking-widest">AIRCRAFT PROFILE</p>
                                    <p className="font-display text-5xl text-gold">G650ER</p>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {[{ label: 'Range', value: '7,500nm' }, { label: 'Speed', value: '516 kts' }, { label: 'Category', value: 'Ultra Long Range' }, { label: 'Passengers', value: '13-18' }].map((d, i) => (
                                            <div key={i} className="p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                                                <p className="font-mono text-xs text-gray-600">{d.label}</p>
                                                <p className="font-display text-base text-white mt-1">{d.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-l-2 border-gold pl-4">
                                        <p className="font-mono text-xs text-gold uppercase tracking-widest mb-1">Broker Insight — Pro</p>
                                        <p className="font-body text-xs text-gray-400 leading-relaxed">Lead with nonstop capability on routes where competitors require a tech stop. Most ultra-long-range clients choose the premium once they see the time saved.</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'track' && (
                                <div className="space-y-3">
                                    <p className="font-mono text-xs text-gray-600 tracking-widest">LIVE FLIGHT INTELLIGENCE</p>
                                    {[
                                        { route: 'VABB → EGLL', aircraft: 'G650ER', status: 'En Route', progress: 62 },
                                        { route: 'VABB → OMDB', aircraft: 'Global 7500', status: 'En Route', progress: 78 },
                                        { route: 'VABB → YSSY', aircraft: 'G700', status: 'Scheduled', progress: 0 },
                                    ].map((f, i) => (
                                        <div key={i} className="p-3 rounded-xl border border-[#1c1c1c] bg-[#0d0d0d]">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="font-mono text-xs text-white">{f.route}</p>
                                                <span className={`font-mono text-xs px-2 py-0.5 rounded border ${f.status === 'En Route' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-gold border-gold/20 bg-gold/10'}`}>{f.status}</span>
                                            </div>
                                            <p className="font-mono text-xs text-gray-500 mb-2">{f.aircraft}</p>
                                            {f.progress > 0 && <div className="h-1 bg-[#1c1c1c] rounded-full"><div className="h-1 bg-gold rounded-full" style={{ width: `${f.progress}%` }} /></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {tab.visual === 'plan' && (
                                <div className="space-y-4">
                                    <p className="font-mono text-xs text-gray-600 tracking-widest">COST CALCULATOR</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[{ label: 'Origin', value: 'VABB — Mumbai' }, { label: 'Destination', value: 'EGLL — London' }, { label: 'Passengers', value: '8 pax' }, { label: 'Aircraft', value: 'Ultra Long Range' }].map((d, i) => (
                                            <div key={i} className="p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                                                <p className="font-mono text-xs text-gray-600">{d.label}</p>
                                                <p className="font-display text-sm text-white mt-1">{d.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
                                        <p className="font-mono text-xs text-gold mb-1">ESTIMATED CHARTER COST</p>
                                        <p className="font-display text-3xl text-white">$122k – $154k</p>
                                        <p className="font-mono text-xs text-gray-500 mt-1">One way · G650ER class</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                                        <p className="font-mono text-xs text-gray-500 mb-1">PRO: CLIENT FRAMING</p>
                                        <p className="font-body text-xs text-gray-400 leading-relaxed">"At ~$137k for 8 passengers, that is $17k per seat — comparable to four business class tickets but with full privacy and no connections."</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'chatbot' && (
                                <div className="space-y-3">
                                    <p className="font-mono text-xs text-gray-600 tracking-widest">AI ADVISOR — PRO</p>
                                    <div className="flex justify-end">
                                        <div className="bg-gulf/20 border border-gulf/30 rounded-xl rounded-br-sm px-4 py-3 max-w-xs">
                                            <p className="font-body text-sm text-white">Which jet for Mumbai to London with 8 passengers?</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl rounded-bl-sm px-4 py-3 max-w-xs">
                                            <p className="font-mono text-xs text-gold mb-1.5">ADVISOR</p>
                                            <p className="font-body text-sm text-gray-300 leading-relaxed">G650ER qualifies nonstop at 4,387nm with reserves. Charter rate ~$14,000/hr. It is the standard on this route — operators know it, clients trust it.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 px-4 py-3 border border-[#1c1c1c] rounded-xl bg-[#0d0d0d]">
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', display: 'inline-block', flexShrink: 0 }} />
                                        <span className="font-mono text-xs text-gray-500">Advisor is typing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

/* ─── CHATBOT SHOWCASE ─────────────────────────────────────────────── */
function ChatbotShowcase() {
    return (
        <section className="py-24 md:py-32 px-6" style={{ background: 'rgba(14,14,14,0.6)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 mb-5">
                            <span className="font-mono text-xs text-jet bg-gold px-2.5 py-1 rounded font-bold tracking-wider">PRO FEATURE</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight">A 20-year aviation<br /><span className="text-gold">advisor. On demand.</span></h2>
                        <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">Pro subscribers get the Altus Aero AI Advisor — powered by Claude AI. Ask it anything relevant to a working jet broker: aircraft specs, route qualification, how to handle price objections, deal structure, negotiation angles. It answers in seconds with the depth of an industry veteran.</p>
                        <ul className="space-y-2.5 mb-8">
                            {['Aircraft performance, range, and route qualification', 'Sales positioning and objection handling — specific to aviation', 'Deal structure guidance and negotiation tactics', 'Available 24/7 — no waiting, no appointments'].map((p, i) => (
                                <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                                    <span className="text-gold mt-0.5 flex-shrink-0">✓</span>{p}
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" className="inline-block font-display text-sm text-jet px-8 py-3.5 rounded-xl tracking-widest font-bold hover:opacity-90 transition-opacity" style={{ background: '#D4AF37' }}>GET PRO ACCESS</Link>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div className="p-6 rounded-2xl border border-[#1c1c1c]" style={{ background: '#0d0d0d' }}>
                            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#1c1c1c]">
                                <div className="w-10 h-10 rounded-full bg-[#1e3a8a] border border-gold/20 flex items-center justify-center flex-shrink-0">
                                    <span className="font-display text-xs text-gold">AI</span>
                                </div>
                                <div>
                                    <p className="font-display text-sm text-gold tracking-widest">ALTUS AI ADVISOR</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span className="font-mono text-xs text-gray-500">Pro · Aviation broker intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <div className="bg-gulf/20 border border-gulf/30 rounded-xl rounded-br-sm px-4 py-3" style={{ maxWidth: '85%' }}>
                                        <p className="font-body text-sm text-white">Which aircraft for Mumbai to London with 8 passengers?</p>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="border border-[#1c1c1c] rounded-xl rounded-bl-sm px-4 py-3" style={{ maxWidth: '90%', background: 'rgba(255,255,255,0.03)' }}>
                                        <p className="font-mono text-xs text-gold mb-1.5">ADVISOR</p>
                                        <p className="font-body text-sm text-gray-200 leading-relaxed">G650ER at 4,387nm qualifies nonstop with reserves. Charter rate ~$14,000/hr. Standard recommendation on this route — operators know it, clients trust it. Show the G700 side by side if budget allows.</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-gulf/20 border border-gulf/30 rounded-xl rounded-br-sm px-4 py-3" style={{ maxWidth: '85%' }}>
                                        <p className="font-body text-sm text-white">Client says it's too expensive. What do I say?</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-3 border border-[#1c1c1c] rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    {[0, 1, 2].map((dot) => (
                                        <motion.span key={dot} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
                                    ))}
                                    <span className="font-mono text-xs text-gray-500 ml-1">Advisor is typing...</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

/* ─── FOUNDER ─────────────────────────────────────────────────────── */
function Founder() {
    return (
        <section id="founder" className="py-20 md:py-28 px-6">
            <div className="max-w-3xl mx-auto">
                <Reveal>
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-10 text-center">Behind the Platform</p>
                    <div
                        className="rounded-2xl p-8 md:p-10 border border-[#1c1c1c] relative overflow-hidden"
                        style={{ background: 'rgba(14,14,14,0.8)' }}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                        <div className="flex flex-col sm:flex-row gap-7 items-start relative z-10">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: '#1e3a8a',
                                        border: '2px solid rgba(212,175,55,0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#D4AF37', letterSpacing: '0.05em' }}>AS</span>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', color: '#fff', letterSpacing: '0.05em' }}>Anirudh Shinde</p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.1em', marginTop: '2px' }}>FOUNDER</p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em', marginTop: '2px' }}>Mumbai, India</p>
                                </div>
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                                <p
                                    style={{
                                        fontFamily: 'Bebas Neue, sans-serif',
                                        fontSize: 'clamp(18px, 2.5vw, 24px)',
                                        color: '#fff',
                                        lineHeight: 1.25,
                                        letterSpacing: '0.03em',
                                        marginBottom: '16px',
                                    }}
                                >
                                    I NEEDED THIS TOOL. SO I BUILT IT.
                                </p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.85, marginBottom: '14px' }}>
                                    I got into private aviation through research rather than experience. The more I studied how brokerage actually worked, the more I noticed how much brokers were expected to just know things their clients didn't. There wasn't much to bridge that gap.
                                </p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.85, marginBottom: '14px' }}>
                                    Steve Varsano's approach made sense to me from the first time I came across it. Educate the client before you try to sell them anything. It's the most honest way to operate in this industry.
                                </p>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.85 }}>
                                    Altus Aero is the platform I needed when I was starting out. The aircraft, the market signals, the deal structure — all in one place. The broker who educates closes. That's the whole idea.
                                </p>

                                <div style={{ marginTop: '22px' }}>
                                    <a
                                        href="mailto:anirudh.jets@gmail.com"
                                        style={{
                                            fontFamily: 'JetBrains Mono, monospace',
                                            fontSize: '11px',
                                            color: 'rgba(255,255,255,0.35)',
                                            letterSpacing: '0.08em',
                                            textDecoration: 'none',
                                            padding: '7px 12px',
                                            borderRadius: '7px',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            transition: 'all 0.2s',
                                            display: 'inline-block',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                                    >
                                        anirudh.jets@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

/* ─── HOW IT WORKS ────────────────────────────────────────────────── */
function HowItWorks() {
    const steps = [
        { num: '01', title: 'Learn the aircraft', body: 'Start with Fleet. Every aircraft — full specs, range, cabin dimensions, and Broker Insights on how to position each one. Know the G650ER from the Global 7500 before your first client call.' },
        { num: '02', title: 'Know the market', body: 'Intel surfaces live market signals with broker context on every data point. Track which routes are active, where demand is building, and what the pre-owned market is doing — before your competition does.' },
        { num: '03', title: 'Close with confidence', body: 'Plan any route. Calculate charter costs. Frame the number for the client. Use the AI advisor to handle objections. Walk into every meeting knowing the aircraft, the market, and the deal.' },
    ]

    return (
        <section id="how" className="py-24 md:py-32 px-6" style={{ background: 'rgba(14,14,14,0.5)' }}>
            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">How It Works</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Three steps to becoming<br /><span className="text-gold">the broker clients trust.</span></h2>
                </Reveal>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1c1c1c] rounded-2xl overflow-hidden">
                    {steps.map((s, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                            <div className="p-8 h-full" style={{ background: '#0a0a0a' }}>
                                <p className="font-display text-6xl text-gold/20 mb-6">{s.num}</p>
                                <h3 className="font-display text-xl text-white mb-3">{s.title}</h3>
                                <p className="font-body text-gray-400 text-sm leading-relaxed">{s.body}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── PRICING ─────────────────────────────────────────────────────── */
function Pricing() {
    const [annual, setAnnual] = useState(false)

    const freeFeatures = [
        'Fleet — browse all aircraft profiles with full specs',
        'Basic cost calculator with route inputs',
        'Market Intel — 24hr delayed data',
        'Flight tracking — previous day data',
        'Dashboard with market education content',
    ]

    const proFeatures = [
        'Everything in Free',
        'Fleet — Broker Insight on every aircraft',
        'Fleet — 3D cockpit view per aircraft',
        'Fleet — compare up to 3 jets side by side',
        'Intel — live real-time market data',
        'Track — live real-time flight tracking',
        'Plan — client framing and route optimisation',
        'AI Advisor — powered by Claude AI',
    ]

    return (
        <section id="pricing" className="py-24 md:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <Reveal className="text-center mb-16">
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Pricing</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Learn for free.<br /><span className="text-gold">Close with Pro.</span></h2>
                    <p className="font-body text-gray-400 max-w-md mx-auto">No credit card needed to start. Upgrade when you are ready to use the full toolkit.</p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <span className={`font-mono text-xs ${!annual ? 'text-gold' : 'text-gray-500'}`}>Monthly</span>
                        <button onClick={() => setAnnual(!annual)} className={`w-11 h-6 rounded-full transition-colors relative ${annual ? 'bg-gold' : 'bg-[#1c1c1c]'}`}>
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-jet transition-transform ${annual ? 'translate-x-5' : ''}`} />
                        </button>
                        <span className={`font-mono text-xs ${annual ? 'text-gold' : 'text-gray-500'}`}>Annual <span className="text-green-400">save 20%</span></span>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    <Reveal delay={0.05}>
                        <div className="p-8 rounded-2xl border border-[#1c1c1c] h-full flex flex-col" style={{ background: '#0d0d0d' }}>
                            <div>
                                <p className="font-display text-2xl text-white mb-1">Free</p>
                                <p className="font-mono text-xs text-gray-500 mb-6">Learn the market — always free</p>
                                <p className="font-display text-5xl text-white mb-8">₹0<span className="text-base text-gray-500 font-body"> / forever</span></p>
                                <ul className="space-y-3 mb-8">
                                    {freeFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-400">
                                            <span className="text-gold mt-0.5 flex-shrink-0">✓</span>{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link to="/login" className="mt-auto block text-center font-display text-sm tracking-widest py-3 rounded-xl border border-[#1c1c1c] text-gray-500 hover:border-gold/30 hover:text-white transition-all duration-200">
                                GET STARTED FREE
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="p-8 rounded-2xl border h-full flex flex-col relative overflow-hidden" style={{ background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.3)' }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-display text-2xl text-white">Pro</p>
                                    <span className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded font-bold">RECOMMENDED</span>
                                </div>
                                <p className="font-mono text-xs text-gold mb-6">Full platform + AI advisor</p>
                                <p className="font-display text-5xl text-white mb-1">₹{annual ? '1,999' : '2,499'}<span className="text-base text-gray-500 font-body"> /mo</span></p>
                                {annual && <p className="font-mono text-xs text-green-400 mb-1">₹23,988 billed annually — you save ₹6,000</p>}
                                <p className="font-mono text-xs text-gray-600 mb-6">{annual ? 'Billed once a year' : 'Switch to annual, save ₹6,000/year'}</p>
                                <ul className="space-y-3 mb-8">
                                    {proFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                                            <span className="text-gold mt-0.5 flex-shrink-0">✓</span>{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link to="/login" className="mt-auto block text-center font-display text-sm text-jet tracking-widest py-3 rounded-xl font-bold hover:opacity-90 transition-all duration-200" style={{ background: '#D4AF37' }}>
                                {annual ? 'UPGRADE — ₹23,988/yr' : 'UPGRADE — ₹2,499/mo'}
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

/* ─── CTA BANNER ─────────────────────────────────────────────────── */
function CTABanner() {
    return (
        <section className="py-24 px-6" style={{ background: 'rgba(14,14,14,0.5)' }}>
            <Reveal>
                <div className="max-w-4xl mx-auto rounded-2xl p-12 md:p-16 text-center relative overflow-hidden border border-gold/20" style={{ background: 'rgba(212,175,55,0.04)' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Get Started Today</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Join brokers who learn<br /><span className="text-gold">before they sell.</span></h2>
                    <p className="font-body text-gray-400 mb-8 max-w-md mx-auto">Free forever for the essentials. Pro when you are ready to close at a professional level.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/login" className="w-full sm:w-auto font-display text-sm text-jet px-8 py-3.5 rounded-xl tracking-widest font-bold hover:opacity-90 transition-opacity" style={{ background: '#D4AF37' }}>
                            START FOR FREE — NO CARD NEEDED
                        </Link>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}

/* ─── FOOTER ─────────────────────────────────────────────────────── */
function Footer({ onPrivacy, onTerms }) {
    const cols = [
        {
            label: 'Platform',
            links: [
                { title: 'Market Intel', href: '#features' },
                { title: 'Fleet Intelligence', href: '#features' },
                { title: 'Flight Tracking', href: '#features' },
                { title: 'Deal Planning', href: '#features' },
                { title: 'AI Advisor', href: '#features' },
                { title: 'Pricing', href: '#pricing' },
            ],
        },
        {
            label: 'Learn',
            links: [
                { title: 'How It Works', href: '#how' },
                { title: 'Charter vs Ownership', href: '#features' },
                { title: 'Aircraft Categories', href: '#features' },
                { title: 'Broker Intelligence', href: '#features' },
            ],
        },
        {
            label: 'Company',
            links: [
                { title: 'About', href: '#founder' },
                { title: 'Contact', href: 'mailto:anirudh.jets@gmail.com' },
            ],
        },
    ]

    return (
        <footer className="border-t border-[#1c1c1c] px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-display text-gold text-xl tracking-widest">ALTUS</span>
                            <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
                        </div>
                        <p className="font-body text-gray-500 text-sm leading-relaxed mb-4">Broker intelligence built on the Varsano method. Teach first. Sell second.</p>
                        <p className="font-mono text-xs text-gray-700">Mumbai, India · 2026</p>
                    </div>

                    {cols.map((col) => (
                        <div key={col.label}>
                            <p className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4">{col.label}</p>
                            <ul className="space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.title}>
                                        <a href={l.href} className="font-body text-sm text-gray-600 hover:text-gray-300 transition-colors">
                                            {l.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-[#1c1c1c] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-mono text-xs text-gray-700">© 2026 Altus Aero · Anirudh Shinde. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onPrivacy}
                            className="font-mono text-xs text-gray-600 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <span className="font-mono text-xs text-gray-800">·</span>
                        <button
                            onClick={onTerms}
                            className="font-mono text-xs text-gray-600 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────────── */
export default function Index() {
    const [showPrivacy, setShowPrivacy] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
            <Nav />
            <Hero />
            <Manifesto />
            <Features />
            <ChatbotShowcase />
            <Founder />
            <HowItWorks />
            <Pricing />
            <CTABanner />
            <Footer onPrivacy={() => setShowPrivacy(true)} onTerms={() => setShowTerms(true)} />

            <AnimatePresence>
                {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
            </AnimatePresence>
        </div>
    )
}