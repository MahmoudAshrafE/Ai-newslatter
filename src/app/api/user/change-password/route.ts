import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        }) as any;

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found or no password set" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        // Add notification
        await prisma.notification.create({
            data: {
                userId: updatedUser.id,
                title: "Password Changed",
                message: "Your account password has been successfully updated.",
                type: "WARNING",
            }
        });

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error: any) {
        console.error("Password update error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update password" },
            { status: 500 }
        );
    }
}
