import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ThreeJetHero from '../components/ThreeJetHero'

/* ─── SHARED STYLES ───────────────────────────────────────────────── */
const PILL_PRIMARY = {
    display: 'inline-block',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#0a0a0a',
    background: '#0ABFBC',
    border: '1px solid #0ABFBC',
    borderRadius: '9999px',
    padding: '12px 28px',
    cursor: 'pointer',
    transition: 'opacity 0.25s ease',
    textDecoration: 'none',
}

const PILL_GHOST = {
    display: 'inline-block',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#ffffff',
    background: 'transparent',
    border: '1px solid #ffffff',
    borderRadius: '9999px',
    padding: '12px 28px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textDecoration: 'none',
}

const PILL_GHOST_DIM = {
    ...PILL_GHOST,
    color: '#999999',
    border: '1px solid #999999',
}

const EYEBROW = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#999999',
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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: scrolled ? '14px 0' : '22px 0',
                background: scrolled ? 'rgba(10,10,10,0.96)' : 'transparent',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                backdropFilter: scrolled ? 'blur(24px)' : 'none',
                transition: 'all 0.4s ease',
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <Link to="/" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ffffff', letterSpacing: '0.35em' }}>ALTUS AERO</span>
                    <div className="logo-line" style={{ height: '1px', width: '100%', background: '#0ABFBC', transition: 'box-shadow 0.4s ease', borderRadius: '1px' }} />
                  </div>
                </Link>

                <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '2px' }}>
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            style={{ ...EYEBROW, color: '#999999', padding: '10px 20px', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#999999'}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
                    <Link
                        to="/login"
                        style={PILL_GHOST_DIM}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#999999'; e.currentTarget.style.color = '#999999' }}
                    >
                        SIGN IN
                    </Link>
                    <Link
                        to="/login"
                        style={PILL_PRIMARY}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        START FREE
                    </Link>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}
                    aria-label="Toggle menu"
                >
                    <span style={{ display: 'block', height: '1px', width: '22px', background: open ? '#0ABFBC' : '#999999', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                    <span style={{ display: 'block', height: '1px', width: '16px', background: '#999999', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
                    <span style={{ display: 'block', height: '1px', width: '22px', background: open ? '#0ABFBC' : '#999999', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => document.querySelector(l.href)?.scrollIntoView({behavior:'smooth'}), 80) }}
                                    style={{ ...EYEBROW, color: '#999999', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', display: 'block' }}
                                >
                                    {l.label}
                                </a>
                            ))}
                            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link to="/login" onClick={() => setOpen(false)} style={{ ...PILL_GHOST_DIM, textAlign: 'center' }}>SIGN IN</Link>
                                <Link to="/login" onClick={() => setOpen(false)} style={{ ...PILL_PRIMARY, textAlign: 'center' }}>START FREE</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

/* ─── REVEAL WRAPPER ───────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
            style={style}
        >
            {children}
        </motion.div>
    )
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function Hero() {
    return (
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0a0a0a' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><ThreeJetHero /></div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,10,10,0.6) 100%)' }} />

            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '1100px', margin: '0 auto', paddingTop: '96px' }}>

                <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ ...EYEBROW, color: '#0ABFBC', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                    <span style={{ display: 'inline-block', width: '32px', height: '1px', background: '#0ABFBC', opacity: 0.5 }} />
                    Broker Intelligence Platform
                    <span style={{ display: 'inline-block', width: '32px', height: '1px', background: '#0ABFBC', opacity: 0.5 }} />
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35 }}
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(72px, 13vw, 180px)',
                        lineHeight: 1.0,
                        letterSpacing: '0.02em',
                        color: '#ffffff',
                        marginBottom: '0',
                    }}
                >
                    THE BROKER
                    <br />
                    <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(10,191,188,0.6)' }}>WHO EDUCATES</span>
                    <br />
                    CLOSES.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#999999', maxWidth: '480px', margin: '32px auto 48px', lineHeight: 1.7 }}
                >
                    Market intelligence, fleet knowledge, and client tools — built for brokers who close with confidence, not guesswork.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.75 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
                >
                    <Link
                        to="/login"
                        style={PILL_PRIMARY}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        START FOR FREE
                    </Link>
                    <a
                        href="#features"
                        style={PILL_GHOST}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        SEE WHAT'S INSIDE
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.1 }}
                    style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}
                >
                    {[
                        { value: '14+', label: 'Aircraft Profiles' },
                        { value: '4,400nm', label: 'Longest tracked route' },
                        { value: '200hrs', label: 'Charter breakeven' },
                        { value: '2026', label: 'Market ready' },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#0ABFBC', lineHeight: 1 }}>{s.value}</p>
                            <p style={{ ...EYEBROW, color: '#999999', marginTop: '6px', fontSize: '10px' }}>{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}
            >
                <span style={{ ...EYEBROW, fontSize: '10px', color: '#444' }}>SCROLL</span>
                <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} style={{ color: '#444', fontSize: '12px' }}>↓</motion.span>
            </motion.div>
        </section>
    )
}

/* ─── MANIFESTO ────────────────────────────────────────────────────── */
function Manifesto() {
    return (
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', padding: '96px 24px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <Reveal>
                    <p style={{ ...EYEBROW, marginBottom: '32px' }}>Our Philosophy</p>
                    <p style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(28px, 5vw, 56px)',
                        color: '#ffffff',
                        lineHeight: 1.05,
                        letterSpacing: '0.02em',
                    }}>
                        The world's first platform that{' '}
                        <span style={{ color: '#0ABFBC' }}>teaches you to become a jet broker</span>{' '}
                        while giving you the tools to{' '}
                        <span style={{ color: '#0ABFBC' }}>operate like one.</span>
                    </p>
                    <div style={{ width: '1px', height: '48px', background: 'rgba(10,191,188,0.3)', margin: '48px auto 0' }} />
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
        <section id="features" style={{ padding: '120px 24px', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Reveal>
                    <p style={{ ...EYEBROW, marginBottom: '20px' }}>Platform Features</p>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginBottom: '16px' }}>
                        BUILT FOR BROKERS WHO<br />
                        <span style={{ color: '#0ABFBC' }}>TAKE THE TIME TO LEARN.</span>
                    </h2>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', maxWidth: '480px', lineHeight: 1.7 }}>
                        Steve Varsano's principle: educate the client, and the sale takes care of itself. Every tool in Altus Aero is built on that belief.
                    </p>
                </Reveal>

                <Reveal delay={0.1} style={{ marginTop: '56px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {featureTabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActive(t.id)}
                                style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '11px',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    padding: '10px 20px',
                                    borderRadius: '9999px',
                                    border: active === t.id ? '1px solid #0ABFBC' : '1px solid rgba(255,255,255,0.12)',
                                    background: active === t.id ? 'rgba(10,191,188,0.08)' : 'transparent',
                                    color: active === t.id ? '#0ABFBC' : '#999999',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                {t.label}
                                <span style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '9px',
                                    letterSpacing: '0.1em',
                                    padding: '2px 7px',
                                    borderRadius: '9999px',
                                    background: t.badge === 'Free' ? 'rgba(74,222,128,0.1)' : 'rgba(10,191,188,0.1)',
                                    color: t.badge === 'Free' ? '#4ade80' : '#0ABFBC',
                                    border: t.badge === 'Free' ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(10,191,188,0.2)',
                                }}>
                                    {t.badge}
                                </span>
                            </button>
                        ))}
                    </div>
                </Reveal>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="grid-cols-1 md:grid-cols-2" style={{ marginTop: '40px', display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', overflow: 'hidden' }}
                    >
                        <div style={{ background: '#0a0a0a', padding: '48px' }}>
                            <p style={{ ...EYEBROW, color: tab.badge === 'Free' ? '#4ade80' : '#0ABFBC', marginBottom: '20px' }}>
                                {tab.badge === 'Free' ? 'FREE FEATURE' : 'PRO FEATURE'}
                            </p>
                            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 3vw, 44px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginBottom: '20px' }}>
                                {tab.title.toUpperCase()}
                            </h3>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', lineHeight: 1.75, marginBottom: '32px' }}>
                                {tab.description}
                            </p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {tab.points.map((p, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                        <span style={{ color: '#0ABFBC', flexShrink: 0, marginTop: '1px' }}>—</span>{p}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ background: '#080808', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {tab.visual === 'intel' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p style={{ ...EYEBROW, color: '#444', marginBottom: '8px' }}>Live Market Signals</p>
                                    {[
                                        { label: 'Charter Demand Index', value: '+12%', positive: true, note: 'vs last month' },
                                        { label: 'Pre-owned Values', value: '-8%', positive: false, note: 'Q1 2026 correction' },
                                        { label: 'VABB Active Flights', value: '47', positive: true, note: 'right now' },
                                    ].map((d, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                                            <div>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#999999' }}>{d.label}</p>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', marginTop: '3px' }}>{d.note}</p>
                                            </div>
                                            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: d.positive ? '#4ade80' : '#0ABFBC', lineHeight: 1 }}>{d.value}</p>
                                        </div>
                                    ))}
                                    <div style={{ padding: '16px 20px', border: '1px solid rgba(10,191,188,0.15)', background: 'rgba(10,191,188,0.03)', marginTop: '4px' }}>
                                        <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px', marginBottom: '8px' }}>Broker Context</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#999999', lineHeight: 1.65 }}>Pre-owned values at 3-year low — buyer's market. Urgency argument is legitimate right now.</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'fleet' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <p style={{ ...EYEBROW, color: '#444' }}>Aircraft Profile</p>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '72px', color: '#0ABFBC', lineHeight: 1.0 }}>G650ER</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                                        {[{ label: 'Range', value: '7,500nm' }, { label: 'Speed', value: '516 kts' }, { label: 'Category', value: 'Ultra Long' }, { label: 'Passengers', value: '13–18' }].map((d, i) => (
                                            <div key={i} style={{ padding: '14px 16px', background: '#0a0a0a' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.label}</p>
                                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#ffffff', marginTop: '4px', lineHeight: 1 }}>{d.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderLeft: '1px solid #0ABFBC', paddingLeft: '16px' }}>
                                        <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px', marginBottom: '8px' }}>Broker Insight — Pro</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#999999', lineHeight: 1.65 }}>Lead with nonstop capability on routes where competitors require a tech stop.</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'track' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <p style={{ ...EYEBROW, color: '#444', marginBottom: '8px' }}>Live Flight Intelligence</p>
                                    {[
                                        { route: 'VABB → EGLL', aircraft: 'G650ER', status: 'En Route', progress: 62 },
                                        { route: 'VABB → OMDB', aircraft: 'Global 7500', status: 'En Route', progress: 78 },
                                        { route: 'VABB → YSSY', aircraft: 'G700', status: 'Scheduled', progress: 0 },
                                    ].map((f, i) => (
                                        <div key={i} style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#ffffff' }}>{f.route}</p>
                                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', border: f.status === 'En Route' ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(10,191,188,0.25)', color: f.status === 'En Route' ? '#4ade80' : '#0ABFBC', background: f.status === 'En Route' ? 'rgba(74,222,128,0.06)' : 'rgba(10,191,188,0.06)' }}>{f.status}</span>
                                            </div>
                                            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', marginBottom: f.progress > 0 ? '8px' : 0 }}>{f.aircraft}</p>
                                            {f.progress > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}><div style={{ height: '1px', background: '#0ABFBC', width: `${f.progress}%` }} /></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {tab.visual === 'plan' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p style={{ ...EYEBROW, color: '#444', marginBottom: '8px' }}>Cost Calculator</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
                                        {[{ label: 'Origin', value: 'VABB' }, { label: 'Destination', value: 'EGLL' }, { label: 'Passengers', value: '8 pax' }, { label: 'Category', value: 'Ultra Long' }].map((d, i) => (
                                            <div key={i} style={{ padding: '14px 16px', background: '#0a0a0a' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.label}</p>
                                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#ffffff', marginTop: '4px', lineHeight: 1 }}>{d.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ padding: '20px', border: '1px solid rgba(10,191,188,0.2)', background: 'rgba(10,191,188,0.03)' }}>
                                        <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px', marginBottom: '8px' }}>Estimated Charter Cost</p>
                                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: '#ffffff', lineHeight: 1.0 }}>$122k – $154k</p>
                                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', marginTop: '6px' }}>One way · G650ER class</p>
                                    </div>
                                    <div style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                                        <p style={{ ...EYEBROW, color: '#444', fontSize: '10px', marginBottom: '6px' }}>Pro: Client Framing</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#999999', lineHeight: 1.65 }}>"At ~$137k for 8 passengers, that is $17k per seat — comparable to four business class tickets."</p>
                                    </div>
                                </div>
                            )}
                            {tab.visual === 'chatbot' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p style={{ ...EYEBROW, color: '#444', marginBottom: '8px' }}>AI Advisor — Pro</p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <div style={{ background: 'rgba(10,60,58,0.15)', border: '1px solid rgba(10,60,58,0.3)', padding: '12px 16px', maxWidth: '80%' }}>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ffffff' }}>Which jet for Mumbai to London with 8 passengers?</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', maxWidth: '85%' }}>
                                            <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '9px', marginBottom: '8px' }}>Advisor</p>
                                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999999', lineHeight: 1.65 }}>G650ER qualifies nonstop at 4,387nm with reserves. Charter rate ~$14,000/hr. Standard on this route.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                                        {[0, 1, 2].map((dot) => (
                                            <motion.span key={dot} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0ABFBC', display: 'inline-block' }} />
                                        ))}
                                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444' }}>Advisor is typing...</span>
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
        <section style={{ padding: '120px 24px', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="grid-cols-1 md:grid-cols-2" style={{ display: 'grid', gap: '80px', alignItems: 'center' }}>
                    <Reveal>
                        <span style={{ ...EYEBROW, background: '#0ABFBC', color: '#0a0a0a', padding: '4px 12px', borderRadius: '9999px', display: 'inline-block', marginBottom: '32px' }}>PRO FEATURE</span>
                        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 5vw, 72px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginBottom: '24px' }}>
                            A 20-YEAR AVIATION<br /><span style={{ color: '#0ABFBC' }}>ADVISOR. ON DEMAND.</span>
                        </h2>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', lineHeight: 1.75, marginBottom: '32px' }}>
                            Pro subscribers get the Altus Aero AI Advisor — powered by Claude AI. Ask it anything relevant to a working jet broker: aircraft specs, route qualification, how to handle price objections, deal structure, negotiation angles.
                        </p>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                            {['Aircraft performance, range, and route qualification', 'Sales positioning and objection handling', 'Deal structure guidance and negotiation tactics', 'Available 24/7 — no waiting, no appointments'].map((p, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                                    <span style={{ color: '#0ABFBC', flexShrink: 0 }}>—</span>{p}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/login"
                            style={PILL_PRIMARY}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            GET PRO ACCESS
                        </Link>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0a1a1a', border: '1px solid rgba(10,191,188,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', color: '#0ABFBC' }}>AI</span>
                                </div>
                                <div>
                                    <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px' }}>ALTUS AI ADVISOR</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444' }}>Pro · Aviation broker intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ background: 'rgba(10,60,58,0.15)', border: '1px solid rgba(10,60,58,0.3)', padding: '12px 16px', maxWidth: '85%' }}>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ffffff' }}>Which aircraft for Mumbai to London with 8 passengers?</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', maxWidth: '90%', background: 'rgba(255,255,255,0.02)' }}>
                                        <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '9px', marginBottom: '8px' }}>Advisor</p>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999999', lineHeight: 1.65 }}>G650ER at 4,387nm qualifies nonstop with reserves. Charter rate ~$14,000/hr. Standard recommendation on this route.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ background: 'rgba(10,60,58,0.15)', border: '1px solid rgba(10,60,58,0.3)', padding: '12px 16px', maxWidth: '85%' }}>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ffffff' }}>Client says it's too expensive. What do I say?</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                                    {[0, 1, 2].map((dot) => (
                                        <motion.span key={dot} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0ABFBC', display: 'inline-block' }} />
                                    ))}
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', marginLeft: '4px' }}>Advisor is typing...</span>
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
        <section id="founder" style={{ padding: '120px 24px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Reveal>
                    <p style={{ ...EYEBROW, marginBottom: '64px', textAlign: 'center' }}>Behind the Platform</p>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(24px, 5vw, 56px)', position: 'relative', overflow: 'hidden', background: '#080808' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0a1a1a', border: '1px solid rgba(10,191,188,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#0ABFBC' }}>AS</span>
                                </div>
                                <div>
                                    <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px' }}>Founder · Mumbai, Maharashtra</p>
                                </div>
                            </div>

                            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#ffffff', lineHeight: 1.05, letterSpacing: '0.02em' }}>
                                I NEEDED THIS TOOL.<br />SO I BUILT IT.
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    "I got into private aviation through research rather than experience. The more I studied how brokerage actually worked, the more I noticed how much brokers were expected to just know things their clients didn't. There wasn't much to bridge that gap.",
                                    "Steve Varsano's approach made sense to me from the first time I came across it. Educate the client before you try to sell them anything. It's the most honest way to operate in this industry.",
                                    "Altus Aero is the platform I needed when I was starting out. The aircraft, the market signals, the deal structure — all in one place. The broker who educates closes. That's the whole idea.",
                                ].map((para, i) => (
                                    <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', lineHeight: 1.85 }}>{para}</p>
                                ))}
                            </div>

                            <a
                                href="mailto:anirudh.jets@gmail.com"
                                style={{ ...PILL_GHOST_DIM, fontSize: '11px', padding: '10px 20px', alignSelf: 'flex-start' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#999999'; e.currentTarget.style.color = '#999999' }}
                            >
                                anirudh.jets@gmail.com
                            </a>
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
        <section id="how" style={{ padding: '120px 24px', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Reveal>
                    <p style={{ ...EYEBROW, marginBottom: '20px' }}>How It Works</p>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em' }}>
                        THREE STEPS TO BECOMING<br /><span style={{ color: '#0ABFBC' }}>THE BROKER CLIENTS TRUST.</span>
                    </h2>
                </Reveal>
                <div className="grid-cols-1 md:grid-cols-3" style={{ marginTop: '64px', display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                    {steps.map((s, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                            <div style={{ padding: '48px', background: '#080808', height: '100%', boxSizing: 'border-box' }}>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '80px', color: 'rgba(255,255,255,0.04)', lineHeight: 1.0, marginBottom: '24px' }}>{s.num}</p>
                                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '16px' }}>{s.title.toUpperCase()}</h3>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999999', lineHeight: 1.8 }}>{s.body}</p>
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
        <section id="pricing" style={{ padding: '120px 24px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                <Reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ ...EYEBROW, marginBottom: '20px' }}>Pricing</p>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginBottom: '24px' }}>
                        LEARN FOR FREE.<br /><span style={{ color: '#0ABFBC' }}>CLOSE WITH PRO.</span>
                    </h2>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', maxWidth: '360px', margin: '0 auto 32px' }}>No credit card needed to start. Upgrade when you are ready to use the full toolkit.</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: !annual ? '#ffffff' : '#444' }}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            style={{ width: '44px', height: '24px', borderRadius: '9999px', background: annual ? '#0ABFBC' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
                        >
                            <span style={{ position: 'absolute', top: '3px', left: annual ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: annual ? '#0a0a0a' : '#555', transition: 'left 0.2s' }} />
                        </button>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: annual ? '#ffffff' : '#444' }}>
                            Annual <span style={{ color: '#4ade80' }}>–20%</span>
                        </span>
                    </div>
                </Reveal>

                <div className="grid-cols-1 md:grid-cols-2" style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                    <Reveal>
                        <div style={{ padding: '48px', background: '#0a0a0a', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '6px' }}>Free</p>
                                <p style={{ ...EYEBROW, color: '#444', fontSize: '10px', marginBottom: '32px' }}>Learn the market — always free</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', color: '#ffffff', lineHeight: 1.0, marginBottom: '8px' }}>₹0</p>
                                <p style={{ ...EYEBROW, color: '#444', fontSize: '10px', marginBottom: '40px' }}>Forever</p>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                                    {freeFeatures.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999999' }}>
                                            <span style={{ color: '#0ABFBC', flexShrink: 0 }}>—</span>{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                to="/login"
                                style={{ ...PILL_GHOST_DIM, textAlign: 'center', display: 'block' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#999999'; e.currentTarget.style.color = '#999999' }}
                            >
                                GET STARTED FREE
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div style={{ padding: '48px', background: '#080808', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', borderLeft: '1px solid rgba(10,191,188,0.15)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#ffffff', letterSpacing: '0.05em' }}>Pro</p>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: '#0a0a0a', background: '#0ABFBC', padding: '4px 10px', borderRadius: '9999px' }}>RECOMMENDED</span>
                                </div>
                                <p style={{ ...EYEBROW, color: '#0ABFBC', fontSize: '10px', marginBottom: '32px' }}>Full platform + AI advisor</p>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', color: '#ffffff', lineHeight: 1.0, marginBottom: '8px' }}>₹{annual ? '1,999' : '2,499'}</p>
                                <p style={{ ...EYEBROW, color: '#444', fontSize: '10px', marginBottom: annual ? '4px' : '40px' }}>/month</p>
                                {annual && <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4ade80', marginBottom: '40px' }}>₹23,988 billed annually — save ₹6,000</p>}
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                                    {proFeatures.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
                                            <span style={{ color: '#0ABFBC', flexShrink: 0 }}>—</span>{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                to="/login"
                                style={{ ...PILL_PRIMARY, textAlign: 'center', display: 'block' }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                {annual ? 'UPGRADE — ₹23,988/YR' : 'UPGRADE — ₹2,499/MO'}
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
        <section style={{ padding: '120px 24px', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <Reveal>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: 'clamp(32px, 6vw, 96px) clamp(20px, 4vw, 48px)', border: '1px solid rgba(10,191,188,0.15)', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(10,191,188,0.5), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(10,191,188,0.25), transparent)' }} />
                    <p style={{ ...EYEBROW, marginBottom: '24px' }}>Get Started Today</p>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginBottom: '24px' }}>
                        JOIN BROKERS WHO LEARN<br /><span style={{ color: '#0ABFBC' }}>BEFORE THEY SELL.</span>
                    </h2>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#999999', marginBottom: '48px', maxWidth: '360px', margin: '0 auto 48px', lineHeight: 1.7 }}>
                        Free forever for the essentials. Pro when you are ready to close at a professional level.
                    </p>
                    <Link
                        to="/login"
                        style={PILL_PRIMARY}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        START FOR FREE — NO CARD NEEDED
                    </Link>
                </div>
            </Reveal>
        </section>
    )
}

/* ─── FOOTER ─────────────────────────────────────────────────────── */
function Footer() {
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
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', padding: '80px 24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="grid-cols-2 md:grid-cols-4" style={{ display: 'grid', gap: '48px', marginBottom: '64px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ffffff', letterSpacing: '0.35em' }}>ALTUS AERO</span>
                    <div className="logo-line" style={{ height: '1px', width: '100%', background: '#0ABFBC', transition: 'box-shadow 0.4s ease', borderRadius: '1px' }} />
                  </div>
                        </div>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#444', lineHeight: 1.7, marginBottom: '16px', maxWidth: '240px' }}>Broker intelligence built on the Varsano method. Teach first. Sell second.</p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.08em' }}>Mumbai, India · 2026</p>
                    </div>

                    {cols.map((col) => (
                        <div key={col.label}>
                            <p style={{ ...EYEBROW, color: '#444', fontSize: '10px', marginBottom: '20px' }}>{col.label}</p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                                {col.links.map((l) => (
                                    <li key={l.title}>
                                        <a
                                            href={l.href}
                                            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#555'}
                                        >
                                            {l.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.06em' }}>© 2026 Altus Aero · Anirudh Shinde. All rights reserved.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <Link
                            to="/privacy"
                            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#444'}
                        >
                            Privacy Policy
                        </Link>
                        <span style={{ color: '#222', fontSize: '10px' }}>·</span>
                        <Link
                            to="/terms"
                            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#444'}
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────────── */
export default function Index() {
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
            <Footer />
        </div>
    )
}