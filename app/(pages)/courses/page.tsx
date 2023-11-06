"use client"

import CreateCourse from '@/components/Course/CreateCourse/page';
import Courses from './../../../components/Course/Courses';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Locked from '@/components/Locked';
import { BiLoader } from 'react-icons/bi';

export default function CoursesPage() {
  const { userStatus } = UserDataFetcher();

    if (userStatus == 'user') {
      return (
        <div className='h-full flex flex-col gap-4 md:p-10 md:px-16 p-8 justify-between items-start w-full'>
              <h1 className='text-3xl font-semibold'>Courses</h1>
              <CreateCourse className='md:hidden'/>
              <Courses/>
            <CreateCourse className='md:block hidden'/>
        </div>
      )
    } else if (userStatus !== undefined && userStatus !== null && userStatus !== 'free') {
      return (
        <div className='h-full flex flex-col gap-4 md:p-10 md:px-16 p-8 justify-between items-start w-full'>
              <h1 className='text-3xl font-semibold'>Courses</h1>
              <CreateCourse className='md:hidden'/>
              <Courses/>
            <CreateCourse className='md:block hidden'/>
        </div>
      )
    } else {
      // Handle the case when userStatus is still loading or unavailable.
      return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
    }
}
