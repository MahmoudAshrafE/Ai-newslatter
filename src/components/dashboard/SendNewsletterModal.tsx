'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Send, Check, Loader2 } from 'lucide-react'
import { Newsletter } from '@/types/newsletter'

interface SendNewsletterModalProps {
    isOpen: boolean
    onClose: () => void
    newsletter: Newsletter | null
    onSendSuccess: (updated: Newsletter) => void
    onToast: (msg: string, type: 'success' | 'error') => void
}

type SendingStep = 'IDLE' | 'PREPARING' | 'SENDING' | 'SENT'

export default function SendNewsletterModal({
    isOpen,
    onClose,
    newsletter,
    onSendSuccess,
    onToast
}: SendNewsletterModalProps) {
    const [step, setStep] = useState<SendingStep>('IDLE')

    const confirmSend = async () => {
        if (!newsletter) return

        try {
            setStep('PREPARING')
            await new Promise(resolve => setTimeout(resolve, 1500)) // Fake preparation

            setStep('SENDING')
            await new Promise(resolve => setTimeout(resolve, 2000)) // Fake sending

            const res = await fetch(`/api/newsletters/${newsletter.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'SENT' })
            })

            if (res.ok) {
                const updated = await res.json()
                setStep('SENT')

                // Wait a bit on success state
                await new Promise(resolve => setTimeout(resolve, 1000))

                onSendSuccess(updated)
                onToast('Newsletter sent successfully!', 'success')
                handleClose()
            } else {
                throw new Error('Failed to update status')
            }
        } catch (err) {
            onToast('Failed to send newsletter', 'error')
            setStep('IDLE')
        }
    }

    const handleClose = () => {
        if (step === 'IDLE' || step === 'SENT') {
            onClose()
            // Reset step after closing animation
            setTimeout(() => setStep('IDLE'), 300)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Confirm Distribution"
        >
            {step === 'IDLE' ? (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
                        <Send className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-slate-300 text-lg">Ready to send <span className="text-white font-bold">"{newsletter?.title}"</span>?</p>
                        <p className="text-slate-500 text-sm mt-2">This will mark the newsletter as <span className="text-emerald-400 font-bold">SENT</span> and update your stats.</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmSend}
                            className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all glow"
                        >
                            Confirm Send
                        </button>
                    </div>
                </div>
            ) : (
                <div className="py-8 px-4">
                    <div className="max-w-xs mx-auto space-y-8">
                        {/* Step 1: Preparing */}
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${step !== 'PREPARING'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 animate-pulse'
                                }`}>
                                {step !== 'PREPARING' ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold transition-all ${step !== 'PREPARING' ? 'text-emerald-400' : 'text-white'}`}>Preparing Content</p>
                                <p className="text-xs text-slate-500">Optimizing images and layout...</p>
                            </div>
                        </div>

                        {/* Step 2: Sending */}
                        <div className={`flex items-center gap-4 transition-opacity duration-500 ${step === 'PREPARING' ? 'opacity-30' : 'opacity-100'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${step === 'SENT'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : step === 'SENDING'
                                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 animate-pulse'
                                    : 'bg-slate-800 border-white/10 text-slate-600'
                                }`}>
                                {step === 'SENT' ? <Check className="w-4 h-4" /> : step === 'SENDING' ? <Send className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold transition-all ${step === 'SENT' ? 'text-emerald-400' : step === 'SENDING' ? 'text-white' : 'text-slate-500'}`}>Sending to Subscribers</p>
                                <p className="text-xs text-slate-500">Distributing to 2.4k recipients...</p>
                            </div>
                        </div>

                        {/* Step 3: Success */}
                        <div className={`flex items-center gap-4 transition-opacity duration-500 ${step !== 'SENT' ? 'opacity-30' : 'opacity-100'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${step === 'SENT'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-slate-800 border-white/10 text-slate-600'
                                }`}>
                                {step === 'SENT' ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold transition-all ${step === 'SENT' ? 'text-emerald-400' : 'text-slate-500'}`}>Distribution Complete</p>
                                <p className="text-xs text-slate-500">Your newsletter is live!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}
