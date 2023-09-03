import React, { ReactNode } from 'react'
import clsx from 'clsx';

interface InputResponseProps {
  children: string;
  color?: string;
}

export default function InputResponse({ children, color }: InputResponseProps) {
  const textColorClass = color ? `text-${color}-500` : 'text-red-500';

  return (
    <div className="my-1 flex">
        <p className={clsx('text-xs', textColorClass)}>
            {children}
        </p>
    </div>
  )
}
