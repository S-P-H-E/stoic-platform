"use client"
import React from 'react'
import { FaBook, FaStripe } from 'react-icons/fa'
import { BsFillPersonFill, BsStars, BsFillCheckCircleFill, BsPeopleFill } from 'react-icons/bs'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { UserDataFetcher } from '@/utils/userDataFetcher'

export default function Upgrade() {
  const { userName } = UserDataFetcher()

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
      icon: <BsFillPersonFill size={25}/>,
      name: '1-on-1 Coaching'
    },
    {
      id: 4,
      icon: <BsPeopleFill size={25}/>,
      name: 'Community'
    },
  ]

  return (
    <div className='flex justify-center items-center h-screen'>
      <motion.div className='border border-[#1C1C1D] w-[450px] rounded-3xl p-8 flex flex-col items-center gap-2 bg-gradient-to-tl from-[white]/5'
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
            </div>
          : null}
          <h1 className='text-2xl uppercase'>Upgrade to premium</h1>
        </div>

        <h1 className='text-4xl text-[--upgrade] pb-5 flex flex-col items-center font-medium'>
          <mark className='bg-transparent text-xl text-gray-500 line-through'>$99.99</mark>$49.99
        </h1>

        {features.map((feature) => (
          <div key={feature.id} className='flex justify-between items-center gap-1 w-full p-2 rounded-md border border-[#1C1C1D] hover:bg-[#1C1C1D] transition duration-200'>
            <div className='flex items-center'>
              <div className='bg-[#F7C910]/10 text-[--upgrade] p-2 rounded-lg'>
                {feature.icon}
              </div>
              <h1 className='px-2 font-medium'>{feature.name}</h1>
            </div>
            
            <BsFillCheckCircleFill className='text-[--upgrade]'/>
          </div>
        ))}
        <button className='upgrade mt-5'>
          UPGRADE
        </button>

        <div className='flex items-center gap-1 border border-[--border] px-2 rounded-lg mt-6'>
          <p className='text-sm'>Secured by</p>
          <FaStripe size={35}/>
        </div>
      </motion.div>
    </div>
  )
}
