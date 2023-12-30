import React from 'react'
import CreateCourse from '@/components/Course/Create/page';
import Courses from '@/components/Course/Courses';


export default function CoursesComponent() {
  return (
    <div className='h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full'>
    <div className='flex flex-col gap-4 w-full'>
      <h1 className='text-3xl font-semibold'>Courses</h1>
      <CreateCourse className="md:hidden"/>
      <Courses/>
    </div>
    <CreateCourse className='md:block hidden'/>
  </div>
  )
}
