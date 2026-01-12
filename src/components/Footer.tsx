import { Mail, Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-12 md:pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center glow">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">AI Newsletters</span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                            The world's most advanced AI newsletter generator. Built for creators, founders, and marketers who value quality and speed.
                        </p>
                        <div className="flex gap-4">
                            <Twitter className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
                            <Github className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-slate-500 hover:text-cyan-600 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API Docs</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Templates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                    <p>© 2024 AI Newsletter Generator Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span>Built with Next.js, Prisma & Neon</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
