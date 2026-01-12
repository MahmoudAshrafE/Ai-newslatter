import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { resend } from "@/lib/resend";
import { renderNewsletterEmail } from "@/lib/email-renderer";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const newsletter = await prisma.newsletter.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!newsletter || newsletter.user.email !== session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.newsletter.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { title, topic, content, status } = await req.json();

        // Verify ownership
        const existingNewsletter = await prisma.newsletter.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existingNewsletter || existingNewsletter.user.email !== session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // If status is changing to SENT, actually send the email via Resend
        if (status === 'SENT' && existingNewsletter.status !== 'SENT') {
            try {
                const emailHtml = await renderNewsletterEmail(existingNewsletter.content);

                // For Resend free tier, you can only send to your verified email.
                // We will send it to the logged-in user's email for demonstration.
                await resend.emails.send({
                    from: 'AI Newsletters <onboarding@resend.dev>', // Default Resend testing sender
                    to: session.user.email, // Send to the user themselves for testing
                    subject: existingNewsletter.title,
                    html: emailHtml,
                });
            } catch (emailError) {
                console.error("Failed to send email via Resend:", emailError);
                // We continue to update status to SENT, but you might want to handle this differently in prod
                // For now, we'll assume if email fails, we shouldn't mark as sent? Or maybe warn?
                // Let's throw to stop the status update if email fails, so user knows it failed.
                return NextResponse.json({ error: "Failed to send email via provider" }, { status: 500 });
            }
        }

        const newsletter = await prisma.newsletter.update({
            where: { id },
            data: {
                title,
                topic,
                content,
                status
            }
        });

        return NextResponse.json(newsletter);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 });
    }
}

