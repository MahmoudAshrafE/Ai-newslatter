'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Rocket, Star, Crown } from 'lucide-react'
import Link from 'next/link'

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for exploring the power of AI.",
        features: ["5 Newsletters / mo", "Standard AI Engine", "Email Support", "Public Share Links"],
        buttonText: "Get Started",
        popular: false,
        icon: <Star className="w-6 h-6 text-slate-400" />,
        color: 'slate'
    },
    {
        name: "Pro",
        price: "29",
        description: "For creators who want full control and speed.",
        features: ["Unlimited Newsletters", "Gemini 1.5 Pro Engine", "Custom Branding", "Priority Support", "Analytics Dashboard"],
        buttonText: "Go Pro",
        popular: true,
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        color: 'cyan'
    },
    {
        name: "Enterprise",
        price: "99",
        description: "Scalable solutions for large teams.",
        features: ["Team Cooperation", "API Access", "Custom AI Training", "Dedicated Account Manager"],
        buttonText: "Contact Sales",
        popular: false,
        icon: <Crown className="w-6 h-6 text-amber-400" />,
        color: 'amber'
    }
]

export default function Pricing() {
    return (
        <section id="pricing" className="py-12 px-4 md:py-24 md:px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent <span className="text-cyan-400">Pricing</span></h2>
                    <p className="text-slate-400 text-lg">Choose the plan that fits your growth.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass p-6 md:p-8 rounded-3xl border flex flex-col transition-all duration-300 ${plan.popular ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative' : 'border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/5`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">${plan.price}</span>
                                <span className="text-slate-400">/month</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/pricing" className="w-full">
                                <button className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                    }`}>
                                    {plan.buttonText}
                                    <Rocket className="w-4 h-4" />
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
