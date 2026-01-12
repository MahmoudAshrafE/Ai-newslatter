'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader2, X, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import PerformanceChart from '@/components/PerformanceChart'
import StatsOverview from '@/components/dashboard/StatsOverview'
import FilterSortBar from '@/components/dashboard/FilterSortBar'
import ModernLoader from '@/components/ui/ModernLoader'
import NewsletterCard from '@/components/dashboard/NewsletterCard'
import ViewNewsletterModal from '@/components/dashboard/ViewNewsletterModal'
import EditNewsletterModal from '@/components/dashboard/EditNewsletterModal'
import DeleteNewsletterModal from '@/components/dashboard/DeleteNewsletterModal'
import SendNewsletterModal from '@/components/dashboard/SendNewsletterModal'
import { Newsletter } from '@/types/newsletter'

export default function DashboardPage() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alpha'>('newest')

    // Modal & Selection States
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    // Processing States
    const [isProcessing, setIsProcessing] = useState(false)
    const [showToast, setShowToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [showToast])

    useEffect(() => {
        fetchNewsletters()
    }, [])

    const fetchNewsletters = async () => {
        try {
            const res = await fetch('/api/newsletters')
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setNewsletters(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleToast = (msg: string, type: 'success' | 'error') => {
        setShowToast({ msg, type })
    }

    // Stats calculations
    const stats = {
        total: newsletters.length,
        sent: newsletters.filter(n => n.status === 'SENT').length,
        drafts: newsletters.filter(n => n.status === 'DRAFT' || n.status === 'COMPLETED').length,
    }

    const filteredNewsletters = newsletters.filter(nl => {
        const matchesSearch = nl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nl.topic.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || nl.status === statusFilter
        return matchesSearch && matchesStatus
    }).sort((a, b) => {
        if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        if (sortOrder === 'alpha') return a.title.localeCompare(b.title)
        return 0
    })

    const handleDuplicate = async (nl: Newsletter) => {
        try {
            const res = await fetch('/api/newsletters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Copy of ${nl.title}`,
                    topic: nl.topic,
                    content: nl.content,
                    status: 'DRAFT'
                })
            })

            if (res.ok) {
                const newNl = await res.json()
                setNewsletters([newNl, ...newsletters])
                handleToast('Newsletter duplicated!', 'success')
            } else {
                throw new Error('Failed to duplicate')
            }
        } catch (err) {
            handleToast('Failed to duplicate newsletter', 'error')
        }
    }

    const handleEditSave = async (title: string, topic: string) => {
        if (!selectedNewsletter) return
        setIsProcessing(true)
        try {
            const res = await fetch(`/api/newsletters/${selectedNewsletter.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, topic })
            })
            if (res.ok) {
                const updated = await res.json()
                setNewsletters(newsletters.map(n => n.id === updated.id ? updated : n))
                setIsEditModalOpen(false)
                handleToast('Newsletter updated!', 'success')
            }
        } catch (err) {
            handleToast('Failed to update newsletter', 'error')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedNewsletter) return
        setIsProcessing(true)
        try {
            const res = await fetch(`/api/newsletters/${selectedNewsletter.id}`, { method: 'DELETE' })
            if (res.ok) {
                setNewsletters(newsletters.filter(n => n.id !== selectedNewsletter.id))
                setIsDeleteModalOpen(false)
                setSelectedNewsletter(null)
                handleToast('Newsletter deleted', 'success')
            }
        } catch (err) {
            handleToast('Failed to delete newsletter', 'error')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSendSuccess = (updated: Newsletter) => {
        setNewsletters(newsletters.map(n => n.id === updated.id ? updated : n))
        setSelectedNewsletter(updated)
        setIsSendConfirmOpen(false)
        // If view modal is open, it will update automatically via key/render, or we might need to close it
        if (isViewModalOpen) setIsViewModalOpen(false)
    }

    // Modal Triggers
    const openEdit = (nl: Newsletter) => { setSelectedNewsletter(nl); setIsEditModalOpen(true) }
    const openDelete = (nl: Newsletter) => { setSelectedNewsletter(nl); setIsDeleteModalOpen(true) }
    const openView = (nl: Newsletter) => { setSelectedNewsletter(nl); setIsViewModalOpen(true) }
    const openSend = (nl: Newsletter) => { setSelectedNewsletter(nl); setIsSendConfirmOpen(true) }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ModernLoader size="md" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <StatsOverview total={stats.total} sent={stats.sent} drafts={stats.drafts} />

                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2 text-white">Dashboard <span className="text-cyan-500 font-light font-mono text-xl ml-2">/ Newsletters</span></h1>
                        <p className="text-slate-400 text-lg">Manage your AI-generated content and distribution.</p>
                    </div>

                    <div className="w-full xl:w-80 glass p-5 rounded-3xl border border-cyan-500/10 bg-cyan-500/2 flex items-center justify-between gap-4 mt-6 xl:mt-0">
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Audience Growth</p>
                            <p className="text-2xl font-black text-white">2.4k</p>
                            <p className="text-[10px] text-emerald-400 font-bold">+12% this month</p>
                        </div>
                        <div className="w-32 h-12">
                            <PerformanceChart />
                        </div>
                    </div>
                </header>

                <FilterSortBar
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {filteredNewsletters.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-white/5 bg-slate-900/20">
                        <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                            {newsletters.length === 0 ? 'No newsletters yet' : 'No matches found'}
                        </h3>
                        <p className="text-slate-500 mb-8">
                            {newsletters.length === 0
                                ? 'Start by creating your first AI-generated newsletter.'
                                : `We couldn't find anything matching "${searchQuery}"`}
                        </p>
                        {newsletters.length === 0 ? (
                            <Link href="/dashboard/new">
                                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/5 transition-all">
                                    Create Draft
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('ALL') }}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/5 transition-all"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredNewsletters.map((nl, i) => (
                            <NewsletterCard
                                key={nl.id}
                                newsletter={nl}
                                index={i}
                                onDuplicate={handleDuplicate}
                                onEdit={openEdit}
                                onDelete={openDelete}
                                onView={openView}
                                onSend={openSend}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ViewNewsletterModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                newsletter={selectedNewsletter}
                onEdit={() => { setIsViewModalOpen(false); openEdit(selectedNewsletter!) }}
                onSend={() => { setIsViewModalOpen(false); openSend(selectedNewsletter!) }}
                onToast={handleToast}
            />

            <EditNewsletterModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                newsletter={selectedNewsletter}
                onSave={handleEditSave}
                isProcessing={isProcessing}
            />

            <DeleteNewsletterModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteConfirm}
                isProcessing={isProcessing}
                newsletter={selectedNewsletter}
            />

            <SendNewsletterModal
                isOpen={isSendConfirmOpen}
                onClose={() => setIsSendConfirmOpen(false)}
                newsletter={selectedNewsletter}
                onSendSuccess={handleSendSuccess}
                onToast={handleToast}
            />

            {/* Toast Notification */}
            <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2 pointer-events-none">
                {showToast && (
                    <div className={`pointer-events-auto p-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${showToast.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {showToast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-bold text-sm">{showToast.msg}</p>
                        <button onClick={() => setShowToast(null)} className="ml-4 hover:opacity-75"><X className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
        </div>
    )
}
