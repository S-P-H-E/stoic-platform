"use client"

import React from 'react'
import Task from './Task'

export default function Tasks() {

  const fadeInAnimationVariants = {
    // for framer motion
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
      },
    }),
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Task/>
    </div>
  )
}
