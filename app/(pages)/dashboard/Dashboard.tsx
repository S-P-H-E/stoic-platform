import AllCourses from '@/components/Dashboard/AllCourses';
import Continue from '@/components/Dashboard/Continue';
import DateTime from '@/components/Dashboard/Date';
import Tools from '@/components/Dashboard/Tools';
import Navbar from '@/components/Navbar';
import React from 'react';

export default function DashboardComponent() {
  return (
    <>
      <div className="relative flex flex-col h-full w-full md:py-6 px-6 pb-10 gap-4 overflow-hidden justify-center max-w-[1600px] mx-auto">
        <Navbar />
        <div className="md:flex-row flex-col flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[42.5rem] md:w-[38%] 2xl:w-[42%] gap-4">
            <Continue />
            <DateTime />
          </div>
          <div className="flex flex-col w-full md:w-7/12 2xl:w-[56%] max-w-[53rem] gap-4 justify-center">
            <Tools />
            <AllCourses />
          </div>
        </div>
      </div>
    </>
  );
}
