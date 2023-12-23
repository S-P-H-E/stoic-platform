
import { createCheckoutLink, generateCustomerPortalLink, hasSubscription } from '@/utils/stripe'
import React from 'react'

export default async function Manage({stripeCustomerId}: {stripeCustomerId: string}) {
/*     const manage_link = await generateCustomerPortalLink(stripeCustomerId)
    const checkout_link = await createCheckoutLink(stripeCustomerId)
  
    const hasSub = await hasSubscription() */
  return (
    <div>{stripeCustomerId}</div>
  )
}
