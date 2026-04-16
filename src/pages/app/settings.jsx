import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const EYEBROW = { ...MONO, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }

const inputStyle = {
    width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    padding: '11px 14px', color: '#ffffff', fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const Section = ({ title, children }) => (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={EYEBROW}>{title}</p>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>{children}</div>
    </div>
)

const Field = ({ label, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="sm:flex-row sm:items-start sm:justify-between">
        <div style={{ maxWidth: '280px' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{label}</p>
            {hint && <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '4px', lineHeight: 1.6, letterSpacing: '0.04em' }}>{hint}</p>}
        </div>
        <div style={{ minWidth: '240px' }}>{children}</div>
    </div>
)

const Toggle = ({ value, onChange }) => (
    <button
        onClick={() => onChange(!value)}
        style={{ width: '44px', height: '24px', borderRadius: '9999px', background: value ? '#0ABFBC' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
        <span style={{ position: 'absolute', top: '3px', left: value ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: value ? '#0a0a0a' : '#333', transition: 'left 0.2s' }} />
    </button>
)

export default function Settings() {
    const { user, plan, signOut } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    const isPro = plan === 'pro'

    const fullName = user?.user_metadata?.full_name || ''
    const email = user?.email || ''
    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || email?.split('@')[0] || 'Broker'
    const initials = displayName.substring(0, 2).toUpperCase()

    const [newName, setNewName] = useState(fullName)
    const [nameLoading, setNameLoading] = useState(false)
    const [nameMsg, setNameMsg] = useState('')
    const [nameError, setNameError] = useState('')

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [notif, setNotif] = useState(() => {
        try {
            const saved = localStorage.getItem('altus_notif_prefs')
            return saved ? JSON.parse(saved) : { marketInsights: true, weeklyDigest: true, billingReminders: true, flightAlerts: false, productUpdates: true }
        } catch { return { marketInsights: true, weeklyDigest: true, billingReminders: true, flightAlerts: false, productUpdates: true } }
    })
    const [notifSaved, setNotifSaved] = useState(false)

    const [theme, setTheme] = useState(() => localStorage.getItem('altus_theme') || 'dark')
    const [collapsedDefault, setCollapsedDefault] = useState(() => {
        try { return JSON.parse(localStorage.getItem('altus_collapsed_sidebar') || 'false') } catch { return false }
    })

    useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('altus_theme', theme) }, [theme])

    const [deleteConfirm, setDeleteConfirm] = useState('')
    const [showDelete, setShowDelete] = useState(false)

    const handleNameUpdate = async () => {
        setNameError(''); setNameMsg('')
        if (!newName.trim() || newName.trim().length < 2) { setNameError('Name must be at least 2 characters.'); return }
        setNameLoading(true)
        const { error } = await supabase.auth.updateUser({ data: { full_name: newName.trim() } })
        if (error) setNameError(error.message); else setNameMsg('Name updated.')
        setNameLoading(false)
    }

    const handlePasswordUpdate = async () => {
        setPasswordError(''); setPasswordMsg('')
        if (!newPassword || newPassword.length < 6) { setPasswordError('New password must be at least 6 characters.'); return }
        if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }
        setPasswordLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) setPasswordError(error.message); else { setPasswordMsg('Password updated.'); setNewPassword(''); setConfirmPassword('') }
        setPasswordLoading(false)
    }

    const handleNotifSave = () => { localStorage.setItem('altus_notif_prefs', JSON.stringify(notif)); setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2000) }
    const handleCollapsedChange = v => { setCollapsedDefault(v); localStorage.setItem('altus_collapsed_sidebar', JSON.stringify(v)) }
    const handleDeleteAccount = async () => { if (deleteConfirm !== email) return; await signOut(); navigate('/') }

    const tabs = [
        { key: 'profile', label: 'Profile' },
        { key: 'account', label: 'Account' },
        { key: 'notifications', label: 'Notifications' },
        { key: 'appearance', label: 'Appearance' },
        { key: 'subscription', label: 'Subscription' },
    ]

    const PillBtn = ({ children, onClick, danger = false, disabled = false }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '9px 20px',
                background: danger ? 'transparent' : disabled ? 'rgba(10,191,188,0.3)' : '#0ABFBC',
                color: danger ? '#f87171' : '#0a0a0a',
                border: danger ? '1px solid rgba(127,29,29,0.5)' : 'none',
                borderRadius: '9999px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
            {children}
        </button>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '760px', margin: '0 auto' }}>

            {/* Header */}
            <div>
                <p style={EYEBROW}>Preferences</p>
                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', color: '#ffffff', lineHeight: 1.0, letterSpacing: '0.02em', marginTop: '6px' }}>SETTINGS</h1>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', marginTop: '6px' }}>Manage your account, preferences, and subscription.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            ...MONO, fontSize: '10px', letterSpacing: '0.15em', padding: '8px 16px', whiteSpace: 'nowrap',
                            background: activeTab === tab.key ? '#0ABFBC' : 'transparent',
                            color: activeTab === tab.key ? '#0a0a0a' : '#444',
                            border: activeTab === tab.key ? '1px solid #0ABFBC' : '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                        }}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* PROFILE */}
            {activeTab === 'profile' && (
                <Section title="PROFILE">
                    <Field label="Your Profile" hint="Display name and current plan.">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0a1a1a', border: '1px solid rgba(10,191,188,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#0ABFBC' }}>{initials}</span>
                            </div>
                            <div>
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{displayName}</p>
                                <span style={{
                                    ...MONO, fontSize: '9px', letterSpacing: '0.12em', color: isPro ? '#0ABFBC' : '#444',
                                    background: isPro ? 'rgba(10,191,188,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isPro ? 'rgba(10,191,188,0.2)' : 'rgba(255,255,255,0.08)'}`,
                                    padding: '2px 8px', borderRadius: '9999px', display: 'inline-block', marginTop: '4px',
                                }}>
                                    {isPro ? 'PRO' : 'FREE'}
                                </span>
                            </div>
                        </div>
                    </Field>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                        <Field label="Display Name" hint="Shown in the sidebar and profile.">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} maxLength={40} placeholder="Your full name" style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(10,191,188,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                                {nameError && <p style={{ ...MONO, fontSize: '9px', color: '#f87171' }}>{nameError}</p>}
                                {nameMsg && <p style={{ ...MONO, fontSize: '9px', color: '#4ade80' }}>{nameMsg}</p>}
                                <PillBtn onClick={handleNameUpdate} disabled={nameLoading}>{nameLoading ? 'SAVING...' : 'SAVE NAME'}</PillBtn>
                            </div>
                        </Field>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                        <Field label="Email" hint="Your login email. Cannot be changed here.">
                            <input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.3, cursor: 'not-allowed' }} />
                        </Field>
                    </div>
                </Section>
            )}

            {/* ACCOUNT */}
            {activeTab === 'account' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <Section title="CHANGE PASSWORD">
                        <Field label="New Password" hint="Minimum 6 characters.">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(10,191,188,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(10,191,188,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                                {passwordError && <p style={{ ...MONO, fontSize: '9px', color: '#f87171' }}>{passwordError}</p>}
                                {passwordMsg && <p style={{ ...MONO, fontSize: '9px', color: '#4ade80' }}>{passwordMsg}</p>}
                                <PillBtn onClick={handlePasswordUpdate} disabled={passwordLoading}>{passwordLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}</PillBtn>
                            </div>
                        </Field>
                    </Section>

                    <Section title="SESSIONS">
                        <Field label="Sign out everywhere" hint="Ends all active sessions on all devices.">
                            <PillBtn onClick={async () => { await signOut(); navigate('/') }}>SIGN OUT ALL DEVICES</PillBtn>
                        </Field>
                    </Section>

                    <Section title="DANGER ZONE">
                        <Field label="Delete account" hint="Permanent and cannot be undone. Type your email to confirm.">
                            {!showDelete ? (
                                <PillBtn onClick={() => setShowDelete(true)} danger>DELETE ACCOUNT</PillBtn>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <p style={{ ...MONO, fontSize: '9px', color: '#f87171' }}>Type your email to confirm:</p>
                                    <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={email} style={{ ...inputStyle, borderColor: 'rgba(127,29,29,0.5)' }} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteConfirm !== email}
                                            style={{ ...MONO, fontSize: '10px', letterSpacing: '0.12em', padding: '9px 18px', background: deleteConfirm === email ? '#dc2626' : 'rgba(220,38,38,0.1)', color: deleteConfirm === email ? '#fff' : '#555', border: 'none', borderRadius: '9999px', cursor: deleteConfirm === email ? 'pointer' : 'not-allowed' }}
                                        >
                                            CONFIRM DELETE
                                        </button>
                                        <button onClick={() => { setShowDelete(false); setDeleteConfirm('') }} style={{ ...MONO, fontSize: '10px', letterSpacing: '0.12em', padding: '9px 18px', background: 'transparent', color: '#444', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9999px', cursor: 'pointer' }}>
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Field>
                    </Section>
                </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Section title="EMAIL PREFERENCES">
                        {[
                            { key: 'marketInsights', label: 'Market Insights', hint: 'Daily broker intelligence delivered to your inbox.' },
                            { key: 'weeklyDigest', label: 'Weekly Digest', hint: 'A summary of market moves, fleet changes, and route demand.' },
                            { key: 'billingReminders', label: 'Billing Reminders', hint: 'Get notified before your subscription renews.' },
                            { key: 'flightAlerts', label: 'Flight Alerts', hint: 'Real-time notifications for tracked routes.' },
                            { key: 'productUpdates', label: 'Product Updates', hint: 'New features, tools, and platform improvements.' },
                        ].map((item, i, arr) => (
                            <div key={item.key}>
                                <Field label={item.label} hint={item.hint}>
                                    <Toggle value={notif[item.key]} onChange={v => setNotif(prev => ({ ...prev, [item.key]: v }))} />
                                </Field>
                                {i < arr.length - 1 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }} />}
                            </div>
                        ))}
                    </Section>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <PillBtn onClick={handleNotifSave}>{notifSaved ? 'SAVED' : 'SAVE PREFERENCES'}</PillBtn>
                    </div>
                </div>
            )}

            {/* APPEARANCE */}
            {activeTab === 'appearance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <Section title="THEME">
                        <Field label="Interface Theme" hint="Choose how Altus Aero looks for you.">
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[{ value: 'dark', label: 'DARK' }, { value: 'light', label: 'LIGHT' }].map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        style={{
                                            flex: 1, padding: '10px', ...MONO, fontSize: '10px', letterSpacing: '0.12em',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            background: theme === t.value ? 'rgba(10,191,188,0.08)' : 'transparent',
                                            color: theme === t.value ? '#0ABFBC' : '#444',
                                            border: theme === t.value ? '1px solid rgba(10,191,188,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '9999px',
                                        }}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </Section>

                    <Section title="LAYOUT">
                        <Field label="Collapsed Sidebar by Default" hint="Start with the sidebar collapsed on every session.">
                            <Toggle value={collapsedDefault} onChange={handleCollapsedChange} />
                        </Field>
                    </Section>
                </div>
            )}

            {/* SUBSCRIPTION */}
            {activeTab === 'subscription' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <Section title="CURRENT PLAN">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                            <div>
                                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '44px', color: isPro ? '#0ABFBC' : '#333', lineHeight: 1 }}>{isPro ? 'PRO' : 'FREE'}</p>
                                <p style={{ ...MONO, fontSize: '9px', color: '#444', marginTop: '6px' }}>{isPro ? 'Full platform access · AI advisor included' : 'Core features · Upgrade to unlock everything'}</p>
                                {isPro && <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#ffffff', marginTop: '8px', lineHeight: 1 }}>₹2,499<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#444' }}>/mo</span></p>}
                            </div>
                            <span style={{ ...MONO, fontSize: '9px', letterSpacing: '0.12em', padding: '5px 14px', borderRadius: '9999px', color: isPro ? '#4ade80' : '#444', background: isPro ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isPro ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                                {isPro ? 'ACTIVE' : 'FREE TIER'}
                            </span>
                        </div>
                    </Section>

                    {!isPro && (
                        <Section title="UPGRADE TO PRO">
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#555', lineHeight: 1.75 }}>
                                Pro unlocks the full platform — real-time market data, Broker Insights on every aircraft, 3D cockpit views, live flight tracking, client framing on every cost calculation, and the AI Advisor powered by Claude.
                            </p>
                            <PillBtn onClick={() => navigate('/app/billing')}>VIEW PLANS AND UPGRADE</PillBtn>
                        </Section>
                    )}

                    {isPro && (
                        <Section title="MANAGE">
                            <Field label="Billing" hint="View invoices and manage your subscription.">
                                <PillBtn onClick={() => navigate('/app/billing')}>GO TO BILLING</PillBtn>
                            </Field>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <Field label="Cancel Subscription" hint="Your access continues until the end of the billing period.">
                                    <PillBtn onClick={() => window.open('mailto:anirudh.jets@gmail.com?subject=Cancel%20Subscription', '_blank')} danger>CANCEL PLAN</PillBtn>
                                </Field>
                            </div>
                        </Section>
                    )}
                </div>
            )}
        </div>
    )
}