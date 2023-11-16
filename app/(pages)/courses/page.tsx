"use client"

import CreateCourse from '@/components/Course/Create/page';
import Courses from './../../../components/Course/Courses';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Locked from '@/components/Locked';
import { BiLoader } from 'react-icons/bi';

export default function CoursesPage() {
  const { userStatus } = UserDataFetcher();

    if (userStatus == 'user') {
      return (
        <div className='h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full'>
          {userStatus == 'user' && (
            <Locked/>
          )}
          <div className='flex flex-col gap-4 md:gap-8 w-full'>
          <h1 className='text-3xl font-semibold'>Courses</h1>
          <CreateCourse className='md:hidden'/>
          <Courses/>
          </div>
          <CreateCourse className='md:block hidden'/>
        </div>
      )
    } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
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
    } else {
      // Handle the case when userStatus is still loading or unavailable.
      return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
    }
}
