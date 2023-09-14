"use client"

import React from 'react'
import { FaBook } from 'react-icons/fa'

export default function Upgrade() {
  const features = [
    {
      icon: <FaBook size={25}/>,
      name: 'course'
    }
  ]
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='border border-[#1C1C1D] w-[500px] rounded-3xl p-8 flex flex-col gap-2'>
        <div className='flex justify-center items-center w-full'>
          <h1 className='text-xl'>Upgrade to Stoic</h1>
          <p className='bg-gradient-to-tr from-[#5952da] to-[#39358d] rounded-full px-4 py-1 mx-3'>PREMIUM</p>
        </div>

        <div className='flex items-center gap-1 w-full p-2 rounded-md border border-[#1C1C1D]'>
          
          <h1>Courses</h1>
        </div>
      </div>
    </div>
  )
}
