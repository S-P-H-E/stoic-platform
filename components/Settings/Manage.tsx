'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../UI Elements/Button';
import { AiOutlineCreditCard } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { BiLoader } from 'react-icons/bi';

export default function Manage({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateCustomerPortal = async () => {
    try {
      setLoading(true)
      if (stripeCustomerId) {
        const response = await fetch('/api/stripe/create-customer-portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeCustomerId,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create portal');
        }
  
        const data = await response.json();
  
        return data;
      } else {
        console.log('No stripe customer id found matching ur profile.');
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const handleClick = async () => {
    const customerPortalUrl = await generateCustomerPortal();
    router.push(customerPortalUrl);
  };
  
  return (
    <Button
      onClick={handleClick}
      className={clsx('md:h-12 md:w-12 !p-0 w-full xl:w-full xl:h-14 bg-blue-600 hover:bg-blue-500 lg:font-medium 2xl:text-lg md:text-base gap-3 !ring-blue-500/50', loading && 'opacity-50')}
    >
      <p className="lg:hidden xl:block">{loading ? <BiLoader size={24} className="animate-spin"/> : 'Manage Subscription'}</p>
      {!loading &&
        <AiOutlineCreditCard />
      }
    </Button>
  );
}
