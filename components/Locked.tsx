import React from 'react'
import { AiFillLock } from 'react-icons/ai'

export default function Locked() {
  return (
    <>
    <div className="absolute inset-0 backdrop-blur-xl w-full h-full flex items-center justify-center z-10 rounded-xl">
        <div className="bg-[--bg] opacity-80 absolute inset-0 z-10" />
        <div className="w-full h-60 text-white text-center p-4 rounded-lg z-20 flex items-center justify-center flex-col">
        <AiFillLock size={64} className="text-yellow-500" />
        <p className="text-4xl"><span className="text-yellow-500 hover:underline font-medium">Upgrade</span> to get access</p>
        <button className="upgrade bg-yellow-500 !text-black">UPGRADE</button>
        </div>
    </div>
    </>
  )
}
