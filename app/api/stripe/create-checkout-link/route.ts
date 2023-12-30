import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
        apiVersion: '2023-10-16',
    });

    const body = await request.json();

    const { userStripeId } = body;

    if (userStripeId) {
        const checkout = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:3000/upgrade', //! change in future
            cancel_url: 'http://localhost:3000/upgrade',
            customer: userStripeId,
            line_items: [
              {
                price: 'price_1NRdQRJVAR9FxLkw45myeidy', /* price_1OSO71JVAR9FxLkw0dmNnwqO */
                quantity: 1,
              },
            ],
            mode: 'subscription',
          });

        return new Response(JSON.stringify(checkout.url));
    } else {
        return new Response("User isnt a stripe customer or user credentials are wrong.")
    }
}