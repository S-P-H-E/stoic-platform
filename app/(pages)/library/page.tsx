import GoBack from '@/components/GoBack'
import CreateButton from '@/components/Library/CreateButton'
import Resources from '@/components/Library/Resources'
import React from 'react'

export default function Library() {
  return (
    <section className="p-8">
      <div className="flex justify-between">
      <GoBack/>
      <CreateButton/>
      </div>
    <div className="p-8">  
      <Resources/>
    </div>
    </section>
  )
}
