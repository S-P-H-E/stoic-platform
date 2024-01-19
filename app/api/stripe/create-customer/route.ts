import { NextRequest } from "next/server";
import Stripe from "stripe";
export async function POST(request: NextRequest) {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
        apiVersion: '2023-10-16',
    });

    const body = await request.json();

    const { userName, userEmail, userStripeId } = body; //check user stripe id here too

    console.log(userEmail)
    console.log(userName)
    console.log(userStripeId)

    try {
        if (userName && userEmail && !userStripeId) {
            const customer = await stripe.customers.create({
                email: String(userEmail),
                name: String(userName)
            });
    
        return new Response(JSON.stringify(customer));
        } else {
            return new Response("User already is a stripe customer or user credentials are wrong.")
        }
    } catch (error) {
        console.log(error)
    }
}