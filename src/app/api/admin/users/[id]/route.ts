import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Expecting params to be a Promise in Next.js 15+ 
) {
    const session = await auth()
    // Await params if it's a promise, though typically in older Next.js it wasn't. 
    // In Next.js 15, params are async. In 14, they are not. 
    // Adapting to standard pattern:
    const { id } = await params

    if (session?.user?.role?.toUpperCase() !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!id) {
        return new NextResponse("User ID required", { status: 400 })
    }

    try {
        await prisma.user.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 200 })
    } catch (error) {
        console.error("Delete User Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
