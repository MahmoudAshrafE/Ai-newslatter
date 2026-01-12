import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Please read these terms and conditions carefully before using Our Service.
                    </p>
                    {/* Add full terms content here */}
                    <p>
                        [This is a placeholder for your Terms of Service. You should outline the rules and regulations for using your Website and Services.]
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
