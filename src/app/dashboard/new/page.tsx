'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Sparkles, Layout, Type, Palette, Loader2, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Modal from '@/components/ui/Modal'

export default function NewNewsletterPage() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [topic, setTopic] = useState('')
    const [title, setTitle] = useState('')
    const [generatedContent, setGeneratedContent] = useState('')
    const [copied, setCopied] = useState(false)
    const [isRTL, setIsRTL] = useState(false)


    // Selection States
    const [layout, setLayout] = useState('Standard')
    const [tone, setTone] = useState('Professional')
    const [theme, setTheme] = useState('Modern Dark')

    // Modal States
    const [activeModal, setActiveModal] = useState<'layout' | 'tone' | 'theme' | null>(null)

    const layouts = ['Standard', 'Minimalist', 'In-depth Research', 'Storytelling']
    const tones = ['Professional', 'Casual', 'Enthusiastic', 'Serious', 'Witty']
    const themes = ['Modern Dark', 'Futuristic', 'Eco-Nature', 'Corporate Blue', 'Sunset Vibes']

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSuggest = async () => {
        setIsSuggesting(true)
        try {
            const res = await fetch('/api/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentTopic: topic })
            })
            const data = await res.json()
            if (data.suggestions) {
                setSuggestions(data.suggestions)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSuggesting(false)
        }
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!topic) return

        setIsGenerating(true)
        setGeneratedContent('')
        setTitle(topic) // Default title to topic


        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    layout,
                    tone,
                    theme
                }),
            })

            const data = await response.json()

            if (response.status === 429) {
                alert("AI Limit Reached: You've exceeded the AI generation quota for today. Please wait a few minutes or try again tomorrow.")
                return
            }

            if (data.error) {
                throw new Error(data.error)
            }

            setGeneratedContent(data.content || '')
        } catch (error: any) {
            console.error('Error generating newsletter:', error)
            alert(error.message || 'Failed to generate newsletter. Please check your connection.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async (status: 'DRAFT' | 'COMPLETED' | 'SENT') => {
        if (!generatedContent || !title) {
            alert('Please generate content and provide a title first.')
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/newsletters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    topic,
                    content: generatedContent,
                    status
                }),
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            // Redirect to dashboard
            window.location.href = '/dashboard'
        } catch (error: any) {
            console.error('Error saving newsletter:', error)
            alert(error.message || 'Failed to save newsletter.')
        } finally {
            setIsSaving(false)
        }
    }

    const renderSelectionGrid = (options: string[], current: string, setter: (val: string) => void) => (
        <div className="grid grid-cols-2 gap-4 text-white">
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
                    <span className="font-medium">{option}</span>
                    {current === option && <Check className="w-5 h-5" />}
                </button>
            ))}
        </div>
    )

    // Theme definitions
    const themeStyles: Record<string, { container: string, h1: string, h2: string, text: string, accent: string, border: string }> = {
        'Modern Dark': {
            container: 'bg-slate-900/50 border-white/10',
            h1: 'text-cyan-400',
            h2: 'text-white',
            text: 'text-slate-300',
            accent: 'bg-cyan-600',
            border: 'border-white/10'
        },
        'Futuristic': {
            container: 'bg-black/80 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]',
            h1: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500',
            h2: 'text-fuchsia-200',
            text: 'text-slate-300 font-mono',
            accent: 'bg-fuchsia-600',
            border: 'border-purple-500/20'
        },
        'Eco-Nature': {
            container: 'bg-emerald-950/30 border-emerald-500/20 backdrop-blur-xl',
            h1: 'text-emerald-400',
            h2: 'text-emerald-100',
            text: 'text-emerald-50/80',
            accent: 'bg-emerald-600',
            border: 'border-emerald-500/10'
        },
        'Corporate Blue': {
            container: 'bg-blue-950/40 border-blue-400/20',
            h1: 'text-blue-400',
            h2: 'text-blue-100',
            text: 'text-blue-50/70',
            accent: 'bg-blue-600',
            border: 'border-blue-400/10'
        },
        'Sunset Vibes': {
            container: 'bg-orange-950/30 border-orange-500/20',
            h1: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500',
            h2: 'text-orange-100',
            text: 'text-orange-50/80',
            accent: 'bg-orange-600',
            border: 'border-orange-500/10'
        }
    }

    // Layout definitions
    const layoutStyles: Record<string, { container: string, prose: string }> = {
        'Standard': {
            container: 'max-w-4xl mx-auto',
            prose: 'prose-lg'
        },
        'Minimalist': {
            container: 'max-w-2xl mx-auto',
            prose: 'prose-base !leading-loose tracking-wide'
        },
        'In-depth Research': {
            container: 'max-w-5xl mx-auto',
            prose: 'prose-xl !max-w-none'
        },
        'Storytelling': {
            container: 'max-w-3xl mx-auto',
            prose: 'prose-lg font-serif italic-headings'
        }
    }

    // Tone definitions
    const toneStyles: Record<string, { icon: any, border: string }> = {
        'Professional': { icon: Check, border: 'border-l-4 border-l-slate-400' },
        'Casual': { icon: Sparkles, border: 'border-l-4 border-l-cyan-400' },
        'Enthusiastic': { icon: Wand2, border: 'border-l-4 border-l-yellow-400' },
        'Serious': { icon: Check, border: 'border-l-4 border-l-slate-600' },
        'Witty': { icon: Sparkles, border: 'border-l-4 border-l-purple-400' }
    }

    const currentTheme = themeStyles[theme] || themeStyles['Modern Dark']
    const currentLayout = layoutStyles[layout] || layoutStyles['Standard']
    const currentTone = toneStyles[tone] || toneStyles['Professional']

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 text-white">
                        <Sparkles className="w-8 h-8 text-cyan-400" /> Create Newsletter
                    </h1>
                    <p className="text-slate-400 text-lg">Define your topic and let our AI craft the perfect message.</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    <section className="glass p-6 md:p-8 rounded-3xl border border-white/5">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-slate-400">What is your newsletter about?</label>
                                    <button
                                        type="button"
                                        onClick={handleSuggest}
                                        disabled={isSuggesting}
                                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                                    >
                                        <Wand2 className={`w-3 h-3 ${isSuggesting ? 'animate-spin' : ''}`} />
                                        {isSuggesting ? 'Suggesting...' : 'Magic Suggest'}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. The impact of remote work on productivity"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-lg"
                                    required
                                />

                                <AnimatePresence mode="wait">
                                    {suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Magical Suggestions</p>
                                                <button
                                                    onClick={() => setSuggestions([])}
                                                    className="text-[10px] text-slate-500 hover:text-white transition-colors uppercase font-bold"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.map((s, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setTopic(s)
                                                            setSuggestions([])
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-cyan-500/5 border border-white/5 text-slate-400 text-xs font-medium hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center gap-2 group"
                                                    >
                                                        <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                                                        {s}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('layout')}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 group ${activeModal === 'layout' ? 'bg-cyan-600/10 border-cyan-500/30' : 'border-white/5 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <Layout className={`w-6 h-6 ${activeModal === 'layout' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-300">Layout</span>
                                    <span className="text-[10px] text-cyan-500/60 font-bold uppercase">{layout}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('tone')}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 group ${activeModal === 'tone' ? 'bg-cyan-600/10 border-cyan-500/30' : 'border-white/5 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <Type className={`w-6 h-6 ${activeModal === 'tone' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-300">Tone</span>
                                    <span className="text-[10px] text-cyan-500/60 font-bold uppercase">{tone}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('theme')}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 group ${activeModal === 'theme' ? 'bg-cyan-600/10 border-cyan-500/30' : 'border-white/5 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <Palette className={`w-6 h-6 ${activeModal === 'theme' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-300">Theme</span>
                                    <span className="text-[10px] text-cyan-500/60 font-bold uppercase">{theme}</span>
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all glow ${isGenerating ? 'bg-cyan-900/50 text-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" /> AI is writing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-6 h-6" /> Generate Newsletter
                                    </>
                                )}
                            </button>
                        </form>
                    </section>

                    <AnimatePresence>
                        {generatedContent && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 md:p-12 rounded-3xl border relative overflow-hidden transition-all duration-500 ${currentTheme.container} ${currentTone.border}`}
                            >
                                <div className="absolute top-0 right-0 p-4 flex gap-2">
                                    <button
                                        onClick={() => setIsRTL(!isRTL)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${isRTL ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
                                    >
                                        {isRTL ? 'Arabic Mode ON' : 'Normal Mode'}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy Content'}
                                    </button>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${currentTheme.accent} bg-opacity-20 text-white flex items-center gap-1`}>
                                        Draft Ready
                                    </span>
                                </div>
                                <div className={`prose ${currentLayout.prose} ${currentLayout.container} ${currentTheme.text} ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ ...props }) => <h1 className={`text-3xl font-bold mb-6 ${currentTheme.h1}`} {...props} />,
                                            h2: ({ ...props }) => <h2 className={`text-2xl font-bold mb-4 mt-8 ${currentTheme.h2}`} {...props} />,
                                            p: ({ ...props }) => <p className={`leading-relaxed mb-4 ${currentTheme.text}`} {...props} />,
                                            li: ({ ...props }) => <li className={`mb-2 list-disc list-inside ${currentTheme.text}`} {...props} />,
                                            strong: ({ ...props }) => <strong className={`font-bold ${currentTheme.h2}`} {...props} />,
                                        }}
                                    >
                                        {generatedContent}
                                    </ReactMarkdown>
                                </div>

                                <div className={`mt-12 pt-8 border-t ${currentTheme.border} flex flex-col gap-6`}>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Newsletter Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-sans"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleSave('DRAFT')}
                                            disabled={isSaving}
                                            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all text-white disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save as Draft'}
                                        </button>
                                        <button
                                            onClick={() => handleSave('COMPLETED')}
                                            disabled={isSaving}
                                            className="flex-1 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all text-white glow disabled:opacity-50"
                                        >
                                            {isSaving ? 'Publishing...' : 'Publish Now'}
                                        </button>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selection Modals */}
            <Modal
                isOpen={activeModal === 'layout'}
                onClose={() => setActiveModal(null)}
                title="Select Layout Style"
            >
                {renderSelectionGrid(layouts, layout, setLayout)}
            </Modal>

            <Modal
                isOpen={activeModal === 'tone'}
                onClose={() => setActiveModal(null)}
                title="Select Writing Tone"
            >
                {renderSelectionGrid(tones, tone, setTone)}
            </Modal>

            <Modal
                isOpen={activeModal === 'theme'}
                onClose={() => setActiveModal(null)}
                title="Select Visual Theme"
            >
                {renderSelectionGrid(themes, theme, setTheme)}
            </Modal>
        </div>
    )
}
