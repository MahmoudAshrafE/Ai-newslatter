import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (session?.user?.role?.toUpperCase() !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const [
            userCount,
            newsletterCount,
            subscriptionCount,
            accountCount,
            rssFeedCount,
            draftNewsletters,
            sentNewsletters,
            newUsersLast30Days,
            dailyNewsletterStats
        ] = await Promise.all([
            prisma.user.count(),
            prisma.newsletter.count(),
            prisma.user.count({ where: { plan: { not: 'FREE' } } }),
            prisma.account.count(),
            prisma.rssFeed.count(),
            prisma.newsletter.count({ where: { status: 'DRAFT' } }),
            prisma.newsletter.count({ where: { status: 'SENT' } }),
            prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.newsletter.groupBy({
                by: ['createdAt'],
                where: { createdAt: { gte: thirtyDaysAgo } },
                _count: { id: true },
            })
        ])

        // Process daily stats for chart (fill in missing days)
        const chartData = []
        for (let i = 0; i < 30; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateString = date.toISOString().split('T')[0]

            // This is a rough approximation because groupBy returns DateTime objects, not date strings.
            // A precise implementation would require raw SQL or backend processing. 
            // For now, we will aggregate roughly by matching dates in JS.
            const count = dailyNewsletterStats.filter(stat =>
                stat.createdAt.toISOString().split('T')[0] === dateString
            ).reduce((acc, curr) => acc + curr._count.id, 0)

            chartData.unshift({ date: dateString, value: count })
        }

        return NextResponse.json({
            users: userCount,
            newsletters: newsletterCount,
            subscriptions: subscriptionCount,
            accounts: accountCount,
            rssFeeds: rssFeedCount,
            drafts: draftNewsletters,
            sent: sentNewsletters,
            newUsers: newUsersLast30Days,
            chartData
        })
    } catch (error) {
        console.error("Stats Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
