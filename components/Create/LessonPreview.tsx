import React from 'react'
import StoicLogo from '@/public/stoicWhite.webp'
import Image from 'next/image'
import { ButtonShad } from '../ui/buttonshad'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { sanitizeString } from '@/utils/utils'

export default function LessonPreview({description, type, title, courseId}: {courseId: string, description: string | undefined; type: string, title: string}) {
  return (
    <div className='border border-border bg-darkgray h-64 w-full md:w-[33rem] gap-8 flex rounded-lg p-8'>
      <div className="relative flex items-center justify-center h-full rounded aspect-square border border-border bg-white ">
        <Image alt="Stoic Logo" width={400} height={450} src={StoicLogo} className="object-cover w-[65%] invert" placeholder="blur"/>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{title}</h1>
          {description &&
            <p>{description}</p>
          }
        </div>
        <Link className="w-full" href={`/create/${courseId}/${sanitizeString (title)}`}>
          <ButtonShad variant="secondary" className='w-full font-semibold text-black active:scale-90 transition items-center gap-2'><Eye/>View in Create</ButtonShad>
        </Link>
        <Link className="w-full" href={`/courses/${courseId}/${sanitizeString (title)}`}>
          <ButtonShad variant="secondary" className='w-full font-semibold text-black active:scale-90 transition items-center gap-2'><Eye/>Watch</ButtonShad>
        </Link>
      </div>
    </div>
  )
}
