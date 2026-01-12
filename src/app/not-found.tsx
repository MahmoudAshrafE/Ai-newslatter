import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                <FileQuestion className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all">
                Return Home
            </Link>
        </div>
    )
}
