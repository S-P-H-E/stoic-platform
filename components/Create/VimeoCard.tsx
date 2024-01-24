import React from 'react'
import StoicLogo from '@/public/stoicWhite.webp'
import Image from 'next/image'
import { FaVimeo } from 'react-icons/fa6'

export default function VimeoCard() {
  return (
    <div className="w-full h-60 relative rounded-lg overflow-hidden pattern">
      <div className="text-black absolute inset-0 h-full w-full z-10 flex gap-4 items-center justify-center">
        <Image alt="Stoic Logo" placeholder="blur" src={StoicLogo} width={200} height={250} className="invert object-cover w-20"/>

        <h1 className="text-7xl font-black">X</h1>

        <FaVimeo size={110}/>
      </div>
  
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-white/50 to-transparent"/>
    </div>
  )
}