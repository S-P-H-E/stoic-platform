import React, { ReactNode } from 'react'

export default function InputError({ children }: { children: string }) {
  return (
    <div className="my-1 flex">
        <p className='text-xs text-red-500'>
            {children}
        </p>
    </div>
  )
}
