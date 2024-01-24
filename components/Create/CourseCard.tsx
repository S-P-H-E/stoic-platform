import { Course } from '@/types/types'
import React from 'react'
import Image from 'next/image'
import WavePattern from '@/public/wave.webp';
import Link from 'next/link'
import { FaEye } from 'react-icons/fa';
import { ButtonShad } from '../ui/buttonshad';
import { FaPen } from 'react-icons/fa6';

export default function CourseCard({course, creationMode}: {creationMode?:boolean; course: Course}) {
  return (
    <Link href={creationMode ? `/create/lesson?courseId=${course.id}` : `/create/${course.id}`}>
      <div className="rounded-xl w-full h-72 bg-gradient-to-r border border-border hover:border-highlight from-gray-700 via-gray-900 to-black group relative transition duration-500 overflow-hidden hover:shadow-[0_0px_65px_rgba(49,_76,_80,_0.55)]">
        <div className="flex gap-8 w-full h-full p-6 z-20">
            {course.image &&
              <Image alt="Course cover image" quality={97} fill className="md:hidden block opacity-20 w-20 rounded-lg z-20 object-cover group-hover:contrast-[.9] group-hover:scale-110 transition duration-500" src={course.image}/>
            }
          <div className="w-[45%] hidden md:flex min-w-[16rem] overflow-hidden h-[99%] relative rounded-lg z-20">
            {course.image &&
              <Image alt="Course cover image" quality={97} fill className="rounded-lg z-20 object-cover group-hover:contrast-[.9] group-hover:scale-110 transition duration-500" src={course.image}/>
            }

            <div className="w-full h-full rounded-lg bg-border animate-pulse"/>
            <div className='absolute inset-0 w-full h-full bg-gradient-to-l rounded-lg from-black via-transparent to-transparent z-30 group-hover:opacity-0 transition duration-500'/>
          </div>

          <div className="flex flex-col gap-2 z-20 w-full md:w-[52%] h-full justify-center p-4">
            <h1 className="text-3xl 2xl:text-4xl font-medium">{course.name ? course.name : 'Loading...'}</h1>
            <p className="opacity-70 md:opacity-100 md:text-highlight whitespace-pre-wrap line-clamp-5">{course.description ? course.description : 'Loading...'}</p>
          
            <p className="opacity-70 md:opacity-100 md:text-highlight">{course.lessons && course.lessons?.length && `${course.lessons.length} lessons`}</p>
            

          <div className="flex gap-3">
              <Link href={`/courses/${course.id}`} className="z-30 xl:hidden block">
                <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition">
                  <FaEye/>
                  Watch
                </ButtonShad>
              </Link>

              <Link href={`/create/${course.id}/edit`} className="z-30 xl:hidden block">
                <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition">
                  <FaPen/>
                  Edit
                </ButtonShad>
              </Link>
            </div>

          </div>
          <Link href={`/courses/${course.id}`} className="z-30 xl:block hidden">
            <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition">
              <FaEye/>
              Watch
            </ButtonShad>
          </Link>

          <Link href={`/create/${course.id}/edit`} className="z-30 xl:block hidden">
            <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition mr-4">
              <FaPen/>
              Edit
            </ButtonShad>
          </Link>
        </div>
        
        <div className='absolute inset-0 w-full h-full bg-gradient-to-l from-gray-800 via-black to-teal-950/20 z-10 group-hover:opacity-0 group-hover:brightness-125 transition duration-700'/>
        <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-teal-950 via-gray-950/80 to-transparent z-10 opacity-0 group-hover:opacity-100 group-hover:brightness-125 transition duration-700'/>

        <Image className="object-cover rounded-xl brightness-50 transition duration-500 group-hover:scale-[1.065]" alt="test" src={WavePattern} placeholder="blur" fill/>
      </div>
    </Link>
  )
}
