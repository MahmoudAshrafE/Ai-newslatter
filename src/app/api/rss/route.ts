import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Parser from "rss-parser";
import { getPlanLimits } from "@/lib/plans";

const parser = new Parser({
    requestOptions: {
        rejectUnauthorized: false
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
});

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return NextResponse.json([]);

        // @ts-ignore
        const modelKeys = Object.keys(prisma).filter(k => !k.startsWith('$'));
        const rssKey = modelKeys.find(k => k.toLowerCase() === 'rssfeed');
        const rssModel = rssKey ? (prisma as any)[rssKey] : null;

        if (!rssModel) return NextResponse.json([]);

        const feeds = await rssModel.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });


        return NextResponse.json(feeds);
    } catch (error) {
        console.error("RSS GET error:", error);
        return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Validate RSS Feed
        let feedData;
        try {

            feedData = await parser.parseURL(url);
        } catch (e: any) {
            console.error("RSS Parsing failed:", e.message);
            return NextResponse.json({
                error: "Invalid or unreachable RSS feed URL. Please make sure the URL is correct and public.",
                details: e.message
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const limits = getPlanLimits((user as any).plan);
        const currentFeedsCount = await (prisma as any).rssFeed.count({
            where: { userId: user.id }
        });

        if (currentFeedsCount >= limits.maxRssFeeds) {
            return NextResponse.json({
                error: "Plan limit reached",
                details: `You have reached the maximum number of RSS feeds for the ${(user as any).plan} plan (${limits.maxRssFeeds} feeds). Please upgrade to Pro for unlimited feeds.`
            }, { status: 403 });
        }

        // @ts-ignore
        const modelKeys = Object.keys(prisma).filter(k => !k.startsWith('$'));
        const rssKey = modelKeys.find(k => k.toLowerCase() === 'rssfeed');
        const rssModel = rssKey ? (prisma as any)[rssKey] : null;

        if (!rssModel) {
            return NextResponse.json({
                error: "Prisma Sync Issue",
                details: `Prisma client needs a restart. Available models: ${modelKeys.join(', ')}`
            }, { status: 500 });
        }

        const newFeed = await rssModel.create({
            data: {
                url,
                name: feedData.title || "Untitled Feed",
                description: feedData.description || "",
                userId: user.id
            }
        });

        return NextResponse.json(newFeed);
    } catch (error: any) {
        console.error("RSS POST error:", error);
        return NextResponse.json({
            error: "We couldn't add this feed. It might be due to a database sync issue or an invalid format.",
            details: error?.message
        }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.rssFeed.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("RSS DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
    }
}
