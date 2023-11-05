"use client"
import React, { useEffect } from 'react'
import { FaBook, FaGraduationCap, FaStripe } from 'react-icons/fa'
import { BsFillPersonFill, BsStars, BsFillCheckCircleFill, BsPeopleFill } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { UserDataFetcher } from '@/utils/userDataFetcher'
import { BiLogOut } from 'react-icons/bi'
import { signOut } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useRouter } from 'next/navigation'

export default function Upgrade() {
  const { userName, userStatus } = UserDataFetcher()
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

    useEffect(() => {
      if (userStatus == 'admin' || userStatus == 'user') {
        console.log(userStatus)
      router.push('/dashboard');
      }
    }, [router, userStatus]);

  return (
    <div className="flex items-center justify-center py-24 px-3">
      <motion.div className=' border border-[#1C1C1D] w-[450px] rounded-3xl p-8 flex flex-col items-center gap-2 bg-gradient-to-tl from-[white]/5'
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
            <div className='flex items-center gap-1 bg-[--upgrade] rounded-full px-4 py-1 text-black my-2'>
              <BsFillPersonFill />
              <h2 className='text-black'>{userName}</h2>    
              <button onClick={() => signOut(auth)} className='font-normal 2x:text-lg md:text-base bg-transparent p-1 hover:bg-red-600 rounded-xl transition duration-200'>
                  <BiLogOut/>
              </button>
            </div>
          : 
          <div className='flex items-center gap-1 bg-[--upgrade] rounded-full px-4 py-1 text-black my-2'>
            <BsFillPersonFill />
          <h2 className='text-black'>Loading...</h2>
          </div>
          }
          <h1 className='text-2xl uppercase'>Upgrade to premium</h1>
        </div>

        <h1 className='text-4xl text-[--upgrade] pb-5 flex flex-col items-center font-medium'>
          <mark className='bg-transparent text-xl text-gray-500 line-through'>$99.99</mark>$49.99
        </h1>

        {features.map((feature) => (
          <motion.div initial="initial" whileInView="animate" viewport={{once: true,}} key={feature.id} custom={feature.id} variants={fadeInAnimationVariants} className='flex justify-between items-center gap-1 w-full p-2 rounded-md border border-[#1C1C1D]'>
            <div className='flex items-center'>
              <div className='bg-[#F7C910]/10 text-[--upgrade] p-2 rounded-lg'>
                {feature.icon}
              </div>
              <h1 className='px-2 font-medium'>{feature.name}</h1>
            </div>
            
            <BsFillCheckCircleFill className='text-[--upgrade]'/>
          </motion.div>
        ))}
        <motion.button className='upgrade mt-5'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{ delay: 0.5 }}
        >
          UPGRADE
        </motion.button>

        <div className='flex items-center gap-1 border border-[--border] px-2 rounded-lg mt-6'>
          <p className='text-sm'>Secured by</p>
          <FaStripe size={35}/>
        </div>
      </motion.div>
    </div>
  )
}
