import AdminHeader from '@/components/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-950">
            <AdminHeader />
            <main>
                {children}
            </main>
        </div>
    )
}
