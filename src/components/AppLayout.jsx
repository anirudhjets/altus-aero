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
    const mobileProfileRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, plan, signOut } = useAuth()

    const handleSignOut = async () => {
        setProfileOpen(false)
        await signOut()
        navigate('/')
    }

    const username =
        user?.user_metadata?.full_name ||
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

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            const clickedDesktop = profileRef.current && profileRef.current.contains(e.target)
            const clickedMobile = mobileProfileRef.current && mobileProfileRef.current.contains(e.target)
            if (!clickedDesktop && !clickedMobile) {
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

    const ProfileDropdown = () => (
        <AnimatePresence>
            {profileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 'calc(100% + 6px)',
                        width: '220px',
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                        zIndex: 200,
                        overflow: 'hidden',
                    }}
                >
                    {/* User info */}
                    <div
                        style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '9px',
                                color: 'rgba(255,255,255,0.3)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                marginBottom: '4px',
                            }}
                        >
                            Signed in as
                        </p>
                        <p
                            style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '13px',
                                color: '#fff',
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {username}
                        </p>
                    </div>

                    {/* Plan */}
                    <div
                        style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '9px',
                                color: 'rgba(255,255,255,0.3)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Current Plan
                        </p>
                        <span
                            style={{
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: '12px',
                                letterSpacing: '0.12em',
                                color: isPro ? '#D4AF37' : '#6b7280',
                                background: isPro ? 'rgba(212,175,55,0.1)' : 'rgba(107,114,128,0.1)',
                                border: `1px solid ${isPro ? 'rgba(212,175,55,0.25)' : 'rgba(107,114,128,0.2)'}`,
                                padding: '2px 8px',
                                borderRadius: '4px',
                            }}
                        >
                            {isPro ? 'PRO' : 'FREE'}
                        </span>
                    </div>

                    {/* Actions */}
                    <Link
                        to="/app/settings"
                        onClick={() => setProfileOpen(false)}
                        style={{
                            display: 'block',
                            padding: '12px 16px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.65)',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        Account Settings
                    </Link>

                    {!isPro && (
                        <Link
                            to="/app/billing"
                            onClick={() => setProfileOpen(false)}
                            style={{
                                display: 'block',
                                padding: '12px 16px',
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '13px',
                                color: '#D4AF37',
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(212,175,55,0.05)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            Upgrade to Pro
                        </Link>
                    )}

                    <button
                        onClick={handleSignOut}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 16px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '13px',
                            color: '#f87171',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(248,113,113,0.07)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        Sign Out
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )

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

                {/* User block — clickable, opens dropdown */}
                <div
                    className="p-3 border-b border-[#1c1c1c]"
                    style={{ position: 'relative' }}
                    ref={profileRef}
                >
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '8px',
                            borderRadius: '10px',
                            background: profileOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
                            border: '1px solid',
                            borderColor: profileOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                            if (!profileOpen) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!profileOpen) {
                                e.currentTarget.style.background = 'transparent'
                            }
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#1e3a8a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <span className="text-xs font-bold text-white">{userInitials}</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}
                                >
                                    <p
                                        style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#fff',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {username}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'JetBrains Mono, monospace',
                                            fontSize: '10px',
                                            color: isPro ? '#D4AF37' : '#6b7280',
                                        }}
                                    >
                                        {isPro ? 'PRO' : 'FREE PLAN'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                animate={{ rotate: profileOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.3)',
                                    flexShrink: 0,
                                }}
                            >
                                ▾
                            </motion.span>
                        )}
                    </button>

                    <ProfileDropdown />
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
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

                {/* Bottom */}
                <div className="p-3 border-t border-[#1c1c1c] space-y-1">
                    <Link to="/" className="nav-link">
                        <span className="flex-shrink-0">←</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Back to Site
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                        <span className="flex-shrink-0">⏻</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Header */}
                <header
                    className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1c1c1c] flex-shrink-0"
                    style={{ background: 'rgba(10,10,10,0.95)' }}
                >
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
                        {!isPro && (
                            <button
                                onClick={() => navigate('/app/billing')}
                                className="btn-primary text-xs py-1.5 px-3 md:px-4"
                            >
                                UPGRADE
                            </button>
                        )}
                        {isPro && (
                            <span className="font-mono text-xs text-gold border border-gold/30 px-2.5 py-1 rounded">
                                PRO
                            </span>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-3 md:p-6 grid-bg pb-20 md:pb-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav
                    className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#1c1c1c] z-50 flex"
                    style={{ background: 'rgba(10,10,10,0.98)' }}
                >
                    {mobileNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-500'
                                }`
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
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-gold text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Mobile user block */}
                            <div
                                className="p-4 border-b border-[#1c1c1c]"
                                style={{ position: 'relative' }}
                                ref={mobileProfileRef}
                            >
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: profileOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: profileOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#1e3a8a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span className="text-sm font-bold text-white">{userInitials}</span>
                                    </div>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <p className="text-sm font-semibold text-white">{username}</p>
                                        <p
                                            className="text-xs font-mono"
                                            style={{ color: isPro ? '#D4AF37' : '#6b7280' }}
                                        >
                                            {isPro ? 'PRO PLAN' : 'FREE PLAN'} · tap to manage
                                        </p>
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>▾</span>
                                </button>

                                {/* Profile dropdown in mobile */}
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute',
                                                left: '16px',
                                                right: '16px',
                                                top: 'calc(100% + 4px)',
                                                background: '#1a1a1a',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '14px',
                                                boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                                                zIndex: 200,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Plan</p>
                                                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.12em', color: isPro ? '#D4AF37' : '#6b7280', background: isPro ? 'rgba(212,175,55,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${isPro ? 'rgba(212,175,55,0.25)' : 'rgba(107,114,128,0.2)'}`, padding: '2px 8px', borderRadius: '4px' }}>
                                                    {isPro ? 'PRO' : 'FREE'}
                                                </span>
                                            </div>
                                            <Link to="/app/settings" onClick={() => { setProfileOpen(false); setMobileMenuOpen(false) }} style={{ display: 'block', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                Account Settings
                                            </Link>
                                            {!isPro && (
                                                <Link to="/app/billing" onClick={() => { setProfileOpen(false); setMobileMenuOpen(false) }} style={{ display: 'block', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    Upgrade to Pro
                                                </Link>
                                            )}
                                            <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <nav className="flex-1 p-3 space-y-1">
                                {navItems.map((item) => (
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

            {/* Chatbot — rendered for all authenticated users */}
            <Chatbot />
        </div>
    )
}