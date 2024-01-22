import { NextRequest } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2023-10-16',
  });

  const body = await request.json();

  const { userStripeId } = body;

  console.log('RECEIVED STRIPE ID ON SERVER: ' + userStripeId)

  if (userStripeId) {
    const checkout = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/upgrade`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/upgrade`,
      customer: userStripeId,
      line_items: [
        {
          price:
            'price_1OSO71JVAR9FxLkw0dmNnwqO' /* price_1OSO71JVAR9FxLkw0dmNnwqO */,
          quantity: 1,
        },
      ],
      mode: 'subscription',
    });

    return new Response(JSON.stringify(checkout.url));
  } else {
    return new Response(
      'User isnt a stripe customer or user credentials are wrong.'
    );
  }
}
