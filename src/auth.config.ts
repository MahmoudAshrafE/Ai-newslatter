import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const userRole = auth?.user?.role

            if (isOnAdmin) {
                if (isLoggedIn && userRole?.toUpperCase() === 'ADMIN') return true
                return false // Redirect non-admins
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
            }
            return true
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.role = (user as any).role
                token.image = (user as any).image
            }
            if (trigger === "update" && session) {
                token.name = session.user.name
                token.image = session.user.image
                token.role = session.user.role
            }
            return token
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.role = token.role as string
                session.user.image = token.image as string
            }
            return session
        }
    },
} satisfies NextAuthConfig
