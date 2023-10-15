import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import CreateCourse from "@/components/Course/CreateCourse/page";
import { BiSolidBookAlt } from 'react-icons/bi'
import { IoMdSettings } from 'react-icons/io'
import { IoVideocam } from 'react-icons/io5'
import Link from "next/link";
import Greeting from "@/components/Greeting";
import Navbar from "@/components/Navbar";

export default function Dashboard(){

  return (
    <div className="flex flex-col h-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center">
        {/* TOP BAR HERE */}
        <Navbar/>
        <div className="flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[40rem] md:w-3/6 gap-4">
            <Continue/>
            <Continue/>
          </div>
          <div className="flex flex-col w-full md:w-2/6">
            <Continue/>
          </div>
      </div>
    </div>
  );
}
