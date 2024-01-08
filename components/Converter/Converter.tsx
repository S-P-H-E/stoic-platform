import React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface ConverterProps {
  title: string,
  color: string,
  icon: React.ReactNode,
  href: string,
  description: string,
  disabled: boolean
}

export default function Converter({title, color, icon, href, description, disabled}: ConverterProps) {
  return (
    <Link href={href} className={clsx('rounded-xl flex-col w-full p-4 bg-[--darkgray] hover:bg-[--border] hover:scale-110 active:scale-100 border border-[--border] transition duration-200', disabled ? 'grayscale cursor-not-allowed hover:bg-[--darkgray] hover:scale-100' : null)}>
      <div className={clsx("w-full h-32 rounded-xl flex justify-center items-center", color)}>
        {icon}
      </div>
      <div className="pt-2 flex-col gap-2">
        <h1 className="text-xl font-medium">{title}</h1>
        <p className="text-sm text-[--highlight]">{description}</p>
      </div>
    </Link>
  )
}
