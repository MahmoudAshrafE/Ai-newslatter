import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (session?.user?.role?.toUpperCase() !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        newsletters: true
                    }
                }
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
