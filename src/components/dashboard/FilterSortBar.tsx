'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown, ChevronDown, Eye, Plus } from 'lucide-react'

type SortOrder = 'newest' | 'oldest' | 'alpha'

interface FilterSortBarProps {
    statusFilter: string
    setStatusFilter: (filter: string) => void
    sortOrder: SortOrder
    setSortOrder: (order: SortOrder) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function FilterSortBar({
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery
}: FilterSortBarProps) {
    const [isSortOpen, setIsSortOpen] = useState(false)

    return (
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
                {['ALL', 'DRAFT', 'COMPLETED', 'SENT'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${statusFilter === filter
                            ? 'bg-white text-slate-950 border-white'
                            : 'bg-slate-900 text-slate-500 border-white/5 hover:border-white/20'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="h-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-400 font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all min-w-[140px] justify-between"
                    >
                        <span className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4" />
                            {sortOrder === 'newest' ? 'Newest' : sortOrder === 'oldest' ? 'Oldest' : 'A-Z'}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {isSortOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                            {[
                                { label: 'Newest First', value: 'newest' },
                                { label: 'Oldest First', value: 'oldest' },
                                { label: 'Alphabetical', value: 'alpha' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSortOrder(opt.value as SortOrder); setIsSortOpen(false) }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 lg:w-64">
                    <input
                        type="text"
                        placeholder="Search by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-sans text-sm"
                    />
                    <Eye className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
                <Link href="/dashboard/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all glow text-white whitespace-nowrap">
                        <Plus className="w-5 h-5" /> Quick Create
                    </button>
                </Link>
            </div>
        </div>
    )
}
