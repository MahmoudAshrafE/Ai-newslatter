'use client'

import { motion } from 'framer-motion'
import { FileText, Send, Edit2 } from 'lucide-react'

interface StatsOverviewProps {
    total: number
    sent: number
    drafts: number
}

export default function StatsOverview({ total, sent, drafts }: StatsOverviewProps) {
    const statsData = [
        { label: 'Total Created', value: total, icon: <FileText className="w-6 h-6" />, color: 'blue' },
        { label: 'Sent to Users', value: sent, icon: <Send className="w-6 h-6" />, color: 'emerald' },
        { label: 'Drafts Ready', value: drafts, icon: <Edit2 className="w-6 h-6" />, color: 'amber' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {statsData.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/40 relative overflow-hidden group"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20`}>
                            {stat.icon}
                        </div>
                        <div className="text-white">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
