import React from 'react'
import Converter from './Converter/Converter'

export default function Converters() {
  return (
    <div className="flex sm:flex-row flex-col gap-6 sm:items-start items-center w-full">
      <Converter/>
    </div>
  )
}
