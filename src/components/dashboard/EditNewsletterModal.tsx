'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { Newsletter } from '@/types/newsletter'

interface EditNewsletterModalProps {
    isOpen: boolean
    onClose: () => void
    newsletter: Newsletter | null
    onSave: (title: string, topic: string) => Promise<void>
    isProcessing: boolean
}

export default function EditNewsletterModal({
    isOpen,
    onClose,
    newsletter,
    onSave,
    isProcessing
}: EditNewsletterModalProps) {
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')

    useEffect(() => {
        if (newsletter) {
            setTitle(newsletter.title)
            setTopic(newsletter.topic)
        }
    }, [newsletter, isOpen])

    const handleSave = () => {
        onSave(title, topic)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Newsletter"
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Newsletter Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-sans"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Topic / Area</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-sans"
                    />
                </div>
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all glow disabled:opacity-50"
                    >
                        {isProcessing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
