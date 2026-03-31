import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeJetHero from '../components/ThreeJetHero.jsx'

gsap.registerPlugin(ScrollTrigger)

const tickerItems = [
    'VABB → EGLL | G650ER | $185,000 charter',
    'G650ER pre-owned 2018 | $42–46M market range',
    'VABB activity today | 4 business jets | 2 ultra-long range',
    'Mumbai → New York | G700 | 8,200nm | nonstop capable',
    'Pre-owned market Q1 2026 | -8% YoY | buyers market',
    'G700 cabin volume | 20% larger than G650 | stateroom available',
    'VABB → KLAX | Global 7500 | only jet that does this nonstop',
]

const principles = [
    { label: 'EDUCATE', desc: 'Show clients exactly what each aircraft costs to own, charter, and operate. No surprises. No pressure.' },
    { label: 'ILLUMINATE', desc: 'Live flight data, 3D models, real pricing. Walk them through the decision like a trusted advisor, not a salesperson.' },
    { label: 'ADVISE', desc: 'When a client trusts your knowledge, the close is a formality. Build that trust with every interaction.' }
]

const features = [
    { title: 'Learn which aircraft fits the Mumbai–London route nonstop', tag: 'Live Flight Tracking' },
    { title: 'Understand the real cost of ownership vs charter at 200 hrs/year', tag: 'Cost Calculator' },
    { title: 'See the cabin before they ever step aboard', tag: '3D Explorer' },
    { title: 'Know pre-owned market valuations before negotiations begin', tag: 'Market Data' },
    { title: 'Generate proposals that educate clients, not pressure them', tag: 'PDF Reports' },
    { title: 'Track live positions so you know market moves before your clients do', tag: 'Live Intelligence' },
]

const stats = [
    { value: '10,847', label: 'Flights Analyzed' },
    { value: '$2.3B', label: 'Fleet Value Tracked' },
    { value: '500+', label: 'Aircraft in Database' },
    { value: '47', label: 'Airports with Live Cost Data' },
]

const plans = [
    {
        name: 'Starter', price: 49, tag: 'Learn the market',
        features: ['Flight data access', 'Cost calculators', 'Fleet specifications', 'Email support'],
        highlight: false
    },
    {
        name: 'Pro', price: 99, tag: 'Master the fleet',
        features: ['Everything in Starter', '3D aircraft models', 'Live flight tracking', 'Branded client proposals', 'Priority support'],
        highlight: true
    },
    {
        name: 'Enterprise', price: 199, tag: 'Own the intelligence',
        features: ['Everything in Pro', 'JETNET market data', 'White-label reports', 'Team access', 'Dedicated account manager'],
        highlight: false
    }
]

const testimonials = [
    {
        quote: 'I walked into a client meeting knowing the exact pre-owned market range for the G650. They asked how I knew. I said I track it daily. That is when they signed.',
        name: 'Rahul M.', role: 'Senior Broker, Mumbai'
    },
    {
        quote: 'The 3D viewer changed everything. My client had never seen a Phenom 300E cabin. Once they saw it, the conversation changed from is this big enough to when can we fly.',
        name: 'Priya S.', role: 'Charter Ops, Delhi'
    },
    {
        quote: 'Altus Aero taught me more about aircraft economics in a month than two years of googling. I show up to every meeting as the expert.',
        name: 'Amir K.', role: 'FBO Director, Ahmedabad'
    }
]

export default function Homepage() {
    const [annual, setAnnual] = useState(false)
    const heroRef = useRef()
    const topTextRef = useRef()
    const bottomTextRef = useRef()
    const progress = useRef(0)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '+=2500',
                    pin: true,
                    scrub: 1.5,
                    onUpdate: (self) => { progress.current = self.progress }
                }
            })
            tl.to({}, { duration: 0.7 })
            tl.to(topTextRef.current, { y: -200, opacity: 0, duration: 0.3, ease: 'power3.in' }, 0.7)
            tl.to(bottomTextRef.current, { y: 200, opacity: 0, duration: 0.3, ease: 'power3.in' }, 0.7)
        }, heroRef)
        return () => ctx.revert()
    }, [])

    return (
        <div className="bg-jet text-white overflow-x-hidden">
            <div className="noise-overlay" />

            {/* Nav */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-[#1c1c1c]"
                style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)' }}
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-display text-lg sm:text-2xl tracking-widest text-gold-gradient">ALTUS</span>
                    <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
                </div>
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    <a href="#philosophy" className="text-sm text-gray-400 hover:text-gold transition-colors font-body">Philosophy</a>
                    <a href="#features" className="text-sm text-gray-400 hover:text-gold transition-colors font-body">Features</a>
                    <a href="#pricing" className="text-sm text-gray-400 hover:text-gold transition-colors font-body">Pricing</a>
                    <Link to="/app/dashboard" className="btn-primary text-sm py-2 px-4 lg:px-5">OPEN APP →</Link>
                </div>
                <Link to="/app/dashboard" className="md:hidden btn-primary text-xs py-1.5 px-3">APP →</Link>
            </nav>

            {/* Hero */}
            <section ref={heroRef} className="relative h-screen overflow-hidden grid-bg">
                <div className="absolute inset-0 z-0">
                    <ThreeJetHero progress={progress} />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16 sm:pt-20 pointer-events-none select-none px-4">
                    <p className="section-label mb-3 sm:mb-6 tracking-widest text-center text-xs sm:text-sm">EST. MUMBAI 2026 — VARSANO METHOD</p>
                    <div ref={topTextRef}>
                        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] tracking-widest leading-none text-gold-gradient text-center">
                            KNOW MORE.
                        </h1>
                    </div>
                    <div ref={bottomTextRef}>
                        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] tracking-widest leading-none text-white text-center">
                            CLOSE MORE.
                        </h1>
                    </div>
                    <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mt-4 sm:mt-8 mb-2 sm:mb-3 leading-relaxed text-center">
                        The broker who educates wins. Altus Aero gives you the data, the 3D models, and the market intelligence to become the most trusted advisor in the room.
                    </p>
                    <p className="font-mono text-xs sm:text-sm text-gold mb-6 sm:mb-10 text-center">
                        Inspired by Steve Varsano's philosophy: teach first, sell second.
                    </p>
                    <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link to="/app/jets" className="btn-primary text-sm sm:text-base w-full sm:w-auto text-center">EXPLORE THE FLEET →</Link>
                        <Link to="/app/flights" className="btn-secondary text-sm sm:text-base w-full sm:w-auto text-center">SEE LIVE MARKET DATA</Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#1c1c1c] bg-jet/90 overflow-hidden py-2 z-10">
                    <div className="flex animate-ticker whitespace-nowrap">
                        {[...tickerItems, ...tickerItems].map((item, i) => (
                            <span key={i} className="font-mono text-xs text-gold mx-6 sm:mx-8">◆ {item}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section id="philosophy" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
                <p className="section-label text-center mb-8 sm:mb-16">THE PHILOSOPHY</p>
                <div className="glass-gold p-6 sm:p-10 md:p-16 mb-10 sm:mb-20 text-center">
                    <p className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4 sm:mb-6">
                        "The client who understands the market buys with confidence. Your job is not to sell a jet — it's to make them an expert."
                    </p>
                    <p className="font-mono text-xs sm:text-sm text-gold">— Inspired by Steve Varsano, The Jet Business, London</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {principles.map((p, i) => (
                        <div key={i} className="glass p-6 sm:p-8">
                            <p className="font-display text-2xl sm:text-3xl text-gold-gradient mb-3 sm:mb-4">{p.label}</p>
                            <p className="font-body text-sm sm:text-base text-gray-300 leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-[#080808] grid-bg">
                <div className="max-w-6xl mx-auto">
                    <p className="section-label text-center mb-3 sm:mb-4">WHAT YOU'LL LEARN</p>
                    <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-center text-white mb-8 sm:mb-16">
                        KNOWLEDGE IS YOUR <span className="text-gold-gradient">EDGE</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="glass p-5 sm:p-6 group">
                                <p className="font-mono text-xs text-gulf mb-2 sm:mb-3">{f.tag}</p>
                                <p className="font-body text-sm sm:text-base text-white leading-relaxed group-hover:text-gold transition-colors">{f.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-4xl mx-auto text-center">
                <p className="section-label mb-4 sm:mb-6">ABOUT THE BUILDER</p>
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-white mb-6 sm:mb-8">
                    BUILT BY A BROKER <span className="text-gold-gradient">IN TRAINING</span>
                </h2>
                <div className="glass-gold p-6 sm:p-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gulf flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <span className="font-display text-xl sm:text-2xl text-white">AS</span>
                    </div>
                    <p className="font-body text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed mb-3 sm:mb-4">
                        Anirudh Shinde, Mumbai — studying the Varsano model: deep knowledge, complete transparency, long-term client relationships over quick commissions.
                    </p>
                    <p className="font-body text-sm sm:text-base text-gray-400 leading-relaxed">
                        Altus Aero is the tool I wish existed when I started learning this industry.
                    </p>
                    <p className="font-mono text-xs sm:text-sm text-gold mt-4 sm:mt-6">Mumbai, India · 2026</p>
                </div>
            </section>

            {/* Market Intelligence Preview */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-[#080808] grid-bg">
                <div className="max-w-6xl mx-auto">
                    <p className="section-label text-center mb-3 sm:mb-4">MARKET INTELLIGENCE PREVIEW</p>
                    <h2 className="font-display text-3xl sm:text-5xl text-center text-white mb-8 sm:mb-16">
                        TODAY'S <span className="text-gold-gradient">DATA</span>
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {[
                            { label: 'VABB Business Jets Today', value: '4 movements' },
                            { label: 'Ultra Long Range Departures', value: '2 flights' },
                            { label: 'G650 Charter Mumbai→London', value: '~$185,000' },
                            { label: 'G650ER Pre-owned (2018)', value: '$42–46M' },
                        ].map((item, i) => (
                            <div key={i} className="stat-card text-center p-3 sm:p-4">
                                <p className="font-mono text-xs text-gray-500 mb-1 sm:mb-2 leading-tight">{item.label}</p>
                                <p className="font-display text-lg sm:text-2xl text-gold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <Link to="/app/dashboard" className="btn-secondary text-sm sm:text-base">Log in to see full data →</Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 sm:py-24 px-4 sm:px-6 border-y border-[#1c1c1c]">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-gradient">{s.value}</p>
                            <p className="font-mono text-xs text-gray-400 mt-1 sm:mt-2 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 grid-bg">
                <div className="max-w-6xl mx-auto">
                    <p className="section-label text-center mb-3 sm:mb-4">INVEST IN YOUR KNOWLEDGE</p>
                    <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-center text-white mb-3 sm:mb-4">
                        CHOOSE YOUR <span className="text-gold-gradient">TIER</span>
                    </h2>
                    <p className="font-body text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">7-day free trial on all plans. No credit card required.</p>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <span className={`font-mono text-xs sm:text-sm ${!annual ? 'text-gold' : 'text-gray-500'}`}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors relative ${annual ? 'bg-gold' : 'bg-[#1c1c1c]'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-jet transition-transform ${annual ? 'translate-x-5 sm:translate-x-6' : ''}`} />
                        </button>
                        <span className={`font-mono text-xs sm:text-sm ${annual ? 'text-gold' : 'text-gray-500'}`}>
                            Annual <span className="text-green-400">-20%</span>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {plans.map((plan, i) => (
                            <div key={i} className={`p-6 sm:p-8 rounded-xl border transition-all ${plan.highlight ? 'border-gold bg-gold/5 shadow-gold' : 'border-[#1c1c1c] glass'}`}>
                                {plan.highlight && (
                                    <p className="font-mono text-xs text-jet bg-gold px-2 py-0.5 rounded inline-block mb-3 sm:mb-4">MOST POPULAR</p>
                                )}
                                <p className="font-display text-2xl sm:text-3xl text-white mb-1">{plan.name}</p>
                                <p className="font-mono text-xs text-gold mb-4 sm:mb-6">{plan.tag}</p>
                                <p className="font-display text-4xl sm:text-5xl text-white mb-1">
                                    ${annual ? Math.round(plan.price * 0.8) : plan.price}
                                    <span className="text-lg sm:text-xl text-gray-400">/mo</span>
                                </p>
                                {annual && <p className="font-mono text-xs text-green-400 mb-4 sm:mb-6">Billed annually</p>}
                                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 mt-4 sm:mt-6">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 font-body text-xs sm:text-sm text-gray-300">
                                            <span className="text-gold">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/app/dashboard"
                                    className={`block text-center py-2.5 sm:py-3 rounded-lg font-display tracking-widest text-sm transition-all ${plan.highlight ? 'bg-gold text-jet hover:shadow-glow' : 'border border-[#1c1c1c] text-white hover:border-gold'}`}
                                >
                                    GET STARTED
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-[#080808]">
                <div className="max-w-6xl mx-auto">
                    <p className="section-label text-center mb-3 sm:mb-4">WHAT BROKERS SAY</p>
                    <h2 className="font-display text-3xl sm:text-5xl text-center text-white mb-8 sm:mb-16">
                        KNOWLEDGE THAT <span className="text-gold-gradient">CLOSES</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="glass p-6 sm:p-8">
                                <p className="font-body text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6 italic">"{t.quote}"</p>
                                <p className="font-display text-base sm:text-lg text-gold">{t.name}</p>
                                <p className="font-mono text-xs text-gray-500">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-[#1c1c1c] text-center">
                <p className="font-display text-xl sm:text-2xl text-gold-gradient mb-2">ALTUS AERO</p>
                <p className="font-mono text-xs text-gray-500">
                    Anirudh A Shinde | Aspiring Jet Broker | Mumbai, India | Inspired by The Varsano Method
                </p>
                <p className="font-mono text-xs text-gray-700 mt-3 sm:mt-4">© 2026 Altus Aero. All rights reserved.</p>
            </footer>
        </div>
    )
}