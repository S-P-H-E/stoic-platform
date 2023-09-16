"use client"

import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { useRouter } from 'next/navigation';

export default function GoBack() {
  const router = useRouter()

  const handleClick = () => {
    router.back()
  }

  return (
    <button onClick={handleClick} className="text-[--highlight] hover:text-stone-200 transition gap-1 flex items-center"><BsChevronLeft/>Go Back</button>
  )
}
