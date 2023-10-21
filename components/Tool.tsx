import Link from 'next/link'
import React from 'react'

interface ToolProps {
    title: string
    href: string
    icon: React.ReactNode
}

export default function Tool({title, href, icon}: ToolProps) {
  return (
    <>
    <Link href={href} className='border border-[--border] rounded-xl p-4 justify-center flex gap-4 items-center transition duration-200 bg-[#161515] hover:border-[#585757] hover:scale-105'>
        {icon}
        <h1 className="text-xl">{title}</h1>
    </Link>
    </>
  )
}
