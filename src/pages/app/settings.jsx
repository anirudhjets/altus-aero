import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Section = ({ title, children }) => (
    <div className="glass overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[#1c1c1c]">
            <p className="section-label">{title}</p>
        </div>
        <div className="p-4 md:p-6 space-y-5">{children}</div>
    </div>
)

const Field = ({ label, hint, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="sm:max-w-xs">
            <p className="font-mono text-sm text-white">{label}</p>
            {hint && <p className="font-body text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
        <div className="sm:w-72 flex-shrink-0">{children}</div>
    </div>
)

const Toggle = ({ value, onChange }) => (
    <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-gold' : 'bg-[#1c1c1c] border border-[#333]'}`}
    >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-jet transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
)

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #1c1c1c',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
}

export default function Settings() {
    const { user, plan, signOut } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    const isPro = plan === 'pro'

    const fullName = user?.user_metadata?.full_name || ''
    const email = user?.email || ''
    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || email?.split('@')[0] || 'Broker'
    const initials = displayName.substring(0, 2).toUpperCase()

    // Profile state
    const [newName, setNewName] = useState(fullName)
    const [nameLoading, setNameLoading] = useState(false)
    const [nameMsg, setNameMsg] = useState('')
    const [nameError, setNameError] = useState('')

    // Password state
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // Notifications — persisted to localStorage
    const [notif, setNotif] = useState(() => {
        try {
            const saved = localStorage.getItem('altus_notif_prefs')
            return saved ? JSON.parse(saved) : {
                marketInsights: true,
                weeklyDigest: true,
                billingReminders: true,
                flightAlerts: false,
                productUpdates: true,
            }
        } catch {
            return { marketInsights: true, weeklyDigest: true, billingReminders: true, flightAlerts: false, productUpdates: true }
        }
    })
    const [notifSaved, setNotifSaved] = useState(false)

    // Theme — persisted to localStorage
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('altus_theme') || 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('altus_theme', theme)
    }, [theme])

    // Delete account
    const [deleteConfirm, setDeleteConfirm] = useState('')
    const [showDelete, setShowDelete] = useState(false)

    const handleNameUpdate = async () => {
        setNameError('')
        setNameMsg('')
        if (!newName.trim() || newName.trim().length < 2) {
            setNameError('Name must be at least 2 characters.')
            return
        }
        setNameLoading(true)
        const { error } = await supabase.auth.updateUser({ data: { full_name: newName.trim() } })
        if (error) {
            setNameError(error.message)
        } else {
            setNameMsg('Name updated.')
        }
        setNameLoading(false)
    }

    const handlePasswordUpdate = async () => {
        setPasswordError('')
        setPasswordMsg('')
        if (!newPassword || newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.')
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }
        setPasswordLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) {
            setPasswordError(error.message)
        } else {
            setPasswordMsg('Password updated.')
            setNewPassword('')
            setConfirmPassword('')
        }
        setPasswordLoading(false)
    }

    const handleNotifSave = () => {
        localStorage.setItem('altus_notif_prefs', JSON.stringify(notif))
        setNotifSaved(true)
        setTimeout(() => setNotifSaved(false), 2000)
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== email) return
        await signOut()
        navigate('/')
    }

    const tabs = [
        { key: 'profile', label: 'Profile' },
        { key: 'account', label: 'Account' },
        { key: 'notifications', label: 'Notifications' },
        { key: 'appearance', label: 'Appearance' },
        { key: 'subscription', label: 'Subscription' },
    ]

    return (
        <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">

            {/* Header */}
            <div>
                <p className="section-label">PREFERENCES</p>
                <h1 className="font-display text-3xl md:text-4xl text-white">SETTINGS</h1>
                <p className="font-body text-gray-400 text-sm mt-1">Manage your account, preferences, and subscription.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`font-mono text-xs tracking-widest px-4 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.key ? 'bg-gold text-jet' : 'glass text-gray-400 hover:text-gold'}`}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-4">
                    <Section title="PROFILE">

                        {/* Avatar — plan synced from auth */}
                        <Field label="Your Profile" hint="Your display name and current plan.">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#1e3a8a] border border-gold/20 flex items-center justify-center flex-shrink-0">
                                    <span className="font-display text-xl text-gold">{initials}</span>
                                </div>
                                <div>
                                    <p className="font-mono text-sm text-white">{displayName}</p>
                                    <span style={{
                                        fontFamily: 'Bebas Neue, sans-serif',
                                        fontSize: '11px',
                                        letterSpacing: '0.12em',
                                        color: isPro ? '#D4AF37' : '#6b7280',
                                        background: isPro ? 'rgba(212,175,55,0.1)' : 'rgba(107,114,128,0.1)',
                                        border: `1px solid ${isPro ? 'rgba(212,175,55,0.25)' : 'rgba(107,114,128,0.2)'}`,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        marginTop: '4px',
                                    }}>
                                        {isPro ? 'PRO' : 'FREE'}
                                    </span>
                                </div>
                            </div>
                        </Field>

                        <div className="border-t border-[#1c1c1c] pt-5">
                            <Field label="Display Name" hint="Shown in the sidebar and your profile.">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        maxLength={40}
                                        placeholder="Your full name"
                                        style={inputStyle}
                                    />
                                    {nameError && <p className="font-mono text-xs text-red-400">{nameError}</p>}
                                    {nameMsg && <p className="font-mono text-xs text-green-400">{nameMsg}</p>}
                                    <button
                                        onClick={handleNameUpdate}
                                        disabled={nameLoading}
                                        className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
                                    >
                                        {nameLoading ? 'SAVING...' : 'SAVE NAME'}
                                    </button>
                                </div>
                            </Field>
                        </div>

                        <div className="border-t border-[#1c1c1c] pt-5">
                            <Field label="Email" hint="Your login email. Cannot be changed here.">
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }}
                                />
                            </Field>
                        </div>

                    </Section>
                </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
                <div className="space-y-4">
                    <Section title="CHANGE PASSWORD">
                        <Field label="New Password" hint="Minimum 6 characters. Does not affect Google sign-in.">
                            <div className="space-y-2">
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" style={inputStyle} />
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" style={inputStyle} />
                                {passwordError && <p className="font-mono text-xs text-red-400">{passwordError}</p>}
                                {passwordMsg && <p className="font-mono text-xs text-green-400">{passwordMsg}</p>}
                                <button onClick={handlePasswordUpdate} disabled={passwordLoading} className="btn-primary text-xs py-2 px-4 w-full sm:w-auto">
                                    {passwordLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                                </button>
                            </div>
                        </Field>
                    </Section>

                    <Section title="SESSIONS">
                        <Field label="Sign out everywhere" hint="Ends all active sessions on all devices.">
                            <button
                                onClick={async () => { await signOut(); navigate('/') }}
                                className="font-display text-xs tracking-widest px-4 py-2 border border-[#333] text-gray-400 hover:border-gold hover:text-gold rounded-lg transition-all w-full sm:w-auto"
                            >
                                SIGN OUT ALL DEVICES
                            </button>
                        </Field>
                    </Section>

                    <Section title="DANGER ZONE">
                        <Field label="Delete account" hint="Permanent and cannot be undone. Type your email to confirm.">
                            {!showDelete ? (
                                <button onClick={() => setShowDelete(true)} className="font-display text-xs tracking-widest px-4 py-2 border border-red-800 text-red-400 hover:border-red-400 rounded-lg transition-all w-full sm:w-auto">
                                    DELETE ACCOUNT
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="font-mono text-xs text-red-400">Type your email to confirm:</p>
                                    <input
                                        type="text"
                                        value={deleteConfirm}
                                        onChange={e => setDeleteConfirm(e.target.value)}
                                        placeholder={email}
                                        style={{ ...inputStyle, borderColor: '#7f1d1d' }}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteConfirm !== email}
                                            style={{
                                                background: deleteConfirm === email ? '#dc2626' : '#1c1c1c',
                                                color: deleteConfirm === email ? '#fff' : '#4b5563',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '8px 16px',
                                                fontFamily: 'Bebas Neue',
                                                fontSize: '12px',
                                                letterSpacing: '0.1em',
                                                cursor: deleteConfirm === email ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            CONFIRM DELETE
                                        </button>
                                        <button onClick={() => { setShowDelete(false); setDeleteConfirm('') }} className="font-display text-xs tracking-widest px-4 py-2 glass text-gray-400 hover:text-white rounded-lg transition-all">
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Field>
                    </Section>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="space-y-4">
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
                                    <div className="flex justify-start sm:justify-end">
                                        <Toggle value={notif[item.key]} onChange={v => setNotif(prev => ({ ...prev, [item.key]: v }))} />
                                    </div>
                                </Field>
                                {i < arr.length - 1 && <div className="border-t border-[#1c1c1c] mt-5" />}
                            </div>
                        ))}
                    </Section>

                    <div className="flex justify-end">
                        <button onClick={handleNotifSave} className="btn-primary text-xs py-2 px-6">
                            {notifSaved ? 'SAVED' : 'SAVE PREFERENCES'}
                        </button>
                    </div>
                </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
                <div className="space-y-4">
                    <Section title="THEME">
                        <Field label="Interface Theme" hint="Choose how Altus Aero looks for you.">
                            <div className="flex gap-2">
                                {[
                                    { value: 'dark', label: 'Dark', icon: '◑' },
                                    { value: 'light', label: 'Light', icon: '○' },
                                ].map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '8px',
                                            fontFamily: 'Bebas Neue, sans-serif',
                                            fontSize: '12px',
                                            letterSpacing: '0.12em',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: theme === t.value ? 'rgba(212,175,55,0.1)' : 'transparent',
                                            color: theme === t.value ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                                            border: theme === t.value ? '1px solid rgba(212,175,55,0.3)' : '1px solid #1c1c1c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        <span>{t.icon}</span>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </Section>

                    <Section title="LAYOUT">
                        <Field label="Collapsed Sidebar by Default" hint="Start with the sidebar collapsed on every session.">
                            <div className="flex justify-start sm:justify-end">
                                <Toggle
                                    value={JSON.parse(localStorage.getItem('altus_collapsed_sidebar') || 'false')}
                                    onChange={v => {
                                        localStorage.setItem('altus_collapsed_sidebar', JSON.stringify(v))
                                        setActiveTab('appearance')
                                    }}
                                />
                            </div>
                        </Field>
                    </Section>
                </div>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'subscription' && (
                <div className="space-y-4">
                    <Section title="CURRENT PLAN">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-display text-3xl mb-1" style={{ color: isPro ? '#D4AF37' : '#6b7280' }}>
                                    {isPro ? 'PRO' : 'FREE'}
                                </p>
                                <p className="font-mono text-xs text-gray-400 mb-2">
                                    {isPro ? 'Full platform access · AI advisor included' : 'Core features · Upgrade to unlock everything'}
                                </p>
                                {isPro && (
                                    <p className="font-display text-2xl text-white">₹2,499<span className="text-sm text-gray-400 font-body">/mo</span></p>
                                )}
                            </div>
                            <div>
                                <span className="font-mono text-xs px-3 py-1.5 rounded border inline-block" style={{
                                    color: isPro ? '#4ade80' : '#6b7280',
                                    background: isPro ? 'rgba(74,222,128,0.08)' : 'rgba(107,114,128,0.08)',
                                    borderColor: isPro ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.2)',
                                }}>
                                    {isPro ? 'Active' : 'Free tier'}
                                </span>
                            </div>
                        </div>
                    </Section>

                    {!isPro && (
                        <Section title="UPGRADE TO PRO">
                            <div className="space-y-4">
                                <p className="font-body text-sm text-gray-400 leading-relaxed">
                                    Pro unlocks the full platform — real-time market data, Broker Insights on every aircraft, 3D cockpit views, live flight tracking, client framing on every cost calculation, and the AI Advisor powered by Claude.
                                </p>
                                <button
                                    onClick={() => navigate('/app/billing')}
                                    className="btn-primary text-xs py-2.5 px-6 w-full sm:w-auto"
                                >
                                    VIEW PLANS AND UPGRADE
                                </button>
                            </div>
                        </Section>
                    )}

                    {isPro && (
                        <Section title="MANAGE">
                            <Field label="Billing" hint="View invoices and manage your subscription.">
                                <button onClick={() => navigate('/app/billing')} className="btn-primary text-xs py-2 px-4 w-full sm:w-auto">
                                    GO TO BILLING
                                </button>
                            </Field>
                            <div className="border-t border-[#1c1c1c] pt-5">
                                <Field label="Cancel Subscription" hint="Your access continues until the end of the billing period.">
                                    <button className="font-display text-xs tracking-widest px-4 py-2 border border-[#333] text-gray-500 hover:border-red-800 hover:text-red-400 rounded-lg transition-all w-full sm:w-auto">
                                        CANCEL PLAN
                                    </button>
                                </Field>
                            </div>
                        </Section>
                    )}
                </div>
            )}
        </div>
    )
}