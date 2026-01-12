import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, signOut } from "@/auth";

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session.user.email;

        // Delete the user and all associated data (cascading deletes handled by Prisma schema if configured, usually)
        // Ensure your Prisma schema has onDelete: Cascade for relations like Newsletters, etc.
        await prisma.user.delete({
            where: { email: userEmail },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
