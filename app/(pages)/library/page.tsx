"use client"
import GoBack from '@/components/GoBack'
import CreateButton from '@/components/Library/CreateButton'
import Resources from '@/components/Library/Resources'
import React from 'react'

export default function Library() {
  return (
    <section className="sm:p-10 p-8 flex flex-col gap-2">
      <div className="flex justify-between">
      <GoBack/>
      <CreateButton/>
      </div>
    <div>  
      <Resources/>
    </div>
    </section>
  )
}
