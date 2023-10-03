import React from 'react'
import Comments from './Course/Comments'

export default function SkeletonLesson() {
  return (
    <>
    <div className='flex gap-4'>
    <div className='bg-[#252525] rounded-3xl shadow-2xl animate-pulse w-full h-[80%] aspect-video' />
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col justify-center items-center gap-5'>
        <div className='mx-5 rounded-2xl bg-[#252525] h-[80px] w-full md:w-[300px] animate-pulse'/>
        <div className='visible md:hidden'>
          <Comments courseId={""} lessonId={""}/>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center gap-5'>
      <div className='mx-5 rounded-2xl bg-gradient-to-b from-[#252525] to-transparent h-[80px] w-full md:w-[300px] animate-pulse'/>
        <div className='visible md:hidden'>
          <Comments courseId={""} lessonId={""}/>
        </div>
      </div>
    </div>
    </div>
    <div className='my-5 md:mb-20 rounded-2xl p-5'>
        <div className='h-[25px] w-[150px] bg-[#252525] rounded-lg mb-2'/>
        <div className='h-[20px] md:w-[400px] bg-[#252525] rounded-lg'></div>
      </div>
      <div className='hidden md:block'>
        <Comments courseId={""} lessonId={""}/>
      </div>
    </>
  )
}
