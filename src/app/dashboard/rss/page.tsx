'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Rss, Trash2, Loader2, Wand2, Check, ExternalLink, Layout, Type, Palette, Sparkles, FileText, Send } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RssFeed {
    id: string
    name: string
    url: string
    description: string
    createdAt: string
}

export default function RssDashboard() {
    const [feeds, setFeeds] = useState<RssFeed[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [newFeedUrl, setNewFeedUrl] = useState('')
    const [selectedFeeds, setSelectedFeeds] = useState<string[]>([])

    // Generation settings
    const [layout, setLayout] = useState('Standard')
    const [tone, setTone] = useState('Professional')
    const [theme, setTheme] = useState('Modern Dark')
    const [activeModal, setActiveModal] = useState<'layout' | 'tone' | 'theme' | 'add' | null>(null)
    const [generatedContent, setGeneratedContent] = useState('')
    const [title, setTitle] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [feedToDelete, setFeedToDelete] = useState<string | null>(null)
    const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const layouts = ['Standard', 'Minimalist', 'In-depth Research', 'Storytelling']
    const tones = ['Professional', 'Casual', 'Enthusiastic', 'Serious', 'Witty']
    const themes = ['Modern Dark', 'Futuristic', 'Eco-Nature', 'Corporate Blue', 'Sunset Vibes']

    useEffect(() => {
        fetchFeeds()
    }, [])

    const fetchFeeds = async () => {
        try {
            const res = await fetch('/api/rss')
            const data = await res.json()
            if (Array.isArray(data)) setFeeds(data)
        } catch (error) {
            console.error('Failed to fetch feeds:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddFeed = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newFeedUrl) return
        setIsAdding(true)
        try {
            const res = await fetch('/api/rss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: newFeedUrl })
            })
            const data = await res.json()
            if (data.id) {
                setFeeds([data, ...feeds])
                setNewFeedUrl('')
                setActiveModal(null)
            } else {
                if (data.error?.includes('limit') || data.details?.includes('limit')) {
                    setIsPlanLimitModalOpen(true)
                    setActiveModal(null)
                } else {
                    setErrorMessage(data.error || 'Failed to add feed')
                }
            }
        } catch (error) {
            setErrorMessage('Error adding feed')
        } finally {
            setIsAdding(false)
        }
    }

    const handleDeleteClick = (id: string) => {
        setFeedToDelete(id)
    }

    const confirmDelete = async () => {
        if (!feedToDelete) return
        try {
            await fetch(`/api/rss?id=${feedToDelete}`, { method: 'DELETE' })
            setFeeds(feeds.filter(f => f.id !== feedToDelete))
            setSelectedFeeds(selectedFeeds.filter(sid => sid !== feedToDelete))
            setFeedToDelete(null)
        } catch (error) {
            setErrorMessage('Failed to delete feed')
        }
    }

    const toggleFeedSelection = (id: string) => {
        if (selectedFeeds.includes(id)) {
            setSelectedFeeds(selectedFeeds.filter(sid => sid !== id))
        } else {
            setSelectedFeeds([...selectedFeeds, id])
        }
    }

    const handleGenerate = async () => {
        if (selectedFeeds.length === 0) return
        setIsGenerating(true)
        setGeneratedContent('')
        try {
            const res = await fetch('/api/generate/rss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedIds: selectedFeeds,
                    layout,
                    tone,
                    theme
                })
            })
            const data = await res.json()
            if (data.content) {
                setGeneratedContent(data.content)
                setTitle(`RSS Digest - ${new Date().toLocaleDateString()}`)
            } else {
                setErrorMessage(data.error || 'Generation failed')
            }
        } catch (error) {
            setErrorMessage('Generation error')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async (status: 'DRAFT' | 'COMPLETED') => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/newsletters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    topic: 'RSS Feed Digest',
                    content: generatedContent,
                    status
                })
            })
            if (res.ok) window.location.href = '/dashboard'
        } catch (error) {
            setErrorMessage('Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    const renderSelectionGrid = (options: string[], current: string, setter: (val: string) => void) => (
        <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => {
                        setter(option)
                        setActiveModal(null)
                    }}
                    className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${current === option
                        ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20 hover:bg-slate-900'
                        }`}
                >
                    <span className="font-medium text-sm">{option}</span>
                    {current === option && <Check className="w-5 h-5" />}
                </button>
            ))}
        </div>
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                            <Rss className="w-10 h-10 text-orange-500" /> RSS Feed Manager
                        </h1>
                        <p className="text-slate-400 text-lg">Curate newsletters automatically from your favorite sources.</p>
                    </div>
                    <button
                        onClick={() => setActiveModal('add')}
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold flex items-center gap-2 transition-all glow text-white"
                    >
                        <Plus className="w-5 h-5" /> Add New Feed
                    </button>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Feed List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/40 min-h-[400px]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Your Sources <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-cyan-400">{feeds.length}</span>
                                </h2>
                                {feeds.length > 0 && (
                                    <button
                                        onClick={() => setSelectedFeeds(selectedFeeds.length === feeds.length ? [] : feeds.map(f => f.id))}
                                        className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        {selectedFeeds.length === feeds.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                )}
                            </div>

                            {feeds.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                                    <Rss className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500">No feeds added yet. Start by adding an RSS URL.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {feeds.map((feed) => (
                                        <motion.div
                                            key={feed.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-5 rounded-2xl border transition-all flex items-center gap-4 group cursor-pointer ${selectedFeeds.includes(feed.id)
                                                ? 'bg-cyan-500/5 border-cyan-500/30'
                                                : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                                            onClick={() => toggleFeedSelection(feed.id)}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedFeeds.includes(feed.id) ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                                                {selectedFeeds.includes(feed.id) ? <Check className="w-6 h-6" /> : <Rss className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white truncate">{feed.name}</h3>
                                                <p className="text-xs text-slate-500 truncate mt-1 flex items-center gap-1">
                                                    {feed.url} <ExternalLink className="w-3 h-3" />
                                                </p>
                                                {feed.description && (
                                                    <p className="text-[10px] text-slate-600 truncate mt-1 italic">
                                                        {feed.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(feed.id); }}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Generation Controls */}
                    <div className="space-y-6">
                        <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/60 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-cyan-400" /> Generator settings
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Layout Style</label>
                                    <button
                                        onClick={() => setActiveModal('layout')}
                                        className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 text-left flex items-center justify-between hover:border-white/20 transition-all"
                                    >
                                        <span className="text-white font-medium">{layout}</span>
                                        <Layout className="w-4 h-4 text-cyan-500" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Writing Tone</label>
                                    <button
                                        onClick={() => setActiveModal('tone')}
                                        className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 text-left flex items-center justify-between hover:border-white/20 transition-all"
                                    >
                                        <span className="text-white font-medium">{tone}</span>
                                        <Type className="w-4 h-4 text-cyan-500" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Visual Theme</label>
                                    <button
                                        onClick={() => setActiveModal('theme')}
                                        className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 text-left flex items-center justify-between hover:border-white/20 transition-all"
                                    >
                                        <span className="text-white font-medium">{theme}</span>
                                        <Palette className="w-4 h-4 text-cyan-500" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || selectedFeeds.length === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all glow ${isGenerating || selectedFeeds.length === 0 ? 'bg-cyan-900/30 text-cyan-400/50 cursor-not-allowed border border-cyan-500/10' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Feeds...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" /> Generate Digest
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
                                {selectedFeeds.length} feeds selected
                            </p>
                        </div>
                    </div>
                </div>

                {/* Generated Content Preview */}
                <AnimatePresence>
                    {generatedContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 glass p-6 md:p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 flex gap-3">
                                <span className="px-3 py-1 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest border border-orange-500/20">RSS Intelligence</span>
                                <span className="px-3 py-1 rounded bg-cyan-600/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">Preview Mode</span>
                            </div>

                            <div className="prose prose-invert max-w-4xl mx-auto mb-12">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ ...props }) => <h1 className="text-4xl font-black mb-8 text-white uppercase tracking-tighter" {...props} />,
                                        h2: ({ ...props }) => <h2 className="text-2xl font-bold mb-4 mt-12 text-cyan-400 border-b border-white/5 pb-2" {...props} />,
                                        p: ({ ...props }) => <p className="text-slate-300 leading-relaxed mb-6 text-lg" {...props} />,
                                        li: ({ ...props }) => <li className="text-slate-400 mb-3 list-disc list-inside hover:text-white transition-colors" {...props} />,
                                        a: ({ ...props }) => <a className="text-cyan-500 hover:underline flex items-center gap-1" target="_blank" {...props}><ExternalLink className="w-3 h-3" /> Read More</a>
                                    }}
                                >
                                    {generatedContent}
                                </ReactMarkdown>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-6 pt-12 border-t border-white/5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">Newsletter Digest Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleSave('DRAFT')}
                                        disabled={isSaving}
                                        className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold transition-all text-lg"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        onClick={() => handleSave('COMPLETED')}
                                        disabled={isSaving}
                                        className="flex-1 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all glow text-lg flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" /> Finalize Digest
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <Modal isOpen={activeModal === 'add'} onClose={() => setActiveModal(null)} title="Add RSS Feed Source">
                <form onSubmit={handleAddFeed} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">RSS Feed URL</label>
                        <input
                            type="url"
                            value={newFeedUrl}
                            onChange={(e) => setNewFeedUrl(e.target.value)}
                            placeholder="https://example.com/feed.xml"
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all glow flex items-center justify-center gap-2"
                    >
                        {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Connect Source'}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'layout'} onClose={() => setActiveModal(null)} title="Select Digest Layout">
                {renderSelectionGrid(layouts, layout, setLayout)}
            </Modal>
            <Modal isOpen={activeModal === 'tone'} onClose={() => setActiveModal(null)} title="Select Writing Tone">
                {renderSelectionGrid(tones, tone, setTone)}
            </Modal>
            <Modal isOpen={activeModal === 'theme'} onClose={() => setActiveModal(null)} title="Select Intelligence Theme">
                {renderSelectionGrid(themes, theme, setTheme)}
            </Modal>

            <Modal isOpen={!!feedToDelete} onClose={() => setFeedToDelete(null)} title="Delete RSS Feed">
                <div className="space-y-6">
                    <p className="text-slate-300">Are you sure you want to delete this feed? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFeedToDelete(null)}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Plan Limit Modal */}
            <Modal isOpen={isPlanLimitModalOpen} onClose={() => setIsPlanLimitModalOpen(false)} title="Upgrade to Pro">
                <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Limit Reached</h3>
                        <p className="text-slate-400">You've reached the maximum number of RSS feeds for the Free plan. Upgrade to Pro for unlimited feeds and advanced AI models.</p>
                    </div>
                    <button
                        onClick={() => window.open('/pricing', '_blank')}
                        className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                    >
                        Upgrade Now
                    </button>
                </div>
            </Modal>

            {/* Generic Error Modal */}
            <Modal isOpen={!!errorMessage} onClose={() => setErrorMessage(null)} title="Notice">
                <div className="space-y-6">
                    <p className="text-slate-300">{errorMessage}</p>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    )
}
