'use client'

import ModernLoader from '@/components/ui/ModernLoader'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950">
            <ModernLoader size="lg" />
        </div>
    )
}
