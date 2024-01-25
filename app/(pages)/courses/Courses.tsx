import React from 'react'
import CreateCourse from '@/components/Course/Create/page';
import Courses from '@/components/Course/Courses';


export default function CoursesComponent({isPremium, userId, userStatus}: {isPremium: boolean, userId: string | null, userStatus: string | undefined}) {
  return (
    <div className='h-full flex lg:py-10 lg:px-16 p-6 justify-between items-start w-full max-w-9xl mx-auto'>
    <div className='flex flex-col gap-4 w-full'>
      <h1 className='text-3xl font-semibold py-3'>Courses</h1>
      <CreateCourse userStatus={userStatus} className="md:hidden"/>
      <Courses userId={userId} isPremium={isPremium}/>
    </div>
    <CreateCourse userStatus={userStatus} className='md:block hidden'/>
  </div>
  )
}
