'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                We encountered an unexpected error. Our team has been notified.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/5"
            >
                <RefreshCcw className="w-4 h-4" />
                Try again
            </button>
        </div>
    )
}
