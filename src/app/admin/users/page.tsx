'use client'

import { useEffect, useState } from 'react'
import { Search, Trash2, Shield, User as UserIcon, Mail } from 'lucide-react'
import ModernLoader from '@/components/ui/ModernLoader'
import { motion } from 'framer-motion'

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
    _count: {
        newsletters: number
    }
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            if (Array.isArray(data)) setUsers(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone and will delete all their newsletters.")) return

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId))
            } else {
                alert("Failed to delete user")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ModernLoader size="md" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-slate-400">View and manage all registered users.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 bg-slate-900/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">User</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Activity</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white max-w-[150px] truncate">{user.name || 'Anonymous'}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'ADMIN' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                                                <Shield className="w-3 h-3" /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-white/5">
                                                USER
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="text-white font-bold">{user._count.newsletters}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Newsletters</p>
                                    </td>
                                    <td className="p-4 text-right pr-8">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-slate-500">No users found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
