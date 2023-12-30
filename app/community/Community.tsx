import React from 'react'
import { BiLoader } from 'react-icons/bi';

export default function CommunityComponent() {

  const randomMessages = [
    "Preparing your experience...",
    "Connecting you to the community...",
    "Elevating your presence in the community...",
    "Syncing with the STOIC members...",
    "Forging connections...",
    "Preparing your experience...",
    "Connecting with like-minded individuals..."
  ];

  return (
    <div className='h-screen flex flex-col justify-center items-center text-2xl'>
    <h3>Loading...</h3>
    <div className='text-lg flex gap-2 items-center justify-center text-[--highlight]'>
    <p>{randomMessages[Math.floor(Math.random() * randomMessages.length)]}</p>
      <BiLoader className="animate-spin" />
    </div>
  </div>
  )
}
