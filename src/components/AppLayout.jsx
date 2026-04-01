import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [time, setTime] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    const { user, plan, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Broker'
    const userInitials = username.substring(0, 2).toUpperCase()
    const isPro = plan === 'pro'

    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location])

    useEffect(() => {
        const tick = () => {
            const now = new Date()
            const ist = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now)
            setTime(ist)
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    const navItems = [
        { path: '/app/dashboard', label: 'Intel', icon: '⬡' },
        { path: '/app/jets', label: 'Fleet', icon: '✈' },
        { path: '/app/flights', label: 'Track', icon: '◉' },
        { path: '/app/mission', label: 'Plan', icon: '◈' },
        { path: '/app/billing', label: 'Account', icon: '◇' },
        { path: '/app/settings', label: 'Profile', icon: '○' },
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

                {/* User block */}
                <div className="p-4 border-b border-[#1c1c1c]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{userInitials}</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                                    <p className="text-sm font-semibold text-white truncate max-w-[140px]">{username}</p>
                                    <p className="text-xs font-mono" style={{ color: isPro ? '#D4AF37' : '#6b7280' }}>
                                        {isPro ? 'PRO' : 'FREE PLAN'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
                            <button
                                onClick={() => navigate('/app/billing')}
                                className="btn-primary text-xs py-1.5 px-3 md:px-4"
                            >
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
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-500'}`
                            }
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 z-50"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
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
                                <Link to="/" className="nav-link">
                                    <span>←</span>
                                    <span>Back to Site</span>
                                </Link>
                                <button onClick={handleSignOut} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                    <span>⏻</span>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}