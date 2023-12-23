"use client"

import Stripe from 'stripe';
import { UserDataFetcher } from './userDataFetcher';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const { userName, user, userId } = UserDataFetcher();

export const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2023-10-16',
});

export async function hasSubscription() {
    if (user) {
        const userDoc = await getDoc(doc(db, 'users', userId as string));

        if (userDoc.exists()) {
            const subscriptions = await stripe.subscriptions.list({
                customer: String(userDoc.data()?.stripe_customer_id)
            });

            return subscriptions.data.length > 0;
        } else {
            return false;
        }
    }

    return false;
}


export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: "http://localhost:3000/dashboard&success=true",
        cancel_url: "http://localhost:3000/dashboard&success=true",
        customer: customer,
        line_items: [
            {
                price: 'price_1OQDHAJVAR9FxLkwMyF9bdlM',
                quantity: 1
            }
        ],
        mode: "subscription"
    })

    return checkout.url;
}

export async function generateCustomerPortalLink(customerId: string) {
    try {
        
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: "http://localhost:3000/dashboard", 
        });

        console.log()

        return portalSession.url;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}

export async function createCustomerIfNull() {
    if (user) {
        const userDoc = await getDoc(doc(db, 'users', userId as string));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData && !userData.stripe_customer_id) {
                const customer = await stripe.customers.create({
                    email: String(userData.email),
                    name: String(userData.name)
                });

                await setDoc(doc(db, 'users', userId as string), {
                    stripe_customer_id: customer.id
                }, { merge: true });
            }

            const user2Doc = await getDoc(doc(db, 'users', userId as string));
            return user2Doc.exists() ? user2Doc.data()?.stripe_customer_id : undefined;
        } else {
            // Handle the case when the user document doesn't exist
            return undefined;
        }
    }

    return undefined;
}