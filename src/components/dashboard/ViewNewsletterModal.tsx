'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Smartphone, Monitor, Check, Copy, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Newsletter } from '@/types/newsletter'
import { generateNewsletterHtml } from '@/lib/newsletter-utils'

interface ViewNewsletterModalProps {
    isOpen: boolean
    onClose: () => void
    newsletter: Newsletter | null
    onEdit: () => void
    onSend: () => void
    onToast: (msg: string, type: 'success' | 'error') => void
}

export default function ViewNewsletterModal({
    isOpen,
    onClose,
    newsletter,
    onEdit,
    onSend,
    onToast
}: ViewNewsletterModalProps) {
    const [isMobilePreview, setIsMobilePreview] = useState(false)
    const [copyStatus, setCopyStatus] = useState<'IDLE' | 'HTML' | 'MD'>('IDLE')

    const handleExport = async (type: 'HTML' | 'MD' | 'DOWNLOAD') => {
        if (!newsletter) return

        if (type === 'MD') {
            await navigator.clipboard.writeText(newsletter.content)
            setCopyStatus('MD')
            setTimeout(() => setCopyStatus('IDLE'), 2000)
            onToast('Markdown copied to clipboard!', 'success')
        } else if (type === 'HTML' || type === 'DOWNLOAD') {
            try {
                const emailTemplate = generateNewsletterHtml(newsletter.content)

                if (type === 'HTML') {
                    await navigator.clipboard.writeText(emailTemplate)
                    setCopyStatus('HTML')
                    onToast('HTML copied to clipboard!', 'success')
                    setTimeout(() => setCopyStatus('IDLE'), 2000)
                } else if (type === 'DOWNLOAD') {
                    const blob = new Blob([emailTemplate], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${newsletter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                    onToast('HTML downloaded successfully!', 'success')
                }
            } catch (err) {
                console.error('Export failed', err)
                onToast('Failed to export content', 'error')
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={newsletter?.title || "Newsletter Preview"}
        >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview Mode</p>
                <button
                    onClick={() => setIsMobilePreview(!isMobilePreview)}
                    className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${isMobilePreview ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}
                >
                    {isMobilePreview ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    {isMobilePreview ? 'Mobile View' : 'Desktop View'}
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-white">
                <div className={`prose prose-invert mx-auto transition-all duration-300 ${isMobilePreview ? 'max-w-[375px] border-x border-white/5 px-6 bg-black/20' : 'max-w-none'}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4 text-cyan-400" {...props} />,
                            h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3 mt-6 text-white" {...props} />,
                            p: ({ ...props }) => <p className="text-slate-300 leading-relaxed mb-4 text-sm" {...props} />,
                            li: ({ ...props }) => <li className="text-slate-300 mb-2 list-disc list-inside text-sm" {...props} />,
                        }}
                    >
                        {newsletter?.content || ''}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 py-4 border-t border-white/5 mt-4">
                <button
                    onClick={() => handleExport('MD')}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                    {copyStatus === 'MD' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copyStatus === 'MD' ? 'Copied MD!' : 'Copy Markdown'}
                </button>
                <button
                    onClick={() => handleExport('HTML')}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                    {copyStatus === 'HTML' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copyStatus === 'HTML' ? 'Copied HTML!' : 'Copy HTML'}
                </button>
                <button
                    onClick={() => handleExport('DOWNLOAD')}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                    <Download className="w-3 h-3" /> Download .html
                </button>
            </div>
            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => { onClose(); onEdit() }}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                >
                    Edit Details
                </button>
                <button
                    onClick={() => { if (newsletter) onSend() }}
                    disabled={newsletter?.status === 'SENT'}
                    className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {newsletter?.status === 'SENT' ? 'Sent' : 'Send Now'}
                </button>
            </div>
        </Modal>
    )
}
