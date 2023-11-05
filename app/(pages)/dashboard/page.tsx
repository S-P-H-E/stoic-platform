"use client"

import Continue from "@/components/Dashboard/Continue";
import Navbar from "@/components/Navbar";
import DateTime from "@/components/Dashboard/Date";
import Tools from "@/components/Dashboard/Tools";
import AllCourses from "@/components/Dashboard/AllCourses";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { AiFillLock } from 'react-icons/ai';
import { BiLoader } from "react-icons/bi";
import Locked from "@/components/Locked";

export default function Dashboard() {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (userStatus === 'user') {
    return (
      <div className="relative flex flex-col h-full w-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center max-w-[1700px] mx-auto">
        <Locked/>

        <Navbar />
        <div className="md:flex-row flex-col flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[40rem] md:w-[37%] gap-4">
            <Continue />
            <DateTime />
          </div>
          <div className="flex flex-col w-full md:w-6/12 gap-4 justify-center">
            <Tools />
            <AllCourses />
          </div>
        </div>
      </div>
    );
  } else if (userStatus !== undefined && userStatus !== null) {
    return (
      <div className="relative flex flex-col h-full w-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center max-w-[1700px] mx-auto">
        <Navbar />
        <div className="md:flex-row flex-col flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[40rem] md:w-[37%] gap-4">
            <Continue />
            <DateTime />
          </div>
          <div className="flex flex-col w-full md:w-6/12 gap-4 justify-center">
            <Tools />
            <AllCourses />
          </div>
        </div>

        {/* HAVE THIS ALL WRAPPED UP IN A COMPONENT */}
      </div>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}

