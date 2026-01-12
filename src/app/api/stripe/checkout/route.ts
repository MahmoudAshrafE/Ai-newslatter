import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { priceId } = await req.json()

        if (!priceId) {
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // If user already has a subscription, redirect to portal instead?
        // For now, let's just create a checkout session

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: session.user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
            },
        })

        return NextResponse.json({ url: stripeSession.url })

    } catch (error: any) {
        console.error("Stripe checkout error:", error)
        return NextResponse.json({
            error: "Checkout failed",
            details: error?.message || "Unknown error",
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 })
    }
}
