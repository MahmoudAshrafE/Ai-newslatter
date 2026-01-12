import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-950">
            <DashboardHeader />
            <main>
                {children}
            </main>
        </div>
    )
}
