'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User as UserIcon, Shield, CreditCard, Bell, Key, AlertCircle, Loader2, Save, Camera, Crown, ExternalLink, Rocket } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useSession, signOut } from 'next-auth/react'

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('Profile')
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: '',
        newsletterName: '',
        newsletterDescription: '',
        targetAudience: '',
        defaultTone: '',
        companyName: '',
        industry: '',
        legalDisclaimer: '',
        plan: 'FREE',
        stripeCurrentPeriodEnd: null,
        emailNotifications: true,
        activityNotifications: true
    })

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/user/me')
                if (res.ok) {
                    const data = await res.json()
                    setFormData((prev) => ({
                        ...prev,
                        name: data.name || '',
                        email: data.email || '',
                        image: data.image || '',
                        newsletterName: data.newsletterName || '',
                        newsletterDescription: data.newsletterDescription || '',
                        targetAudience: data.targetAudience || '',
                        defaultTone: data.defaultTone || '',
                        companyName: data.companyName || '',
                        industry: data.industry || '',
                        legalDisclaimer: data.legalDisclaimer || '',
                        plan: data.plan || 'FREE',
                        stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd
                    }))
                }
            } catch (err) {
                console.error("Failed to fetch user data")
            }
        }
        fetchUserData()
    }, [session])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setStatus(null)

        try {
            const res = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to update profile')

            // Update session locally
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                    image: formData.image
                }
            })

            setStatus({ type: 'success', msg: 'Profile updated successfully!' })
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message })
        } finally {
            setIsSaving(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match' })
            return
        }

        setIsSaving(true)
        setStatus(null)

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to update password')

            setStatus({ type: 'success', msg: 'Password updated successfully!' })
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message })
        } finally {
            setIsSaving(false)
        }
    }

    const sections = [
        { title: 'Profile', desc: 'Manage your public information', icon: <UserIcon className="w-5 h-5" /> },
        { title: 'Newsletter', desc: 'Configure your newsletter identity', icon: <Save className="w-5 h-5" /> },
        { title: 'Subscription', desc: 'Manage your plan and billing', icon: <Crown className="w-5 h-5 font-bold text-amber-500" /> },
        { title: 'Security', desc: 'Password and authentication', icon: <Shield className="w-5 h-5" /> },
        { title: 'Notifications', desc: 'Manage your alerts', icon: <Bell className="w-5 h-5" /> },
    ]


    const handleDeleteAccount = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' })
            if (res.ok) {
                await signOut({ callbackUrl: '/' })
            } else {
                const data = await res.json()
                throw new Error(data.error || 'Failed to delete account')
            }
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message })
            setIsDeleteModalOpen(false)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto text-white">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">Account Settings</h1>
                    <p className="text-slate-400">Manage your account preferences and subscription.</p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.title}
                                onClick={() => {
                                    setActiveSection(section.title)
                                    setStatus(null)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === section.title
                                    ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {section.icon}
                                {section.title}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {status && (
                            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${status.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <AlertCircle className="w-4 h-4" />
                                {status.msg}
                            </div>
                        )}

                        {activeSection === 'Profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40"
                            >
                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 overflow-hidden">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-10 h-10" />
                                                )}
                                            </div>
                                            <button type="button" className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                                <Camera className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Profile Picture</h3>
                                            <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 2MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-600"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Email Address</label>
                                            <input
                                                type="email"
                                                disabled
                                                value={formData.email}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeSection === 'Newsletter' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40"
                            >
                                <form onSubmit={handleSaveProfile} className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <Save className="w-5 h-5 text-cyan-400" /> Basic Settings
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Newsletter Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.newsletterName}
                                                    onChange={(e) => setFormData({ ...formData, newsletterName: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                    placeholder="e.g. Tech Weekly"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Description</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.newsletterDescription}
                                                    onChange={(e) => setFormData({ ...formData, newsletterDescription: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                    placeholder="What is your newsletter about?"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Target Audience</label>
                                                    <input
                                                        type="text"
                                                        value={formData.targetAudience}
                                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                        placeholder="e.g. Developers, Marketers"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Default Tone</label>
                                                    <input
                                                        type="text"
                                                        value={formData.defaultTone}
                                                        onChange={(e) => setFormData({ ...formData, defaultTone: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                        placeholder="e.g. Professional, Friendly"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <Camera className="w-5 h-5 text-cyan-400" /> Branding
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Company Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                    placeholder="Your brand name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Industry</label>
                                                <input
                                                    type="text"
                                                    value={formData.industry}
                                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                    placeholder="e.g. AI, Education"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-cyan-400" /> Additional Information
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Legal Disclaimer Text</label>
                                            <textarea
                                                rows={2}
                                                value={formData.legalDisclaimer}
                                                onChange={(e) => setFormData({ ...formData, legalDisclaimer: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-700"
                                                placeholder="Copyright © 2026..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Settings
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                        {activeSection === 'Security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40"
                            >
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeSection === 'Subscription' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                <Crown className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Current Plan: {formData.plan}</h3>
                                                <p className="text-sm text-slate-500">
                                                    {formData.plan === 'FREE'
                                                        ? 'Enjoying the basic features'
                                                        : `Renews on ${new Date(formData.stripeCurrentPeriodEnd!).toLocaleDateString()}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                                            Active
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/40">
                                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Method
                                            </h4>
                                            <p className="text-sm text-slate-400 mb-6">Manage your saved cards and payment methods in our secure billing portal.</p>
                                            <button
                                                onClick={() => window.open('/pricing', '_blank')}
                                                className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:underline"
                                            >
                                                Manage Billing <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/40">
                                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                                <Save className="w-4 h-4 text-cyan-400" /> Usage History
                                            </h4>
                                            <p className="text-sm text-slate-400 mb-6">View your previous invoices and usage statistics.</p>
                                            <button
                                                className="text-slate-500 text-sm font-bold flex items-center gap-1 cursor-not-allowed"
                                            >
                                                Coming Soon
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="bg-linear-to-br from-cyan-600/20 to-purple-600/20 p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                <Rocket className="w-32 h-32 -rotate-12" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">Want more power?</h3>
                                            <p className="text-slate-300 text-sm max-w-md mb-6">
                                                Upgrade to Pro for unlimited newsletters, advanced AI models, and priority support.
                                            </p>
                                            <button
                                                onClick={() => window.open('/pricing', '_blank')}
                                                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                            >
                                                View All Plans
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeSection === 'Notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">Email Notifications</h3>
                                            <p className="text-sm text-slate-500">Receive weekly digests and updates</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFormData({ ...formData, emailNotifications: !formData.emailNotifications })
                                                setStatus({ type: 'success', msg: !formData.emailNotifications ? 'Email notifications enabled' : 'Email notifications disabled' })
                                            }}
                                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.emailNotifications ? 'bg-cyan-600 ring-4 ring-cyan-600/10' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.emailNotifications ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                        <div>
                                            <h3 className="font-bold text-lg">Push Notifications</h3>
                                            <p className="text-sm text-slate-500">Get instant alerts on your mobile device</p>
                                        </div>
                                        <div className="w-12 h-6 bg-slate-800 rounded-full relative">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">Newsletter Activity</h3>
                                            <p className="text-sm text-slate-500">Notify when newsletter generation is complete</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFormData({ ...formData, activityNotifications: !formData.activityNotifications })
                                                setStatus({ type: 'success', msg: !formData.activityNotifications ? 'Activity notifications enabled' : 'Activity notifications disabled' })
                                            }}
                                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.activityNotifications ? 'bg-cyan-600 ring-4 ring-cyan-600/10' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.activityNotifications ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        <div className="mt-8 p-6 md:p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                            <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
                            <p className="text-slate-500 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold border border-red-500/20 transition-all"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
            >
                <div className="text-center space-y-6 text-white">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div>
                        <p className="text-slate-300 text-lg">Are you sure you want to delete your account?</p>
                        <p className="text-slate-500 text-sm mt-2">All your newsletters, settings, and billing data will be permanently removed.</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isSaving}
                            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                        >
                            {isSaving ? 'Deleting...' : 'Yes, Delete Forever'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
