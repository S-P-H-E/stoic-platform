import React from 'react'
import Counter from './Counter'

interface StatCardProps {
  quantity: number | undefined,
  subheading: string,
  formatCompact?: boolean
}

export default function StatCard({quantity, subheading, formatCompact}: StatCardProps) {
  return (
    <div className="w-full border border-border bg-darkgray rounded-lg p-8 justify-center flex flex-col">
      <h1 className="text-5xl font-bold">{quantity ? formatCompact ? <Counter value={quantity} compact/> : <Counter value={quantity}/> : 'Loading...'}</h1>
      <h3 className="text-lg font-medium">{subheading}</h3>
    </div>
  )
}
