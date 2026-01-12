'use client'

import { motion } from 'framer-motion'

export default function PerformanceChart() {
    // Simulated data points
    const points = [12, 18, 15, 25, 22, 35, 30, 45, 42, 55, 52, 60]
    const max = 70
    const width = 100
    const height = 40

    const pathData = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width
        const y = height - (p / max) * height
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    const areaData = `${pathData} L ${width} ${height} L 0 ${height} Z`

    return (
        <div className="w-full h-full relative group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d={pathData}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    d={areaData}
                    fill="url(#gradient)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-[2px] rounded-2xl">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Growth +24%</span>
            </div>
        </div>
    )
}
