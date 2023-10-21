import Link from 'next/link'
import React from 'react'
import { BsCameraVideoFill } from 'react-icons/bs'
import Tool from './Tool'
import { BiBookAlt } from 'react-icons/bi'

const tools = [
  {
      title: 'Converters',
      icon: <BsCameraVideoFill size={24} />,
      href: '/converters'
  },
  {
    title: 'Library',
    icon: <BiBookAlt size={24} />,
    href: '/converters'
  },
]

export default function Tools() {
  return (
    <div className='grid grid-cols-2 gap-3'>
        {tools.map((tool, index)=> (
          <Tool key={tool.title} title={tool.title} href={tool.href} icon={tool.icon} />
        ))}
    </div>
  )
}
