"use client"

import {useState} from 'react'
import { useRouter } from 'next/navigation';
import { ButtonShad } from '../ui/buttonshad';
import { BiLoader } from 'react-icons/bi';
import { User } from '@/types/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { message } from 'antd';
import { LuWallet } from "react-icons/lu";
import clsx from "clsx";

interface MembershipProps {
  stripeCustomerId: string | undefined;
  userId: string;
  globalUserId: string | null | undefined;
  globalUserRole: string | undefined;
  globalStripeCustomerId: string | undefined;
  globalUserName: string | null | undefined;
  globalUserStatus: string | undefined;
  user: User;
  settings?: boolean;
}

export default function Membership({settings, user, globalUserStatus, stripeCustomerId, userId, globalUserId, globalUserRole, globalUserName, globalStripeCustomerId}: MembershipProps) {
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const createCustomerIfNull = async () => {
      setLoading(true)
      try {
        if (user.name == globalUserName || globalUserRole === 'admin') {

          const userName = user.name
          const userEmail = user.email
          const userStripeId = user.stripeId
  
          const response = await fetch('/api/stripe/create-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName,
              userEmail,
              userStripeId
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to create customer');
          }

          const data = await response.json();

          const { customerId, hasSubscription } = data;

          if (user.status === 'admin') {
            await setDoc(
                doc(db, 'users', userId as string),
                {
                  stripe_customer_id: customerId,
                },
                {merge: true}
            );
          } else {
            await setDoc(
                doc(db, 'users', userId as string),
                {
                  status: hasSubscription ? 'premium' : 'user',
                  stripe_customer_id: customerId,
                },
                {merge: true}
            );
          }

          return data.id
        } else {
          return null
          // console.log("STRIPE CREDENTIALS ERROR");
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    const generateCustomerPortal = async (createdStripeId?: string) => {
        try {
          setLoading(true)
          if (stripeCustomerId || createdStripeId) {
            const response = await fetch('/api/stripe/create-customer-portal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                stripeCustomerId: stripeCustomerId || createdStripeId,
                userId,
                globalUserId,
                globalUserRole
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
         /* console.log(error)*/
        } finally {
          setLoading(false)
        }
      };

      const handleClick = async () => {
        try {
          if (stripeCustomerId) {
            const customerPortalUrl = await generateCustomerPortal();

            if (customerPortalUrl) {
              router.push(customerPortalUrl);
            } else {
              message.error("Something went wrong. Please try again.")
            }
          } else {
            const createdCustomerId = await createCustomerIfNull();
            const customerPortalUrl = await generateCustomerPortal(createdCustomerId);

            if (customerPortalUrl) {
              router.push(customerPortalUrl);
            } else {
              message.error("Something went wrong. Please try again.")
            }
          }
        } catch (error) {
          console.error("Error in handleClick:", error);
        }
      };

  return (
    <ButtonShad onClick={handleClick} disabled={loading} className="disabled:cursor-not-allowed active:scale-90 transition">{loading ? <BiLoader className="animate-spin"/> : <div className="flex items-center gap-1"> <LuWallet size={16}/> <p className={clsx(!settings && "lg:block hidden")}>Membership</p></div>}</ButtonShad>
  )
}
