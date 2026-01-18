'use client'

import { useState } from 'react'
import { Home, Users, Settings, LogOut, Menu, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

export default function AdminHeader() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navLinks = [
        { name: 'Dashboard', href: '/admin', icon: <Home className="w-5 h-5" /> },
        { name: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    ]

    return (
        <nav className="sticky top-0 z-40">
            <div className="absolute inset-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6 lg:gap-12">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center glow">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden xl:block text-white">Admin Panel</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2 lg:gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${pathname === link.href
                                    ? 'text-red-400 bg-red-500/10'
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
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">{session?.user?.name || 'Admin'}</p>
                            <p className="text-xs text-red-500 font-mono">SUPER ADMIN</p>
                        </div>
                        <div className="relative group">
                            <button
                                className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-red-400 overflow-hidden cursor-pointer shadow-lg group-hover:border-white/20 transition-all focus:outline-none"
                            >
                                <Shield className="w-5 h-5" />
                            </button>

                            <div className="hidden md:block absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2">
                                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <Home className="w-4 h-4" /> User Dashboard
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

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-4 animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
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
        </nav>
    )
}
