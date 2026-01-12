'use client'

import { motion } from 'framer-motion'
import { Brain, Cpu, Globe, Layers, MousePointer2, Share2 } from 'lucide-react'

const features = [
    {
        icon: <Brain className="w-8 h-8 text-cyan-400" />,
        title: "AI Analysis",
        description: "Our advanced models analyze current trends to suggest high-impact topics for your audience."
    },
    {
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        title: "Instant Drafts",
        description: "Generate a complete, formatted newsletter draft in less than 30 seconds from just a keyword."
    },
    {
        icon: <Globe className="w-8 h-8 text-emerald-400" />,
        title: "Multi-Language",
        description: "Reach a global audience with AI-powered translation and localized content generation."
    },
    {
        icon: <Layers className="w-8 h-8 text-orange-400" />,
        title: "Custom Templates",
        description: "Choose from a variety of layout styles that adapt to your brand's unique visual identity."
    },
    {
        icon: <Share2 className="w-8 h-8 text-pink-400" />,
        title: "Direct Export",
        description: "Export directly to HTML or sync with services like Mailchimp, Substack, and Beehiiv."
    },
    {
        icon: <MousePointer2 className="w-8 h-8 text-blue-400" />,
        title: "One-Click Edit",
        description: "Refine AI outputs with our intuitive editor that lets you tweak tone and style instantly."
    }
]

export default function Features() {
    return (
        <section id="features" className="py-12 px-4 md:py-24 md:px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Powerful Features for <br />
                            <span className="text-cyan-400">Modern Creators</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Everything you need to automate your newsletter workflow and keep your audience engaged.
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all border border-white/10 glass w-full md:w-auto mt-4 md:mt-0">
                        View All Features
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all group"
                        >
                            <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
