'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Menu, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
    const { status } = useSession()
    const isLoggedIn = status === 'authenticated'
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/pricing', hot: true },
        { name: 'About', href: '/#about' },
    ]

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 mb-8 bg-slate-950/50 backdrop-blur-lg"
        >
            <div className="max-w-7xl mx-auto glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 relative z-50">
                    <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center glow">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">AI Newsletters</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors relative group"
                        >
                            {link.name}
                            {link.hot && (
                                <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-cyan-500 text-[10px] font-black text-slate-950 rounded-md scale-0 group-hover:scale-100 transition-transform origin-bottom-left">HOT</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                        <button className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/5 text-white">
                            {isLoggedIn ? 'Dashboard' : 'Log In'}
                        </button>
                    </Link>
                    <Link href={isLoggedIn ? "/dashboard/new" : "/register"}>
                        <button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold transition-all glow text-white">
                            {isLoggedIn ? 'Create New' : 'Get Started'}
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors relative z-50"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-medium text-slate-300 hover:text-cyan-400 flex items-center justify-between"
                                    >
                                        {link.name}
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </Link>
                                ))}
                            </nav>
                            <div className="h-px bg-white/5" />
                            <div className="flex flex-col gap-3">
                                <Link href={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full py-4 bg-white/5 rounded-2xl font-bold text-white border border-white/5">
                                        {isLoggedIn ? 'Dashboard' : 'Log In'}
                                    </button>
                                </Link>
                                <Link href={isLoggedIn ? "/dashboard/new" : "/register"} onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full py-4 bg-cyan-600 rounded-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
                                        {isLoggedIn ? 'Create New' : 'Get Started'}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
