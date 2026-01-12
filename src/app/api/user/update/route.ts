import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            image,
            newsletterName,
            newsletterDescription,
            targetAudience,
            defaultTone,
            companyName,
            industry,
            legalDisclaimer
        } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                image,
                newsletterName,
                newsletterDescription,
                targetAudience,
                defaultTone,
                companyName,
                industry,
                legalDisclaimer
            },
        });

        // Add notification with defensive access
        // @ts-ignore
        const modelKeys = Object.keys(prisma).filter(k => !k.startsWith('$'));
        const notifyKey = modelKeys.find(k => k.toLowerCase() === 'notification');
        const notifyModel = notifyKey ? (prisma as any)[notifyKey] : null;

        if (notifyModel) {
            await notifyModel.create({
                data: {
                    userId: updatedUser.id,
                    title: "Profile Updated",
                    message: "Your profile information has been successfully updated.",
                    type: "INFO",
                }
            });
        }

        return NextResponse.json(updatedUser);

    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
