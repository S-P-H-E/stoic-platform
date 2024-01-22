import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
        apiVersion: '2023-10-16',
    });

    const body = await request.json();

    const { stripeCustomerId, userId, globalUserId, globalUserRole } = body;

    if (!userId) {
        return new Response ("No user found.")
    }

    if (globalUserId != userId && globalUserRole !== 'admin') {
        return new Response ("You are not allowed to make this request!")
    }

    if (stripeCustomerId) {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/user/${userId}`
        })

        return new Response(JSON.stringify(portalSession.url));
    } else {
        return new Response("User isn't a stripe customer or there is another issue with the request.")
    }
}