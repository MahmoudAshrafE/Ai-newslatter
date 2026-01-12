'use client'

import { motion } from 'framer-motion'
import { FileText, Files, Edit2, Trash2, Calendar, Eye, Send } from 'lucide-react'
import { Newsletter } from '@/types/newsletter'

interface NewsletterCardProps {
    newsletter: Newsletter
    index: number
    onDuplicate: (nl: Newsletter) => void
    onEdit: (nl: Newsletter) => void
    onDelete: (nl: Newsletter) => void
    onView: (nl: Newsletter) => void
    onSend: (nl: Newsletter) => void
}

export default function NewsletterCard({
    newsletter,
    index,
    onDuplicate,
    onEdit,
    onDelete,
    onView,
    onSend
}: NewsletterCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-800 border border-white/5`}>
                    <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex gap-2 text-white">
                    <button
                        onClick={() => onDuplicate(newsletter)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                        title="Duplicate"
                    >
                        <Files className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onEdit(newsletter)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(newsletter)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight text-white line-clamp-1">{newsletter.title}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-1">{newsletter.topic}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(newsletter.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-0.5 rounded-full border border-white/5 font-medium ${newsletter.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    newsletter.status === 'COMPLETED' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {newsletter.status}
                </span>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex gap-3 text-white">
                <button
                    onClick={() => onView(newsletter)}
                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" /> View
                </button>
                <button
                    onClick={() => onSend(newsletter)}
                    disabled={newsletter.status === 'SENT'}
                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 transition-colors flex items-center justify-center gap-1 border border-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-3 h-3" /> {newsletter.status === 'SENT' ? 'Sent' : 'Send'}
                </button>
            </div>
        </motion.div>
    )
}
