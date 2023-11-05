import React from 'react'
import DashboardCourses from './DashboardCourses'

export default function AllCourses() {
  return (
    <div className='flex flex-col p-4 bg-[--darkgray] items-center gap-4 hover:border-[#585757] border border-[--border] h-full  transition duration-200 rounded-xl relative'>
        <h1 className="text-2xl font-medium">Courses</h1>
        <div className="flex flex-col w-full relative h-full">
{/*           <div className="absolute z-50 left-0 h-full items-center justify-center flex">
            <BsChevronLeft className="hover:scale-150 duration-300 cursor-pointer transition"/>
          </div> */}
          {/* <div className="absolute top-0 left-0 w-1/12 h-full bg-gradient-to-l from-transparent via-[#161515] to-[#161515] z-20"/> */}
          {/* <Courses className="justify-center"/> */}
            <DashboardCourses/>
          {/* <div className="absolute top-0 left-[92%] w-1/12 h-full bg-gradient-to-r from-transparent via-[#161515] to-[#161515] z-20"/> */}
{/*           <div className="absolute z-50 left-[96.6%] h-full items-center justify-center flex">
            <BsChevronRight className="hover:scale-150 duration-300 cursor-pointer transition"/>
          </div> */}
        </div>
    </div>
  )
}
