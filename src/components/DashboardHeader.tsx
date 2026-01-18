'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Bell, User, Settings, LogOut, Home, FileText, Plus, Check, Trash2, Crown, Menu, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Modal from '@/components/ui/Modal'

interface Notification {
    id: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
    type: string
}

export default function DashboardHeader() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const notificationRef = useRef<HTMLDivElement>(null)
    const notificationBtnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isNotifOpen &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node) &&
                notificationBtnRef.current &&
                !notificationBtnRef.current.contains(event.target as Node)
            ) {
                setIsNotifOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isNotifOpen])

    const [viewMode, setViewMode] = useState<'all' | 'unread'>('unread')

    useEffect(() => {
        if (session?.user) {
            fetchNotifications()
        }
    }, [session])

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications')
            const data = await res.json()
            if (Array.isArray(data)) {
                setNotifications(data)
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const markAsRead = async (id?: string) => {
        try {
            // Optimistic update
            if (id) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            }

            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length
    const displayedNotifications = viewMode === 'all'
        ? notifications
        : notifications.filter(n => !n.isRead)

    const navLinks = [
        { name: 'Overview', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Create', href: '/dashboard/new', icon: <Plus className="w-5 h-5" /> },
        { name: 'RSS Feeds', href: '/dashboard/rss', icon: <Mail className="w-5 h-5" /> },
        { name: 'Plans', href: '/pricing', icon: <Crown className="w-5 h-5 text-amber-500" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
    ]

    if (session?.user?.role?.toUpperCase() === 'ADMIN') {
        navLinks.push({ name: 'Admin Panel', href: '/admin', icon: <Shield className="w-5 h-5 text-red-500" /> })
    }

    return (
        <nav className="sticky top-0 z-40">
            {/* Background Layer to prevent stacking context issues for fixed children */}
            <div className="absolute inset-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6 lg:gap-12">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center glow">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden xl:block">AI Newsletters</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2 lg:gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${pathname === link.href
                                    ? 'text-cyan-400 bg-cyan-500/5'
                                    : link.name === 'Plans'
                                        ? 'text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/5'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="relative">
                        <button
                            ref={notificationBtnRef}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`p-2 hover:bg-white/5 rounded-lg transition-all relative ${isNotifOpen ? 'text-cyan-400 bg-white/5' : 'text-slate-400'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-slate-950 animate-pulse" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    ref={notificationRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed left-4 right-4 top-20 md:absolute md:top-full md:right-0 md:left-auto md:w-[380px] md:mt-2 max-h-[75vh] flex flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-xl shadow-black/50 z-50 overflow-hidden"
                                >

                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-xl md:text-lg text-white">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="px-2.5 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-bold shadow-lg shadow-cyan-500/20">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={() => markAsRead()}
                                                    title="Mark all as read"
                                                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all"
                                                >
                                                    <Check className="w-5 h-5 md:w-4 md:h-4" />
                                                </button>
                                            )}
                                            {/* Desktop Close Button (can be kept for visual consistency or removed) */}
                                            <button
                                                onClick={() => setIsNotifOpen(false)}
                                                className="hidden md:flex p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {/* Mobile Close Button */}
                                            <button
                                                onClick={() => setIsNotifOpen(false)}
                                                className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="overflow-y-auto flex-1 p-2 space-y-2 md:p-3">
                                        {displayedNotifications.length > 0 ? (
                                            displayedNotifications.map((notif) => (
                                                <motion.div
                                                    layout
                                                    key={notif.id}
                                                    className={`p-4 rounded-2xl border transition-all group relative ${!notif.isRead
                                                        ? 'bg-linear-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20 shadow-lg shadow-cyan-900/20'
                                                        : 'bg-white/5 border-transparent hover:border-white/10'
                                                        }`}
                                                >
                                                    <div className="flex gap-4">
                                                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${!notif.isRead
                                                            ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                                            : 'bg-slate-800 border-white/5 text-slate-500'
                                                            }`}>
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <p className={`font-bold text-sm leading-snug ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.isRead && (
                                                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] shrink-0 mt-1.5" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 mt-3 font-medium flex items-center gap-1.5">
                                                                {new Date(notif.createdAt).toLocaleDateString()}
                                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {!notif.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notif.id)}
                                                            className="absolute right-3 top-3 p-2 rounded-full bg-slate-900 shadow-xl border border-white/10 text-slate-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-cyan-500 hover:text-white transition-all md:scale-75 md:group-hover:scale-100"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4 md:w-3 md:h-3" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5 relative">
                                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-50" />
                                                    <Bell className="w-10 h-10 text-slate-500 relative z-10" />
                                                </div>
                                                <h3 className="text-white text-lg font-bold mb-2">No {viewMode === 'unread' ? 'new' : ''} notifications</h3>
                                                <p className="text-sm text-slate-400 max-w-[250px] leading-relaxed">
                                                    {viewMode === 'unread'
                                                        ? "You're all caught up! check back later for updates."
                                                        : "Your notification history is empty."}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="p-4 md:p-3 border-t border-white/5 bg-slate-900/50 backdrop-blur-md pb-3">
                                        <button
                                            onClick={() => setViewMode(viewMode === 'all' ? 'unread' : 'all')}
                                            className="w-full py-3.5 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-wider border border-white/5 flex items-center justify-center gap-2"
                                        >
                                            {viewMode === 'all' ? (
                                                <><Check className="w-3 h-3" /> Hide Read Items</>
                                            ) : (
                                                <><FileText className="w-3 h-3" /> View History</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">{session?.user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500">
                                {session?.user?.role?.toUpperCase() === 'ADMIN' ? 'Admin Access' : (session?.user?.email || 'Free Plan')}
                            </p>
                        </div>
                        <div className="relative group">
                            <button
                                onClick={() => setIsUserModalOpen(true)}
                                className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 overflow-hidden cursor-pointer shadow-lg group-hover:border-white/20 transition-all focus:outline-none"
                            >
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                            </button>

                            {/* Desktop Dropdown on hover */}
                            <div className="hidden md:block absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2">
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </Link>
                                    <div className="h-px bg-white/5 my-1 mx-2" />
                                    <button
                                        onClick={() => signOut({ callbackUrl: window.location.origin })}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-4 animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* User Modal for Mobile */}
            <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="">
                <div className="relative">
                    {/* Decorative Header Background */}
                    <div className="absolute -top-16 -left-8 -right-8 h-32 bg-linear-to-r from-cyan-600 to-blue-600 opacity-20 blur-3xl pointer-events-none" />

                    <div className="relative pt-4 text-center space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full p-1 bg-linear-to-tr from-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/20">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-cyan-400" />
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-white">{session?.user?.name || 'Welcome!'}</h3>
                            <p className="text-slate-400 font-medium">{session?.user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                                {session?.user?.role || 'Free Plan'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsUserModalOpen(false)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Settings</p>
                                    <p className="text-xs text-slate-400">Manage your profile & preferences</p>
                                </div>
                            </div>
                            <User className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>

                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-red-200 group-hover:text-white">Sign Out</p>
                                    <p className="text-xs text-red-500/50 group-hover:text-red-300">End your session securely</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </Modal>
        </nav>
    )
}
