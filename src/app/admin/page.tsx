'use client'

import { useEffect, useState } from 'react'
import { Users, FileText, Crown, Activity } from 'lucide-react'
import ModernLoader from '@/components/ui/ModernLoader'
import PerformanceChart from '@/components/PerformanceChart'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, newsletters: 0, subscriptions: 0 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ModernLoader size="md" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-white">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Total Users</p>
                    <p className="text-4xl font-black text-white">{stats.users}</p>
                    <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Active Database Records
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText className="w-24 h-24 text-purple-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Newsletters Generated</p>
                    <p className="text-4xl font-black text-white">{stats.newsletters}</p>
                    <p className="text-purple-400 text-xs font-bold mt-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Content Creation
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown className="w-24 h-24 text-amber-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Pro Subscriptions</p>
                    <p className="text-4xl font-black text-white">{stats.subscriptions}</p>
                    <p className="text-amber-400 text-xs font-bold mt-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Revenue Stream
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Growth Analytics</h3>
                    <div className="h-64 w-full">
                        <PerformanceChart />
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">System Health</h3>
                    <p className="text-slate-400 max-w-sm">
                        All systems operational. Database latency is normal. API response times are optimal.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            Database: Healthy
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            API: Online
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
