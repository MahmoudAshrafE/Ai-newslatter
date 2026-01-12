'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Crown, Rocket, Star, ShieldCheck, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'

const plans = [
    {
        name: 'Starter',
        price: '0',
        priceId: '',
        description: 'Perfect for exploring the power of AI.',
        features: [
            '5 Newsletters per month',
            'Standard AI generation',
            'Standard RSS integration (1 feed)',
            'Standard Layouts',
            'Community Support'
        ],
        icon: <Star className="w-6 h-6 text-slate-400" />,
        buttonText: 'Get Started',
        popular: false,
        color: 'slate'
    },
    {
        name: 'Pro',
        price: '29',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1SnNetAGs1n7U31DBrM2VI48',
        description: 'For creators who want full control and speed.',
        features: [
            'Unlimited Newsletters',
            'Gemini 1.5 Pro Engine',
            'Custom Branding',
            'Priority Support',
            'Analytics Dashboard',
            'Unlimited RSS Feeds'
        ],
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        buttonText: 'Upgrade to Pro',
        popular: true,
        color: 'cyan'
    },
    {
        name: 'Enterprise',
        price: '99',
        priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_ent_default',
        description: 'Scalable solutions for large teams.',
        features: [
            'Team Cooperation',
            'API Access',
            'Custom AI Training',
            'Dedicated Account Manager',
            'White-label Solution',
            'Custom Layouts'
        ],
        icon: <Crown className="w-6 h-6 text-amber-400" />,
        buttonText: 'Contact Sales',
        popular: false,
        color: 'amber'
    }
]

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleCheckout = async (priceId: string) => {
        if (!priceId) {
            window.location.href = '/dashboard/new'
            return
        }


        setIsLoading(priceId)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                console.error("Checkout error data:", data);
                alert(`Checkout failed: ${data.details || data.error || 'Unknown error'}`)
            }
        } catch (err) {
            console.error("Checkout fetch error:", err);
            alert('Something went wrong during checkout connection')
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            <Header />
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 md:pb-32">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium mb-6"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Checkout with Stripe</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-slate-500"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        Choose the plan that fits your growth. No hidden fees, no long-term contracts.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-slate-800 rounded-full p-1 relative transition-colors hover:bg-slate-700"
                        >
                            <motion.div
                                animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                                className="w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            />
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                            Yearly <span className="text-emerald-400 text-xs ml-1 font-bold">Save 20%</span>
                        </span>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className={`relative group p-6 md:p-8 rounded-4xl border transition-all duration-500 flex flex-col ${plan.popular
                                ? 'bg-slate-900/60 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
                                : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${plan.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20' :
                                    plan.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20' :
                                        'bg-slate-500/10 border-slate-500/20'
                                    }`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black italic opacity-50">$</span>
                                    <span className="text-6xl font-black tracking-tight">
                                        {billingCycle === 'yearly'
                                            ? Math.floor(parseInt(plan.price) * 0.8)
                                            : plan.price
                                        }
                                    </span>
                                    <span className="text-slate-500 font-medium">/mo</span>
                                </div>
                                {billingCycle === 'yearly' && plan.price !== '0' && (
                                    <p className="text-emerald-400/80 text-xs mt-2 font-medium">Billed annually (${Math.floor(parseInt(plan.price) * 0.8 * 12)}/year)</p>
                                )}
                            </div>

                            <button
                                onClick={() => handleCheckout(plan.priceId)}
                                disabled={!!isLoading}
                                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 mb-8 flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {isLoading === plan.priceId ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    >
                                        <Zap className="w-5 h-5 text-current" />
                                    </motion.div>
                                ) : (
                                    <>
                                        {plan.buttonText}
                                        <Rocket className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="space-y-4 font-medium flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">What's included</p>
                                {plan.features.map((feature, fIndex) => (
                                    <div key={fIndex} className="flex items-start gap-3">
                                        <div className={`mt-1 p-0.5 rounded-full ${plan.popular ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ or Enterprise Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass p-6 md:p-12 rounded-[40px] border border-white/5 text-center bg-slate-900/20"
                >
                    <h2 className="text-3xl font-bold mb-4">Need a custom solution for your agency?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Get white-label options, multi-user accounts, and custom AI templates tailored to your specific industry Needs.
                    </p>
                    <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2 mx-auto">
                        Talk to our Strategy Team
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
