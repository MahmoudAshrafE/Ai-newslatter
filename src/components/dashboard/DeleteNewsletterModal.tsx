'use client'

import Modal from '@/components/ui/Modal'
import { AlertCircle } from 'lucide-react'
import { Newsletter } from '@/types/newsletter'

interface DeleteNewsletterModalProps {
    isOpen: boolean
    onClose: () => void
    onDelete: () => Promise<void>
    isProcessing: boolean
    newsletter: Newsletter | null
}

export default function DeleteNewsletterModal({
    isOpen,
    onClose,
    onDelete,
    isProcessing,
    newsletter
}: DeleteNewsletterModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Newsletter"
        >
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <p className="text-slate-300 text-lg">Are you sure you want to delete <span className="text-white font-bold">"{newsletter?.title}"</span>?</p>
                    <p className="text-slate-500 text-sm mt-2">This action cannot be undone and you will lose all generated content.</p>
                </div>
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                    >
                        {isProcessing ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
