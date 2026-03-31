import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [time, setTime] = useState('')
    const [apiCalls] = useState(847)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const userInitials = user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : 'AA'

    const userEmail = user?.email || ''

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
        { path: '/app/dashboard', label: 'Dashboard', icon: '⬡' },
        { path: '/app/jets', label: 'Jets', icon: '✈' },
        { path: '/app/flights', label: 'Flights', icon: '◉' },
        { path: '/app/mission', label: 'Mission', icon: '🗺' },
        { path: '/app/billing', label: 'Billing', icon: '◈' },
    ]

    return (
        <div className="flex h-screen bg-jet overflow-hidden">

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 64 : 240 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden md:flex flex-col border-r border-[#1c1c1c] overflow-hidden flex-shrink-0"
                style={{ background: 'rgba(10,10,10,0.98)' }}
            >
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

                <div className="p-4 border-b border-[#1c1c1c]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{userInitials}</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                                    <p className="text-xs text-white truncate max-w-[140px]">{userEmail}</p>
                                    <p className="text-xs text-gold font-mono">PRO TIER</p>
                                    <div className="mt-1.5 h-1 bg-[#1c1c1c] rounded-full w-32">
                                        <div className="h-1 bg-gold rounded-full" style={{ width: '72%' }} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">847 / 1,000 calls</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

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
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden text-gray-400 hover:text-gold transition-colors p-1"
                        >
                            ☰
                        </button>
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
                        <span className="hidden md:block text-xs font-mono text-gray-400">{1000 - apiCalls} calls left</span>
                        <button className="btn-primary text-xs py-1.5 px-3 md:px-4">UPGRADE</button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-3 md:p-6 grid-bg pb-20 md:pb-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#1c1c1c] z-50 flex" style={{ background: 'rgba(10,10,10,0.98)' }}>
                    {navItems.map(item => (
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
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-white truncate max-w-[180px]">{userEmail}</p>
                                        <p className="text-xs text-gold font-mono">PRO TIER</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex-1 p-3 space-y-1">
                                {navItems.map(item => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
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
                                <button
                                    onClick={handleSignOut}
                                    className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
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
