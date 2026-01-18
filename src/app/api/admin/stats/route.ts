import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const [userCount, newsletterCount, subscriptionCount] = await Promise.all([
            prisma.user.count(),
            prisma.newsletter.count(),
            prisma.user.count({
                where: {
                    plan: {
                        not: 'FREE'
                    }
                }
            })
        ])

        return NextResponse.json({
            users: userCount,
            newsletters: newsletterCount,
            subscriptions: subscriptionCount
        })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
