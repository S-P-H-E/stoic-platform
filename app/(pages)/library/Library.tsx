"use client"

import CreateButton from '@/components/Library/CreateButton'
import Resources from '@/components/Library/Resources'

export default function LibraryComponent() {
  return (
    <section className="lg:py-10 lg:px-16 p-6 flex flex-col gap-4 w-full">
      <div className="flex justify-between">
        <h1 className='text-3xl font-semibold'>Library</h1>
        <CreateButton/>
      </div>
      <Resources/>
    </section>
  )
}
