import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Section = ({ title, children }) => (
    <div className="glass overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[#1c1c1c]">
            <p className="section-label">{title}</p>
        </div>
        <div className="p-4 md:p-6 space-y-5">
            {children}
        </div>
    </div>
)

const Field = ({ label, hint, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="sm:max-w-xs">
            <p className="font-mono text-sm text-white">{label}</p>
            {hint && <p className="font-body text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
        <div className="sm:w-72 flex-shrink-0">
            {children}
        </div>
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
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')

    const username = user?.user_metadata?.username || ''
    const email = user?.email || ''

    // Profile state
    const [newUsername, setNewUsername] = useState(username)
    const [usernameLoading, setUsernameLoading] = useState(false)
    const [usernameMsg, setUsernameMsg] = useState('')
    const [usernameError, setUsernameError] = useState('')

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // Notification state
    const [notif, setNotif] = useState({
        marketInsights: true,
        weeklyDigest: true,
        billingReminders: true,
        flightAlerts: false,
        productUpdates: true,
    })

    // Appearance state
    const [appearance, setAppearance] = useState({
        collapsedSidebar: false,
        compactMode: false,
        showApiUsage: true,
    })

    // Delete account
    const [deleteConfirm, setDeleteConfirm] = useState('')
    const [showDelete, setShowDelete] = useState(false)

    const handleUsernameUpdate = async () => {
        setUsernameError('')
        setUsernameMsg('')
        if (!newUsername.trim() || newUsername.trim().length < 3) {
            setUsernameError('Username must be at least 3 characters.')
            return
        }
        if (!/^[a-zA-Z0-9_]+$/.test(newUsername.trim())) {
            setUsernameError('Only letters, numbers, and underscores allowed.')
            return
        }
        setUsernameLoading(true)
        const { error } = await supabase.auth.updateUser({ data: { username: newUsername.trim() } })
        if (error) {
            setUsernameError(error.message)
        } else {
            setUsernameMsg('Username updated successfully.')
        }
        setUsernameLoading(false)
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
            setPasswordMsg('Password updated successfully.')
            setNewPassword('')
            setConfirmPassword('')
            setCurrentPassword('')
        }
        setPasswordLoading(false)
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== username) return
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
                        <Field label="Username" hint="Shown in the sidebar and on your profile.">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    maxLength={20}
                                    placeholder="Enter username"
                                    style={inputStyle}
                                />
                                {usernameError && <p className="font-mono text-xs text-red-400">{usernameError}</p>}
                                {usernameMsg && <p className="font-mono text-xs text-green-400">{usernameMsg}</p>}
                                <button
                                    onClick={handleUsernameUpdate}
                                    disabled={usernameLoading}
                                    className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
                                >
                                    {usernameLoading ? 'SAVING...' : 'SAVE USERNAME'}
                                </button>
                            </div>
                        </Field>

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

                        <div className="border-t border-[#1c1c1c] pt-5">
                            <Field label="Avatar" hint="Your initials are used as your avatar.">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gulf flex items-center justify-center flex-shrink-0">
                                        <span className="font-display text-xl text-white">
                                            {newUsername.substring(0, 2).toUpperCase() || 'AA'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-white">{newUsername || 'Your Username'}</p>
                                        <p className="font-mono text-xs text-gold mt-0.5">PRO TIER</p>
                                    </div>
                                </div>
                            </Field>
                        </div>
                    </Section>
                </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
                <div className="space-y-4">
                    <Section title="CHANGE PASSWORD">
                        <Field label="New Password" hint="Minimum 6 characters.">
                            <div className="space-y-2">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    style={inputStyle}
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    style={inputStyle}
                                />
                                {passwordError && <p className="font-mono text-xs text-red-400">{passwordError}</p>}
                                {passwordMsg && <p className="font-mono text-xs text-green-400">{passwordMsg}</p>}
                                <button
                                    onClick={handlePasswordUpdate}
                                    disabled={passwordLoading}
                                    className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
                                >
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
                        <Field label="Delete account" hint="This action is permanent and cannot be undone.">
                            {!showDelete ? (
                                <button
                                    onClick={() => setShowDelete(true)}
                                    className="font-display text-xs tracking-widest px-4 py-2 border border-red-800 text-red-400 hover:border-red-400 rounded-lg transition-all w-full sm:w-auto"
                                >
                                    DELETE ACCOUNT
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="font-mono text-xs text-red-400">Type your username to confirm deletion:</p>
                                    <input
                                        type="text"
                                        value={deleteConfirm}
                                        onChange={e => setDeleteConfirm(e.target.value)}
                                        placeholder={username}
                                        style={{ ...inputStyle, borderColor: '#7f1d1d' }}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteConfirm !== username}
                                            style={{
                                                background: deleteConfirm === username ? '#dc2626' : '#1c1c1c',
                                                color: deleteConfirm === username ? '#fff' : '#4b5563',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '8px 16px',
                                                fontFamily: 'Bebas Neue',
                                                fontSize: '12px',
                                                letterSpacing: '0.1em',
                                                cursor: deleteConfirm === username ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            CONFIRM DELETE
                                        </button>
                                        <button
                                            onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                                            className="font-display text-xs tracking-widest px-4 py-2 glass text-gray-400 hover:text-white rounded-lg transition-all"
                                        >
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
                <Section title="NOTIFICATIONS">
                    {[
                        { key: 'marketInsights', label: 'Market Insights', hint: 'Daily broker intelligence delivered to your inbox.' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', hint: 'A summary of market moves, fleet changes, and deals.' },
                        { key: 'billingReminders', label: 'Billing Reminders', hint: 'Get notified before your subscription renews.' },
                        { key: 'flightAlerts', label: 'Flight Alerts', hint: 'Real-time notifications for tracked routes.' },
                        { key: 'productUpdates', label: 'Product Updates', hint: 'New features, tools, and improvements.' },
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
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
                <Section title="APPEARANCE">
                    {[
                        { key: 'collapsedSidebar', label: 'Collapsed Sidebar by Default', hint: 'Start with the sidebar collapsed on every session.' },
                        { key: 'compactMode', label: 'Compact Mode', hint: 'Tighter spacing for power users who want more on screen.' },
                        { key: 'showApiUsage', label: 'Show API Usage in Header', hint: 'Display remaining API calls in the top bar.' },
                    ].map((item, i, arr) => (
                        <div key={item.key}>
                            <Field label={item.label} hint={item.hint}>
                                <div className="flex justify-start sm:justify-end">
                                    <Toggle value={appearance[item.key]} onChange={v => setAppearance(prev => ({ ...prev, [item.key]: v }))} />
                                </div>
                            </Field>
                            {i < arr.length - 1 && <div className="border-t border-[#1c1c1c] mt-5" />}
                        </div>
                    ))}
                    <div className="border-t border-[#1c1c1c] pt-5">
                        <Field label="Theme" hint="Dark mode is the only theme. It is not optional.">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] border border-[#1c1c1c] rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-gold" />
                                <span className="font-mono text-xs text-white">Dark — Always</span>
                            </div>
                        </Field>
                    </div>
                </Section>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'subscription' && (
                <div className="space-y-4">
                    <Section title="CURRENT PLAN">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-display text-3xl text-gold mb-1">PRO</p>
                                <p className="font-mono text-xs text-gray-400 mb-2">Master the fleet</p>
                                <p className="font-display text-2xl text-white">$99<span className="text-sm text-gray-400">/mo</span></p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="font-mono text-xs text-gray-500">Next billing date</p>
                                <p className="font-mono text-sm text-white">Apr 1, 2026</p>
                                <p className="font-mono text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded inline-block border border-green-400/20">Active</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="USAGE THIS PERIOD">
                        {[
                            { label: 'API Calls', used: 847, total: 1000, color: '#D4AF37' },
                            { label: 'Reports Generated', used: 12, total: 25, color: '#1e3a8a' },
                            { label: 'Flight Searches', used: 34, total: 100, color: '#0f3460' },
                        ].map((m, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-mono text-xs text-gray-400">{m.label}</p>
                                    <p className="font-mono text-xs text-gray-500">{m.used} / {m.total}</p>
                                </div>
                                <div className="h-2 bg-[#1c1c1c] rounded-full">
                                    <div className="h-2 rounded-full transition-all" style={{ width: `${(m.used / m.total) * 100}%`, background: m.color }} />
                                </div>
                            </div>
                        ))}
                    </Section>

                    <Section title="MANAGE">
                        <Field label="Upgrade Plan" hint="Get more API calls, reports, and premium data.">
                            <button
                                onClick={() => navigate('/app/billing')}
                                className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
                            >
                                VIEW ALL PLANS
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
                </div>
            )}
        </div>
    )
}