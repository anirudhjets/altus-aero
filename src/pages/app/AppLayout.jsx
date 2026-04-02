import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Chatbot from './Chatbot'

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [time, setTime] = useState('')
    const profileRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, plan, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const username =
        user?.user_metadata?.username ||
        user?.email?.split('@')[0] ||
        'Broker'
    const userInitials = username.substring(0, 2).toUpperCase()
    const isPro = plan === 'pro'

    useEffect(() => {
        setMobileMenuOpen(false)
        setProfileOpen(false)
    }, [location])

    useEffect(() => {
        const tick = () => {
            const now = new Date()
            const ist = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now)
            setTime(ist)
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const navItems = [
        { path: '/app/dashboard', label: 'Dashboard', icon: '⬡' },
        { path: '/app/intel', label: 'Intel', icon: '◈' },
        { path: '/app/fleet', label: 'Fleet', icon: '✈' },
        { path: '/app/track', label: 'Track', icon: '◉' },
        { path: '/app/plan', label: 'Plan', icon: '◇' },
        { path: '/app/billing', label: 'Billing', icon: '○' },
    ]

    const mobileNavItems = navItems.slice(0, 5)

    return (
        <div className="flex h-screen bg-jet overflow-hidden">

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 64 : 240 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden md:flex flex-col border-r border-[#1c1c1c] overflow-hidden flex-shrink-0"
                style={{ background: 'rgba(10,10,10,0.98)' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-[#1c1c1c]">
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <span className="font-display text-gold text-xl tracking-widest">ALTUS</span>
                                <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gold transition-colors p-1">
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* User block — clickable, opens dropdown */}
                <div className="p-4 border-b border-[#1c1c1c] relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{userInitials}</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{username}</p>
                                    <p className="text-xs font-mono" style={{ color: isPro ? '#D4AF37' : '#6b7280' }}>
                                        {isPro ? 'PRO' : 'FREE PLAN'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                        {profileOpen && !collapsed && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="absolute left-3 right-3 top-full mt-2 rounded-xl border border-white/10 z-50 overflow-hidden"
                                style={{ background: '#1a1a1a' }}
                            >
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Current Plan</p>
                                    <p className="text-sm font-semibold mt-1" style={{ color: '#D4AF37' }}>
                                        {isPro ? 'Pro' : 'Free'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setProfileOpen(false); navigate('/app/settings') }}
                                    className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors font-body"
                                >
                                    Account Settings
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors border-t border-white/10 font-body"
                                >
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-[#1c1c1c] space-y-1">
                    <Link to="/" className="nav-link">
                        <span className="flex-shrink-0">←</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Back to Site</motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <button onClick={handleSignOut} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <span className="flex-shrink-0">⏻</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign Out</motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Header */}
                <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1c1c1c] flex-shrink-0" style={{ background: 'rgba(10,10,10,0.95)' }}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-gold transition-colors p-1">☰</button>
                        <div className="md:hidden flex items-center gap-2">
                            <span className="font-display text-gold text-lg tracking-widest">ALTUS</span>
                            <span className="text-xs font-mono bg-gold text-jet px-1 py-0.5 rounded font-bold">AERO</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-mono text-gray-400">LIVE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <span className="font-mono text-xs md:text-sm text-gold">{time} IST</span>
                        {!isPro && (
                            <button onClick={() => navigate('/app/billing')} className="btn-primary text-xs py-1.5 px-3 md:px-4">
                                UPGRADE
                            </button>
                        )}
                        {isPro && (
                            <span className="font-mono text-xs text-gold border border-gold/30 px-2.5 py-1 rounded">PRO</span>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-3 md:p-6 grid-bg pb-20 md:pb-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#1c1c1c] z-50 flex" style={{ background: 'rgba(10,10,10,0.98)' }}>
                    {mobileNavItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-500'}`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span className="font-mono text-xs">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Mobile Slide-out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-black/60 z-50" />
                        <motion.div
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col border-r border-[#1c1c1c]"
                            style={{ background: 'rgba(10,10,10,0.99)' }}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-[#1c1c1c]">
                                <div className="flex items-center gap-2">
                                    <span className="font-display text-gold text-xl tracking-widest">ALTUS</span>
                                    <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gold text-xl">✕</button>
                            </div>
                            <div className="p-4 border-b border-[#1c1c1c]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-white">{userInitials}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{username}</p>
                                        <p className="text-xs font-mono" style={{ color: isPro ? '#D4AF37' : '#6b7280' }}>
                                            {isPro ? 'PRO' : 'FREE PLAN'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <nav className="flex-1 p-3 space-y-1">
                                {navItems.map(item => (
                                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        <span className="text-lg">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="p-3 border-t border-[#1c1c1c] space-y-1">
                                <Link to="/" className="nav-link"><span>←</span><span>Back to Site</span></Link>
                                <button onClick={handleSignOut} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                    <span>⏻</span><span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Chatbot — Pro only */}
            {isPro && <Chatbot />}
        </div>
    )
}