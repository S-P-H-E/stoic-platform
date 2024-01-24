import { Course, Lesson } from '@/types/types'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import WavePattern from '@/public/wave.webp';
import Link from 'next/link'
import { FaEye } from 'react-icons/fa';
import { ButtonShad } from '../ui/buttonshad';
import { Lock, Unlock, Type, Play } from 'lucide-react';
import { updateExistingLesson } from '@/utils/updateFirestore';
import {clsx} from 'clsx'

export default function LessonCardView({isAdmin, course, lesson, courseIdProp}: {courseIdProp?: string | undefined; isAdmin: boolean; lesson: Lesson; course?: Course | null}) {
  const [isLocked, setIsLocked] = useState(lesson.locked);

  const courseId = courseIdProp || course?.id || null

  useEffect(() => {
    setIsLocked(lesson.locked);
  }, [lesson.locked]);

  const handleLessonLockedChange = async () => {
    try {
      if(lesson && lesson.type && lesson.id && courseId) {
        await updateExistingLesson(
          lesson.type,  
          isAdmin,
          courseId,
          lesson.id,
          !lesson.locked,
          {
            title: lesson.title || '',
            description: lesson.description || '',
            order: lesson.order || '',
            endText: lesson.endText || '',
            content: lesson.content || ''
          }
        );
      }
      setIsLocked(!isLocked);
    } catch {
      setIsLocked(lesson.locked);
    }

  }

  return (
      <div className={clsx("rounded-xl w-full h-54 bg-gradient-to-r border border-border hover:border-highlight from-gray-700 via-gray-900 to-black group relative transition duration-500 overflow-hidden", !courseIdProp && 'hover:shadow-[0_0px_65px_rgba(49,_76,_80,_0.55)]')}>
          <div className="absolute flex gap-2 right-5 top-5 z-30">
            {lesson.order &&
              <div className="p-2 bg-darkgray border transition duration-500 border-border group-hover:bg-border group-hover:border-highlight aspect-square rounded-full">{lesson.order}</div>
            }

            <button onClick={handleLessonLockedChange} className="p-2 hover:!bg-highlight z-40 bg-darkgray border transition duration-500 border-border group-hover:bg-border group-hover:border-highlight aspect-square rounded-full">
              {isLocked ?
                <Lock/>
              :
                <Unlock/>
              }
            </button>

            <div className="p-2 bg-darkgray border transition duration-500 border-border group-hover:bg-border group-hover:border-highlight aspect-square rounded-full">
              {lesson.type == 'video' ?
                <Play/>
              :
                <Type/>
              }
            </div>
          </div>
          <Link href={`/create/${courseId}/${lesson.id}`}>
        <div className="flex gap-8 w-full h-full p-6 z-20 pt-10">
{/*           {course.image &&
            <Image alt="Course cover image" quality={97} fill className="opacity-5 w-20 rounded-lg z-20 object-cover group-hover:contrast-[.9] group-hover:scale-110 transition duration-500" src={course.image}/>
          } */}
          <div className="flex flex-col gap-2 z-20 w-full h-full justify-center p-4">
            <h1 className="text-3xl font-medium">{lesson.title ? lesson.title : 'Loading...'}</h1>
            <p className="text-highlight whitespace-pre-wrap line-clamp-2">{lesson.description ? lesson.description : 'Loading...'}</p>

            <Link href={`/courses/${courseId}/${lesson.id}`} className="z-30 block">
              <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition pr-8">
                <FaEye/>
                Watch
              </ButtonShad>
            </Link>

          </div>
        </div>
        
        <div className='absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 via-black to-teal-950/20 z-10 group-hover:opacity-0 group-hover:brightness-125 transition duration-700'/>
        <div className='absolute inset-0 w-full h-full bg-gradient-to-t from-teal-950 via-gray-950/80 to-transparent z-10 opacity-0 group-hover:opacity-100 group-hover:brightness-125 transition duration-700'/>

        <Image className="object-cover rounded-xl brightness-50 transition duration-500 scale-150 group-hover:brightness-75 group-hover:scale-[1.15]" alt="test" src={WavePattern} placeholder="blur" fill/>
        </Link>
      </div>
  )
}
