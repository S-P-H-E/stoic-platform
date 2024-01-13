"use client"
import React, { useEffect, useState } from 'react'
import { FaBook, FaGraduationCap, FaStripe } from 'react-icons/fa'
import { BsFillPersonFill, BsStars, BsFillCheckCircleFill, BsPeopleFill, BsArrowLeftShort } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { UserDataFetcher } from '@/utils/userDataFetcher'
import { BiLoader, BiLogOut } from 'react-icons/bi'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/utils/firebase'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'
import { ButtonShad } from '@/components/ui/buttonshad'
import { doc, setDoc } from 'firebase/firestore'

export default function UpgradeComponent() {
  const { userName, userId, userEmail, userStatus, userStripeId } = UserDataFetcher()
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const fadeInAnimationVariants = { // for framer motion  
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.05 * index,
        }
    })
}

  const features = [
    {
      id: 1,
      icon: <FaBook size={25}/>,
      name: 'Courses'
    },
    {
      id: 2,
      icon: <BsStars size={25}/>,
      name: 'AI Tools'
    },
    {
      id: 3,
      icon: <FaGraduationCap size={25}/>,
      name: 'In-Depth Tutorials'
    },
    {
      id: 4,
      icon: <BsFillPersonFill size={25}/>,
      name: '1-on-1 Coaching'
    },
    {
      id: 5,
      icon: <BsPeopleFill size={25}/>,
      name: 'Community'
    },
  ]

  const createCustomerIfNull = async () => {
    if (userName && userEmail && !userStripeId) {
      const response = await fetch('/api/stripe/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userEmail,
          userStripeId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const data = await response.json();

      await setDoc(
        doc(db, 'users', userId as string),
        {
          stripe_customer_id: data.id,
        },
        { merge: true }
      );
    } else {
      return null;
      // console.log("STRIPE CREDENTIALS ERROR");
    }
  };

  const generateCheckoutLink = async () => {
    try {
      setLoading(true)
      if (userStripeId) {
        const response = await fetch('/api/stripe/create-checkout-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userStripeId,
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

/*   const handleBuy = async () => {
    const checkout = await generateCheckoutLink()

    router.push(checkout)
  } */

  const handleBuy = async () => {
    try {
      setLoading(true);

      if (!userStripeId) {
        await createCustomerIfNull();
      }

      const checkout = await generateCheckoutLink();

      if (checkout) {
        router.push(checkout);
      }

    } catch (error) {
      console.error('Error handling buy:', error);
    } finally {
      setLoading(false);
    }
  };

/*     useEffect(() => {
      if (userStatus == 'admin' || userStatus == 'premium') {
        console.log(userStatus)
      router.push('/dashboard');
      }
    }, [router, userStatus]); */

  return (
    <div className="flex flex-col gap-4 items-center justify-center py-[8svh] px-3">
      <Link className="group" href="/">
        <ButtonShad variant={'outline'}><div className="flex gap-2 items-center"><BsArrowLeftShort className="transition duration-200 group-hover:-translate-x-1" size={20}/><p>Go back to homepage</p></div></ButtonShad>
      </Link>
      
      <motion.div className='border border-border w-[450px] rounded-3xl p-8 flex flex-col items-center gap-2 bg-gradient-to-tl from-[white]/5'
        custom={1}
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{
          once: true,
        }}
      >
        <div className='flex flex-col justify-center items-center w-full'>
          {userName ? 
            <div className='flex items-center gap-1 bg-upgrade rounded-full px-4 py-1 text-black my-2'>
              <BsFillPersonFill />
              <h2 className='text-black'>{userName}</h2>    
              <button onClick={() => signOut(auth)} className='font-normal 2x:text-lg md:text-base bg-transparent p-1 hover:bg-red-600 rounded-xl transition duration-200'>
                  <BiLogOut/>
              </button>
            </div>
          : 
          <div className='flex items-center gap-1 bg-upgrade rounded-full px-4 py-1 text-black my-2'>
            <BsFillPersonFill />
          <h2 className='text-black'>Loading...</h2>
          </div>
          }
          <h1 className='text-2xl uppercase'>Upgrade to premium</h1>
        </div>

        <h1 className='text-4xl text-upgrade pb-5 flex flex-col items-center font-medium'>
          <mark className='bg-transparent text-xl text-gray-500 line-through'>$99.99</mark>$49.99
        </h1>

        {features.map((feature) => (
          <motion.div initial="initial" whileInView="animate" viewport={{once: true,}} key={feature.id} custom={feature.id} variants={fadeInAnimationVariants} className='flex justify-between items-center gap-1 w-full p-2 rounded-md border border-[#1C1C1D]'>
            <div className='flex items-center'>
              <div className='bg-[#F7C910]/10 text-upgrade p-2 rounded-lg'>
                {feature.icon}
              </div>
              <h1 className='px-2 font-medium'>{feature.name}</h1>
            </div>
            
            <BsFillCheckCircleFill className='text-upgrade'/>
          </motion.div>
        ))}
        <motion.button className={clsx('upgrade mt-5', loading && 'transition !opacity-50')}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{ delay: 0.5 }}
        disabled={loading}

        onClick={handleBuy}
        >
          {loading ? <div className="items-center justify-center w-full flex gap-2"><BiLoader className="animate-spin"/> <p>Processing</p> </div> : <p>UPGRADE</p>}
        </motion.button>

        <div className='flex items-center gap-1 border border-border px-2 rounded-lg mt-6'>
          <p className='text-sm'>Secured by</p>
          <FaStripe size={35}/>
        </div>
      </motion.div>
    </div>
  )
}
