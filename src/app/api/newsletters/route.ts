import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getPlanLimits } from "@/lib/plans";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json([]);
        }

        const newsletters = await prisma.newsletter.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(newsletters);
    } catch (error) {
        console.error("GET newsletters error:", error);
        return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, topic, content, status } = await req.json();

        if (!title || !topic || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                _count: {
                    select: { newsletters: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const limits = getPlanLimits((user as any).plan);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newslettersThisMonth = await (prisma as any).newsletter.count({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfMonth
                }
            }
        });

        if (newslettersThisMonth >= limits.newslettersPerMonth) {
            return NextResponse.json({
                error: "Plan limit reached",
                details: `You have reached the monthly limit for the ${(user as any).plan} plan (${limits.newslettersPerMonth} newsletters). Please upgrade to Pro for unlimited generation.`
            }, { status: 403 });
        }

        const newsletter = await (prisma as any).newsletter.create({
            data: {
                title,
                topic,
                content,
                status: status || "DRAFT",
                userId: user.id
            }
        });

        // Add notification
        await (prisma as any).notification.create({
            data: {
                userId: user.id,
                title: status === 'COMPLETED' ? "Newsletter Published" : "Newsletter Saved",
                message: `Your newsletter "${title}" has been successfully ${status === 'COMPLETED' ? 'published' : 'saved as draft'}.`,
                type: status === 'COMPLETED' ? "SUCCESS" : "INFO",
            }
        });

        return NextResponse.json(newsletter);

    } catch (error: any) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to save newsletter" }, { status: 500 });
    }
}
