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
      <div className="relative flex flex-col h-full w-full md:py-8 pb-10 px-6 gap-4 overflow-hidden justify-center max-w-[1700px] mx-auto">
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
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    return (
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
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}

