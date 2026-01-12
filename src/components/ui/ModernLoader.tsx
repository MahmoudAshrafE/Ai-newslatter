'use client'

import { motion } from 'framer-motion'

interface ModernLoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function ModernLoader({ className = "", size = 'md' }: ModernLoaderProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    }

    const borderClasses = {
        sm: 'border-2',
        md: 'border-4',
        lg: 'border-[5px]'
    }

    return (
        <div className={`relative flex flex-col items-center gap-4 ${className}`}>
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className={`absolute inset-0 rounded-full ${borderClasses[size]} border-slate-800 border-t-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]`}
                />

                {/* Inner Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className={`absolute inset-2 md:inset-3 rounded-full ${borderClasses[size]} border-slate-800 border-b-purple-500 opacity-70`}
                />

                {/* Center Pulse */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className={`${size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]`} />
                </motion.div>
            </div>

            {size !== 'sm' && (
                <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-medium tracking-[0.2em] text-sm uppercase">Loading</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                        className="text-cyan-500"
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, times: [0, 0.5, 1] }}
                        className="text-cyan-500"
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, times: [0, 0.5, 1] }}
                        className="text-cyan-500"
                    >.</motion.span>
                </div>
            )}
        </div>
    )
}
