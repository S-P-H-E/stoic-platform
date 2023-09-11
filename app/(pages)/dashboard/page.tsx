// Import necessary modules and components
import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import CreateCourse from "@/components/CreateCourse/page";
import Greeting from "@/components/Greeting";

import Search from "@/components/Search/page";
import UserImage from "@/components/UserImage";
import Link from "next/link";

export default function Dashboard(){

  return (
    <>

      <div className="flex flex-col justify-center items-center">
        {/* Navbar */}
        <div className="gradient-01 absolute w-full h-[100px] top-10 z-[-10]">
          
        </div>
        <div className=" px-10 pt-7 pb-3 md:p-10 flex justify-between items-center gap-6 w-full md:w-[1000px]">
          <Greeting/>
          <div className="flex justify-center items-center gap-3">
            <div className="hidden md:flex">
              <CreateCourse />
            </div>
            <Search />
            <Link href={'/settings'} className="w-[50px] h-[50px] cursor-pointer">
              <UserImage />
            </Link>
          </div>
        </div>
        {/* Courses */}
        <div className=" p-5 md:p-10 flex flex-col gap-8 w-full md:w-[1000px]">
            <div className="grid md:hidden w-full">
              <CreateCourse />
            </div>
          <Continue/>
          <CourseLogic courses={[]} />
        </div>
      </div>
    </>
  );
}
