'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
    return (
        <section className="py-12 px-4 md:py-24 md:px-6 relative">
            <div className="max-w-5xl mx-auto rounded-3xl md:rounded-[3rem] bg-linear-to-r from-cyan-600 to-purple-600 p-px overflow-hidden group">
                <div className="bg-slate-950 rounded-3xl md:rounded-[3rem] px-6 py-12 md:p-20 text-center relative overflow-hidden">
                    {/* Animated background blobs */}
                    <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[100px] animate-pulse" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>Ready to scale your content?</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            Start Generating <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">Smater Newsletters</span> Today.
                        </h2>

                        <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
                            Join 1,000+ creators who use our AI to save 20+ hours every month on content creation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/dashboard/new">
                                <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group/btn">
                                    Create First Newsletter <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl font-bold hover:bg-white/5 transition-all">
                                Talk to an Expert
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
