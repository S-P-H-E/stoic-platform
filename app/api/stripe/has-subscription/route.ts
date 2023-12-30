import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2023-10-16',
  });

  const body = await request.json();

  const { userStripeId } = body;

   if (userStripeId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: userStripeId,
    });

    /* console.log(subscriptions) */

    const hasSubscription = subscriptions.data.length > 0;

    return new NextResponse(JSON.stringify(hasSubscription))
  }

  return new NextResponse(JSON.stringify(false))
}
