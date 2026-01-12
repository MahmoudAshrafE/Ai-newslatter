import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </p>
                    {/* Add full policy content here */}
                    <p>
                        [This is a placeholder for your detailed privacy policy. You should generate a comprehensive policy that complies with regulations like GDPR, CCPA, etc., depending on your user base.]
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
