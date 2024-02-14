import { NextRequest } from "next/server";
import Stripe from "stripe";
export async function POST(request: NextRequest) {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
        apiVersion: '2023-10-16',
    });

    const body = await request.json();

    const { userName, userEmail, userStripeId } = body; //check user stripe id here too

    const existingCustomers = await stripe.customers.search({
        query: `email: "${userEmail}"`
    })

    const customerExists = existingCustomers.data.length > 0

    if (existingCustomers && customerExists) {
        try {
            const paidCustomer = existingCustomers.data.find((customer) => customer.currency);
            const firstCustomer = existingCustomers.data[0]

            const customerId = paidCustomer?.id || firstCustomer.id

            const subscriptions = await stripe.subscriptions.list({
                customer: customerId
            })

            const hasSubscription = subscriptions.data.length > 0;

            return new Response(JSON.stringify({ customerId, hasSubscription }));
        } catch (error: any) {
/*
            console.log(error)
*/
            return new Response(error)
        }
    } else {
        try {
            if (userName && userEmail && !userStripeId) {
                const customer = await stripe.customers.create({
                    email: String(userEmail),
                    name: String(userName)
                });


                if (!customer) {
                    return new Response("User already is a stripe customer or user credentials are wrong.")
                }

                const customerId = customer.id
                const hasSubscription = false

                return new Response(JSON.stringify({customerId, hasSubscription}));
            } else {
                return new Response("User already is a stripe customer or user credentials are wrong.")
            }
        } catch (error: any) {
/*
            console.log(error)
*/
            return new Response(error)
        }
    }
}