import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface DashboardCourseProps {
    image: string
    href: string
    name: string
    description: string
}

export default function DashboardCourse({ image, href, name, description }: DashboardCourseProps) {
  return (
    <Link href={href} className="relative flex flex-col items-center w-full group overflow-hidden text-center border border-[--border] hover:border-[#585757] transition duration-300 h-full rounded-xl">
    <div className="relative group-hover:scale-105 transition duration-500 h-full">
        <div className="absolute top-[55%] left-0 w-full h-48 group-hover:scale-105 bg-gradient-to-b from-transparent via-[--darkgray] to-[--darkgray] rounded-xl z-30"/>
        <Image loading='lazy' alt='image' src={image} width={400} height={300} className='h-full object-cover group-hover:brightness-125 group-hover:scale-110 transition duration-300' />
      </div>
    <div className='flex items-center justify-center w-full h-full text-center p-4 2xl:pb-16'>
      <h1 className="text-xl 2xl:text-2xl z-50 group-hover:scale-110 transition duration-300">{name}</h1>
    </div>
    <div className='absolute -bottom-40 w-32 h-32 bg-white rounded-full opacity-0 group-hover:opacity-100 mt-4 blur-[120px] transition duration-300 z-20'/>
    </Link>
  )
}