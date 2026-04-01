import os

content = r"""import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ThreeJetHero from '../components/ThreeJetHero'

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
    { label: 'Academy', href: '#academy' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        background: scrolled
          ? 'rgba(10,10,10,0.92)'
          : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(28,28,28,0.8)' : 'none',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="font-display text-gold text-2xl tracking-widest">ALTUS</span>
          <span className="text-xs font-mono bg-gold text-jet px-2 py-0.5 rounded font-bold tracking-wider">AERO</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wider"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="font-mono text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg border border-[#1c1c1c] hover:border-gold/40 transition-all duration-200 tracking-wider"
          >
            SIGN IN
          </Link>
          <Link
            to="/login"
            className="font-mono text-xs text-jet bg-gold hover:bg-gold/90 px-5 py-2 rounded-lg font-bold tracking-wider transition-all duration-200"
          >
            START FREE
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 group"
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-5 rotate-45 translate-y-[5px]' : 'w-5'}`} />
          <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
          <span className={`block h-px bg-gray-400 group-hover:bg-gold transition-all duration-300 ${open ? 'w-5 -rotate-45 -translate-y-[5px]' : 'w-5'}`} />
        </button>
      </div>

      {/* Mobile menu */}
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
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block font-mono text-sm text-gray-400 hover:text-white py-3 border-b border-[#1c1c1c] tracking-wider transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="block text-center font-mono text-xs text-gray-400 border border-[#1c1c1c] py-3 rounded-lg tracking-wider">
                  SIGN IN
                </Link>
                <Link to="/login" onClick={() => setOpen(false)} className="block text-center font-mono text-xs text-jet bg-gold py-3 rounded-lg font-bold tracking-wider">
                  START FREE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─── FADE-IN WRAPPER ─────────────────────────────────────────────── */
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
      {/* 3D Jet background */}
      <div className="absolute inset-0 z-0">
        <ThreeJetHero />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial fade */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.7) 70%, #0a0a0a 100%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase">Broker Intelligence Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight mb-6"
        >
          THE BROKER WHO
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: '1px rgba(212,175,55,0.7)' }}
          >
            EDUCATES
          </span>
          <br />
          CLOSES.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="font-body text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Altus Aero gives you the market intelligence, fleet knowledge, and client tools to close deals with confidence — not guesswork.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/login"
            className="w-full sm:w-auto font-display text-sm text-jet px-8 py-3.5 rounded-lg tracking-widest transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#D4AF37' }}
          >
            START FOR FREE
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto font-display text-sm text-white px-8 py-3.5 rounded-lg tracking-widest border border-[#1c1c1c] hover:border-gold/40 hover:bg-white/5 transition-all duration-200"
          >
            SEE WHAT'S INSIDE
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { value: '14', label: 'Aircraft Profiles' },
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-gray-600 tracking-widest">SCROLL</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="text-gray-600 text-xs"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}

/* ─── FEATURES TABS ──────────────────────────────────────────────── */
const featureTabs = [
  {
    id: 'fleet',
    label: 'Fleet Intelligence',
    icon: '✈',
    badge: 'Free',
    title: 'Know every aircraft before your client asks.',
    description: 'Full specs on 14 aircraft — range, speed, cabin dimensions, ownership costs. When a client asks if the G650ER can fly Mumbai to London nonstop, you answer without hesitation.',
    points: [
      'All 14 aircraft with full technical specs',
      'Range, speed, and payload comparisons',
      'Charter vs ownership cost breakdowns',
      'Side-by-side aircraft comparisons',
    ],
    visual: {
      label: 'G650ER',
      range: '7,500nm',
      speed: '516 kts',
      category: 'Ultra Long Range',
      passengers: '13-18',
    },
  },
  {
    id: 'mission',
    label: 'Mission Planner',
    icon: '◈',
    badge: 'Pro',
    title: 'Plan any route. Justify any aircraft.',
    description: 'Input origin, destination, and passenger count. Get a full mission analysis — which aircraft qualify, what it costs charter vs ownership, and a client-ready proposal to send.',
    points: [
      'Full route planning with live map',
      'Aircraft qualification by range',
      'Branded client-ready proposals',
      'Unlimited mission calculations',
    ],
    visual: {
      route: 'VABB → EGLL',
      distance: '4,387nm',
      aircraft: 'G650ER · Global 7500 · G700',
      time: '8h 45m',
    },
  },
  {
    id: 'intel',
    label: 'Market Intel',
    icon: '⬡',
    badge: 'Pro',
    title: 'Know the market. Lead every conversation.',
    description: 'Live flight tracking, charter rate benchmarks, pre-owned market data, and broker intelligence — everything you need to walk into a client meeting sounding like you\'ve been in this industry for 20 years.',
    points: [
      'Live VABB flight tracker',
      'Charter rate benchmarks by route',
      'Pre-owned market trend data',
      'Weekly broker intelligence digest',
    ],
    visual: {
      insight: 'Pre-owned values dropped ~8% in Q1 2026',
      sub: 'Buyer\'s market — advise acquisition clients to move now',
    },
  },
]

function Features() {
  const [active, setActive] = useState('fleet')
  const tab = featureTabs.find(t => t.id === active)

  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Platform Features</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Built for brokers who<br />
            <span className="text-gold">take the time to learn.</span>
          </h2>
          <p className="font-body text-gray-400 max-w-lg">
            Steve Varsano's principle: educate the client, and the sale takes care of itself. Every tool in Altus Aero is built on that belief.
          </p>
        </Reveal>

        {/* Tab triggers */}
        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {featureTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-xs tracking-wider transition-all duration-200 border ${
                  active === t.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-[#1c1c1c] text-gray-500 hover:border-[#333] hover:text-gray-300'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                    t.badge === 'Free'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-gold/10 text-gold'
                  }`}
                >
                  {t.badge}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center"
          >
            {/* Text */}
            <div
              className="p-8 rounded-2xl border border-[#1c1c1c]"
              style={{ background: 'rgba(14,14,14,0.8)' }}
            >
              <p className="font-mono text-xs text-gold tracking-widest mb-4">{tab.badge === 'Free' ? 'FREE FEATURE' : 'PRO FEATURE'}</p>
              <h3 className="font-display text-3xl text-white mb-4 leading-tight">{tab.title}</h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">{tab.description}</p>
              <ul className="space-y-2.5">
                {tab.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                    <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual */}
            <div
              className="p-8 rounded-2xl border border-gold/20 min-h-64 flex flex-col justify-center"
              style={{ background: 'rgba(212,175,55,0.03)' }}
            >
              {active === 'fleet' && (
                <div className="space-y-4">
                  <p className="font-mono text-xs text-gray-600 tracking-widest">AIRCRAFT PROFILE</p>
                  <p className="font-display text-5xl text-gold">{tab.visual.label}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { label: 'Range', value: tab.visual.range },
                      { label: 'Speed', value: tab.visual.speed },
                      { label: 'Category', value: tab.visual.category },
                      { label: 'Passengers', value: tab.visual.passengers },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                        <p className="font-mono text-xs text-gray-600">{d.label}</p>
                        <p className="font-display text-base text-white mt-1">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {active === 'mission' && (
                <div className="space-y-4">
                  <p className="font-mono text-xs text-gray-600 tracking-widest">MISSION ANALYSIS</p>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-3xl text-white">{tab.visual.route}</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Distance', value: tab.visual.distance },
                      { label: 'Qualifying Aircraft', value: tab.visual.aircraft },
                      { label: 'Est. Flight Time', value: tab.visual.time },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[#1c1c1c]">
                        <p className="font-mono text-xs text-gray-500">{d.label}</p>
                        <p className="font-mono text-xs text-white">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {active === 'intel' && (
                <div className="space-y-4">
                  <p className="font-mono text-xs text-gray-600 tracking-widest">TODAY'S MARKET INSIGHT</p>
                  <div className="p-5 rounded-xl border border-gold/20 bg-gold/5">
                    <p className="font-body text-white text-base leading-relaxed">{tab.visual.insight}</p>
                    <p className="font-mono text-xs text-gold mt-3">{tab.visual.sub}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Live Flights', 'Rate Benchmarks', 'Pre-owned Data', 'Weekly Digest'].map((l, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-[#1c1c1c]">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                        <span className="font-mono text-xs text-gray-400">{l}</span>
                      </div>
                    ))}
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

/* ─── HOW IT WORKS ────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Learn the aircraft',
      body: 'Start with the Fleet guide. 14 aircraft, full specs, real numbers. Know the G650ER from the Global 7500 before your first client call.',
    },
    {
      num: '02',
      title: 'Plan the mission',
      body: 'Input any route. Get which aircraft qualify, what charter costs, what ownership costs, and a client-ready proposal in minutes.',
    },
    {
      num: '03',
      title: 'Close with confidence',
      body: 'Walk into every client conversation knowing the market, the aircraft, and the numbers. Educated brokers close. That is the whole model.',
    },
  ]

  return (
    <section id="how" className="py-24 md:py-32 px-6" style={{ background: 'rgba(14,14,14,0.5)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Three steps to becoming<br />
            <span className="text-gold">the broker clients trust.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1c1c1c] rounded-2xl overflow-hidden">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                className="p-8 h-full"
                style={{ background: '#0a0a0a' }}
              >
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
    'Fleet guide — all 14 aircraft with full specs',
    'Academy and learning section',
    'Basic charter vs ownership calculator',
    'One sample mission plan',
    'Market education content',
  ]

  const proFeatures = [
    'Everything in Free',
    'Full mission planner with route map',
    'Live flight tracker',
    'Broker intelligence dashboard',
    'Unlimited cost calculations',
    'Branded client proposals',
    'Market data and insights',
    'Priority support',
  ]

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Learn for free.<br />
            <span className="text-gold">Close with Pro.</span>
          </h2>
          <p className="font-body text-gray-400 max-w-md mx-auto">
            No credit card needed to start. Upgrade when you are ready to use the full toolkit.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`font-mono text-xs ${!annual ? 'text-gold' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-11 h-6 rounded-full transition-colors relative ${annual ? 'bg-gold' : 'bg-[#1c1c1c]'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-jet transition-transform ${annual ? 'translate-x-5' : ''}`} />
            </button>
            <span className={`font-mono text-xs ${annual ? 'text-gold' : 'text-gray-500'}`}>
              Annual <span className="text-green-400">save 20%</span>
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Free */}
          <Reveal delay={0.05}>
            <div className="p-8 rounded-2xl border border-[#1c1c1c] h-full flex flex-col" style={{ background: '#0d0d0d' }}>
              <div>
                <p className="font-display text-2xl text-white mb-1">Free</p>
                <p className="font-mono text-xs text-gray-500 mb-6">Learn the market — always free</p>
                <p className="font-display text-5xl text-white mb-8">
                  ₹0
                  <span className="text-base text-gray-500 font-body"> / forever</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-400">
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/login"
                className="mt-auto block text-center font-display text-sm tracking-widest py-3 rounded-xl border border-[#1c1c1c] text-gray-500 hover:border-gold/30 hover:text-white transition-all duration-200"
              >
                GET STARTED FREE
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.1}>
            <div
              className="p-8 rounded-2xl border h-full flex flex-col relative overflow-hidden"
              style={{ background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.3)' }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display text-2xl text-white">Pro</p>
                  <span className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded font-bold">RECOMMENDED</span>
                </div>
                <p className="font-mono text-xs text-gold mb-6">Everything you need to close deals</p>
                <p className="font-display text-5xl text-white mb-1">
                  ₹{annual ? '1,999' : '2,499'}
                  <span className="text-base text-gray-500 font-body"> /mo</span>
                </p>
                {annual && (
                  <p className="font-mono text-xs text-green-400 mb-1">₹23,988 billed annually — you save ₹6,000</p>
                )}
                <p className="font-mono text-xs text-gray-600 mb-6">
                  {annual ? 'Billed once a year' : 'Switch to annual, save ₹6,000/year'}
                </p>
                <ul className="space-y-3 mb-8">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/login?upgrade=true"
                className="mt-auto block text-center font-display text-sm text-jet tracking-widest py-3 rounded-xl font-bold hover:opacity-90 transition-all duration-200"
                style={{ background: '#D4AF37' }}
              >
                {annual ? 'UPGRADE — ₹23,988/yr' : 'UPGRADE — ₹2,499/mo'}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS ────────────────────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: 'Rajiv Mehta',
    role: 'Charter Broker, Mumbai',
    quote: 'Before Altus Aero I was Googling aircraft specs during client calls. Now I walk in knowing the numbers cold. The fleet guide alone changed how I present.',
  },
  {
    id: 2,
    name: 'Priya Krishnan',
    role: 'Aviation Consultant, Delhi',
    quote: 'The charter vs ownership calculator helps me frame the conversation in the first five minutes. Clients immediately understand why I am recommending what I am recommending.',
  },
  {
    id: 3,
    name: 'Arjun Nair',
    role: 'Aspiring Broker, Bangalore',
    quote: 'I used the Academy to learn the market before my first client meeting. The Varsano method works — educate first, sell second. I closed on my third client conversation.',
  },
]

function Testimonials() {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 px-6"
      style={{ background: 'rgba(14,14,14,0.5)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-12">What Brokers Say</p>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-body text-white text-xl md:text-2xl leading-relaxed mb-8">
              "{t.quote}"
            </p>
            <div>
              <p className="font-display text-base text-gold">{t.name}</p>
              <p className="font-mono text-xs text-gray-500 mt-1">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === index ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-[#1c1c1c] hover:bg-gold/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ACADEMY TEASER ─────────────────────────────────────────────── */
function AcademyTeaser() {
  const lessons = [
    'Aircraft categories and what differentiates them',
    'How to read a range chart and what it means for your route',
    'Charter vs ownership — the real financial math',
    'How to run a broker conversation like Steve Varsano',
    'Pre-owned market dynamics and how to advise buyers',
    'Understanding NBAA and ICAO regulatory basics',
  ]

  return (
    <section id="academy" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Academy — Coming Soon</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              The education layer<br />
              <span className="text-gold">no one else offers.</span>
            </h2>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-8">
              Free to everyone. No login required. A structured curriculum that takes you from zero aviation knowledge to confident broker in six modules.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gold/20 bg-gold/5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
              <p className="font-mono text-xs text-gold">Launching Q2 2026 — Join the waitlist at launch</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="p-6 rounded-2xl border border-[#1c1c1c]"
              style={{ background: '#0d0d0d' }}
            >
              <p className="font-mono text-xs text-gray-600 tracking-widest mb-5">CURRICULUM PREVIEW</p>
              <ul className="space-y-3">
                {lessons.map((l, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <span className="font-mono text-xs text-gray-700 mt-0.5 flex-shrink-0 group-hover:text-gold transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{l}</span>
                  </li>
                ))}
              </ul>
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
    <section className="py-24 px-6">
      <Reveal>
        <div
          className="max-w-4xl mx-auto rounded-2xl p-12 md:p-16 text-center relative overflow-hidden border border-gold/20"
          style={{ background: 'rgba(212,175,55,0.04)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">Get Started Today</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Join brokers who learn<br />
            <span className="text-gold">before they sell.</span>
          </h2>
          <p className="font-body text-gray-400 mb-8 max-w-md mx-auto">
            Free forever for the essentials. Pro when you are ready to close at a professional level.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto font-display text-sm text-jet px-8 py-3.5 rounded-xl tracking-widest font-bold hover:opacity-90 transition-opacity"
              style={{ background: '#D4AF37' }}
            >
              START FOR FREE — NO CARD NEEDED
            </Link>
          </div>
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
        { title: 'Fleet Guide', href: '#features' },
        { title: 'Mission Planner', href: '#features' },
        { title: 'Market Intel', href: '#features' },
        { title: 'Pricing', href: '#pricing' },
      ],
    },
    {
      label: 'Learn',
      links: [
        { title: 'Academy', href: '#academy' },
        { title: 'How It Works', href: '#how' },
        { title: 'Charter vs Ownership', href: '#features' },
        { title: 'Aircraft Categories', href: '#academy' },
      ],
    },
    {
      label: 'Company',
      links: [
        { title: 'About', href: '#' },
        { title: 'Privacy Policy', href: '#' },
        { title: 'Terms of Service', href: '#' },
        { title: 'Contact', href: 'mailto:anirudh.jets@gmail.com' },
      ],
    },
  ]

  return (
    <footer className="border-t border-[#1c1c1c] px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-gold text-xl tracking-widest">ALTUS</span>
              <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
            </div>
            <p className="font-body text-gray-500 text-sm leading-relaxed mb-4">
              Broker intelligence built on the Varsano method. Teach first. Sell second.
            </p>
            <p className="font-mono text-xs text-gray-700">Mumbai, India · 2026</p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.label}>
              <p className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4">{col.label}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.title}>
                    <a
                      href={l.href}
                      className="font-body text-sm text-gray-600 hover:text-white transition-colors duration-200"
                    >
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#1c1c1c] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-700">
            Anirudh A Shinde · Aspiring Jet Broker · Mumbai, India · Inspired by Steve Varsano
          </p>
          <p className="font-mono text-xs text-gray-700">© 2026 Altus Aero. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── PAGE ─────────────────────────────────────────────────────────── */
export default function Homepage() {
  return (
    <div className="min-h-screen bg-jet text-white">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <AcademyTeaser />
      <CTABanner />
      <Footer />
    </div>
  )
}
"""

target = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'src', 'pages', 'index.jsx'
)
os.makedirs(os.path.dirname(target), exist_ok=True)
with open(target, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Written to: {target}")
