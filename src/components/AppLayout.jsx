import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useProPreview } from '../context/proPreview'
import Chatbot from './Chatbot'

const LIGHT_MODE_CSS = `
html[data-theme="light"] body { background-color: #f4f3ef; color: #111; }
html[data-theme="light"] .grid-bg {
  background-color: #f4f3ef !important;
  background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px) !important;
}
html[data-theme="light"] .glass {
  background: rgba(255,255,255,0.93) !important;
  border-color: rgba(0,0,0,0.09) !important;
}
html[data-theme="light"] .glass-gold {
  background: rgba(212,175,55,0.07) !important;
  border-color: rgba(212,175,55,0.3) !important;
}
html[data-theme="light"] .stat-card {
  background: #fff !important;
  border-color: rgba(0,0,0,0.09) !important;
}
html[data-theme="light"] .nav-link {
  color: rgba(0,0,0,0.52) !important;
}
html[data-theme="light"] .nav-link:hover {
  background: rgba(0,0,0,0.05) !important;
  color: #111 !important;
}
html[data-theme="light"] .nav-link.active {
  background: rgba(212,175,55,0.1) !important;
  color: #0a0a0a !important;
  border-color: rgba(212,175,55,0.3) !important;
}
html[data-theme="light"] .section-label { color: rgba(0,0,0,0.38) !important; }
html[data-theme="light"] .btn-primary { background: #D4AF37 !important; color: #0a0a0a !important; }
html[data-theme="light"] aside {
  background: rgba(248,247,244,0.99) !important;
  border-right-color: rgba(0,0,0,0.09) !important;
}
html[data-theme="light"] header {
  background: rgba(248,247,244,0.97) !important;
  border-bottom-color: rgba(0,0,0,0.09) !important;
}
html[data-theme="light"] .text-white { color: #111 !important; }
html[data-theme="light"] .text-gray-400 { color: rgba(0,0,0,0.5) !important; }
html[data-theme="light"] .text-gray-500 { color: rgba(0,0,0,0.4) !important; }
html[data-theme="light"] .text-gray-600 { color: rgba(0,0,0,0.33) !important; }
html[data-theme="light"] .text-gray-700 { color: rgba(0,0,0,0.43) !important; }
html[data-theme="light"] .border-t,
html[data-theme="light"] .border-b { border-color: rgba(0,0,0,0.08); }
`

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(() => {
        try { return JSON.parse(localStorage.getItem('altus_collapsed_sidebar') || 'false') } catch { return false }
    })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [time, setTime] = useState('')
    const [devProPreview] = useProPreview()
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

    const username = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Broker'
    const userInitials = username.substring(0, 2).toUpperCase()
    const isPro = plan === 'pro' || devProPreview

    useEffect(() => {
        const existing = document.getElementById('altus-light-mode-css')
        if (!existing) {
            const style = document.createElement('style')
            style.id = 'altus-light-mode-css'
            style.textContent = LIGHT_MODE_CSS
            document.head.appendChild(style)
        }
        const savedTheme = localStorage.getItem('altus_theme') || 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    useEffect(() => {
        localStorage.setItem('altus_collapsed_sidebar', JSON.stringify(collapsed))
    }, [collapsed])

    useEffect(() => {
        const style = document.createElement('style')
        style.id = 'hide-landinghero-in-app'
        style.textContent = `
      iframe[src*="landinghero"], div[id*="landinghero"], div[class*="landinghero"],
      div[id*="blackbox"], div[class*="blackbox"], #blackbox-root, .blackbox-widget {
        display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
      }
    `
        document.head.appendChild(style)
        return () => { const el = document.getElementById('hide-landinghero-in-app'); if (el) el.remove() }
    }, [])

    useEffect(() => { setMobileMenuOpen(false); setProfileOpen(false) }, [location])

    useEffect(() => {
        const tick = () => {
            setTime(new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
            }).format(new Date()))
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            const clickedDesktop = profileRef.current && profileRef.current.contains(e.target)
            const clickedMobile = mobileProfileRef.current && mobileProfileRef.current.contains(e.target)
            if (!clickedDesktop && !clickedMobile) setProfileOpen(false)
        }
        if (profileOpen) document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [profileOpen])

    const toggleProfile = useCallback((e) => { e.stopPropagation(); setProfileOpen(prev => !prev) }, [])

    const navItems = [
        { path: '/app/dashboard', label: 'Dashboard', icon: '⬡' },
        { path: '/app/intel', label: 'Intel', icon: '◈' },
        { path: '/app/fleet', label: 'Fleet', icon: '✈' },
        { path: '/app/track', label: 'Track', icon: '◉' },
        { path: '/app/plan', label: 'Plan', icon: '◇' },
        { path: '/app/billing', label: 'Billing', icon: '○' },
    ]

    const ProfileDropdown = profileOpen ? (
        <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            style={{
                position: 'absolute', left: 0, top: 'calc(100% + 6px)', width: '220px',
                background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px', boxShadow: '0 16px 48px rgba(0,0,0,0.8)', zIndex: 200, overflow: 'hidden',
            }}
        >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ ...EYEBROW, color: '#444', marginBottom: '4px' }}>Signed in as</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</p>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ ...EYEBROW, color: '#444' }}>Plan</p>
                <span style={{
                    ...MONO, fontSize: '10px', letterSpacing: '0.12em',
                    color: isPro ? '#D4AF37' : '#555',
                    background: isPro ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isPro ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    padding: '2px 8px', borderRadius: '9999px',
                }}>
                    {isPro ? 'PRO' : 'FREE'}
                </span>
            </div>
            <Link
                to="/app/settings"
                onClick={() => setProfileOpen(false)}
                style={{ display: 'block', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999', textDecoration: 'none', transition: 'all 0.15s', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'transparent' }}
            >
                Account Settings
            </Link>
            <button
                onClick={handleSignOut}
                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                Sign Out
            </button>
        </motion.div>
    ) : null

    return (
        <div className="flex h-screen bg-jet overflow-hidden">

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 56 : 224 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}
                className="hidden md:flex flex-col"
            >
                {/* Logo */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Link to="/app/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#D4AF37', letterSpacing: '0.25em' }}>ALTUS</span>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', background: '#D4AF37', color: '#0a0a0a', padding: '2px 6px', letterSpacing: '0.12em', borderRadius: '2px' }}>AERO</span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', padding: '4px', transition: 'color 0.2s', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                        onMouseLeave={e => e.currentTarget.style.color = '#444'}
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* User block */}
                <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }} ref={profileRef}>
                    <button
                        onClick={toggleProfile}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                            padding: '8px', background: profileOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
                            border: '1px solid', borderColor: profileOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', borderRadius: '6px',
                        }}
                        onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                        onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'transparent' }}
                    >
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1e3a8a', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', color: '#D4AF37' }}>{userInitials}</span>
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</p>
                                    <p style={{ ...MONO, fontSize: '9px', color: isPro ? '#D4AF37' : '#444', letterSpacing: '0.1em' }}>{isPro ? 'PRO' : 'FREE'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!collapsed && (
                            <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ ...MONO, fontSize: '10px', color: '#333', flexShrink: 0 }}>▾</motion.span>
                        )}
                    </button>
                    <AnimatePresence>{ProfileDropdown}</AnimatePresence>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.12em' }}>
                                        {item.label.toUpperCase()}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                {/* Back to site */}
                <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>
                        <span style={{ flexShrink: 0, fontSize: '12px' }}>←</span>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.1em' }}>
                                    SITE
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Header */}
                <header
                    style={{ background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden"
                            style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                        >
                            ☰
                        </button>
                        <Link to="/app/dashboard" className="md:hidden" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#D4AF37', letterSpacing: '0.2em' }}>ALTUS</span>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', background: '#D4AF37', color: '#0a0a0a', padding: '2px 6px', letterSpacing: '0.12em', borderRadius: '2px' }}>AERO</span>
                        </Link>
                        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                            <span style={{ ...MONO, fontSize: '9px', color: '#444', letterSpacing: '0.12em' }}>LIVE</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ ...MONO, fontSize: '12px', color: '#D4AF37', letterSpacing: '0.06em' }}>{time} IST</span>
                        {!isPro && (
                            <button
                                onClick={() => navigate('/app/billing')}
                                style={{
                                    ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '7px 16px',
                                    background: '#D4AF37', color: '#0a0a0a', border: 'none', borderRadius: '9999px',
                                    cursor: 'pointer', transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                UPGRADE
                            </button>
                        )}
                        {isPro && (
                            <span style={{ ...MONO, fontSize: '10px', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', padding: '5px 12px', borderRadius: '9999px', letterSpacing: '0.15em' }}>
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
                    className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
                    style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-600'}`
                            }
                        >
                            <span style={{ fontSize: '14px' }}>{item.icon}</span>
                            <span style={{ ...MONO, fontSize: '8px', letterSpacing: '0.1em' }}>{item.label.toUpperCase()}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Mobile Slide-out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
                        />
                        <motion.div
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px', zIndex: 50, display: 'flex', flexDirection: 'column', background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <Link to="/app/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#D4AF37', letterSpacing: '0.2em' }}>ALTUS</span>
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', background: '#D4AF37', color: '#0a0a0a', padding: '2px 6px', borderRadius: '2px' }}>AERO</span>
                                </Link>
                                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                            </div>

                            <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }} ref={mobileProfileRef}>
                                <button
                                    onClick={toggleProfile}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e3a8a', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', color: '#D4AF37' }}>{userInitials}</span>
                                    </div>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#fff' }}>{username}</p>
                                        <p style={{ ...MONO, fontSize: '9px', color: isPro ? '#D4AF37' : '#444', letterSpacing: '0.1em' }}>{isPro ? 'PRO' : 'FREE'} · tap to manage</p>
                                    </div>
                                    <span style={{ color: '#333', fontSize: '10px' }}>▾</span>
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                            style={{ position: 'absolute', left: '12px', right: '12px', top: 'calc(100% + 4px)', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden', zIndex: 200 }}
                                        >
                                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p style={{ ...EYEBROW, color: '#444' }}>Plan</p>
                                                <span style={{ ...MONO, fontSize: '10px', color: isPro ? '#D4AF37' : '#555', background: isPro ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPro ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)'}`, padding: '2px 8px', borderRadius: '9999px' }}>
                                                    {isPro ? 'PRO' : 'FREE'}
                                                </span>
                                            </div>
                                            <Link to="/app/settings" onClick={() => { setProfileOpen(false); setMobileMenuOpen(false) }} style={{ display: 'block', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#999', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                Account Settings
                                            </Link>
                                            <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        <span style={{ fontSize: '14px' }}>{item.icon}</span>
                                        <span style={{ ...MONO, fontSize: '10px', letterSpacing: '0.12em' }}>{item.label.toUpperCase()}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>
                                    <span style={{ fontSize: '12px' }}>←</span>
                                    <span style={{ ...MONO, fontSize: '10px', letterSpacing: '0.1em' }}>BACK TO SITE</span>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Chatbot />
        </div>
    )
}