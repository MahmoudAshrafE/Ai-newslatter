'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Mail, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
            {/* Background Gradients */}
            <div className="absolute top-0 -z-10 h-full w-full bg-slate-950">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]" />
                <div className="absolute top-0 z-[-10] h-full w-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6 glass">
                    <Sparkles className="w-4 h-4" />
                    <span>Next-Gen AI Newsletter Generator</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                    Create Newsletters that <br />
                    <span className="text-cyan-400">Actually Get Read.</span>
                </h1>

                <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    Leverage AI to craft high-converting newsletters in seconds. Personalized, data-driven, and designed for maximum engagement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/dashboard">
                        <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 glow inline-flex items-center gap-2">
                            Start Generating Free <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all glass border border-white/10">
                        View Live Demo
                    </button>
                </div>
            </motion.div>

            {/* Floating Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-20 w-full max-w-5xl">
                {[
                    { icon: <Zap className="w-10 h-10 text-cyan-400" />, title: "Instant Generation", desc: "Craft complete issues from just a topic." },
                    { icon: <Mail className="w-10 h-10 text-purple-400" />, title: "Ready-to-Send", desc: "Export to HTML or send via your favorite ESP." },
                    { icon: <Shield className="w-10 h-10 text-emerald-400" />, title: "Brand Voice", desc: "AI learns your unique style and tone." },
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="glass p-8 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all hover:translate-y-[-5px]"
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-slate-400">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
