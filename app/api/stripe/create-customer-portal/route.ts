import { NextRequest } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {

    const body = await request.json();

    const { stripeCustomerId } = body;

    if (stripeCustomerId) {

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: process.env.STRIPE_RETURN_URL
        })

        return new Response(JSON.stringify(portalSession.url));
    } else {
        return new Response("User already is a stripe customer or user credentials are wrong.")
    }
}