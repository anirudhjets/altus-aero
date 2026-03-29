import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [time, setTime] = useState('')
    const [apiCalls] = useState(847)

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
        { path: '/app/mission', label: 'Plan Mission', icon: '🗺' },
        { path: '/app/billing', label: 'Billing', icon: '◈' },
    ]

    return (
        <div className="flex h-screen bg-jet overflow-hidden">
            <motion.aside
                animate={{ width: collapsed ? 64 : 240 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col border-r border-[#1c1c1c] overflow-hidden flex-shrink-0"
                style={{ background: 'rgba(10,10,10,0.98)' }}
            >
                <div className="flex items-center justify-between p-4 border-b border-[#1c1c1c]">
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <span className="font-display text-gold text-xl tracking-widest">ALTUS</span>
                                <span className="text-xs font-mono bg-gold text-jet px-1.5 py-0.5 rounded font-bold">AERO</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-gray-400 hover:text-gold transition-colors p-1"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                <div className="p-4 border-b border-[#1c1c1c]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">AS</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-sm font-semibold text-white truncate">Anirudh Shinde</p>
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
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-[#1c1c1c]">
                    <Link to="/" className="nav-link">
                        <span className="flex-shrink-0">←</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Back to Site
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>
            </motion.aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="flex items-center justify-between px-6 py-3 border-b border-[#1c1c1c] flex-shrink-0"
                    style={{ background: 'rgba(10,10,10,0.95)' }}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-mono text-gray-400">LIVE</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-sm text-gold">{time} IST</span>
                        <span className="text-xs font-mono text-gray-400">{1000 - apiCalls} calls left</span>
                        <button className="btn-primary text-xs py-1.5 px-4">UPGRADE</button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 grid-bg">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}