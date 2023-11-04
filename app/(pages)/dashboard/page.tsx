"use client"

import Continue from "@/components/Dashboard/Continue";
import Navbar from "@/components/Navbar";
import DateTime from "@/components/Dashboard/Date";
import Tools from "@/components/Dashboard/Tools";
import AllCourses from "@/components/Dashboard/AllCourses";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { AiFillLock } from 'react-icons/ai';
import { BiLoader } from "react-icons/bi";

export default function Dashboard() {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'free' and userStatus is loaded before rendering.
  if (userStatus === 'free') {
    return (
      <div className="relative flex flex-col h-full w-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center max-w-[1700px] mx-auto">
        <div className="absolute inset-0 backdrop-blur-xl flex items-center justify-center z-10 rounded-xl">
          <div className="bg-[--bg] opacity-50 absolute inset-0 rounded-lg blur-2xl z-10" />
          <div className="w-full h-60 text-white text-center p-4 rounded-lg z-20 flex items-center justify-center flex-col">
            <AiFillLock size={64} className="text-yellow-500" />
            <p className="text-4xl"><span className="text-yellow-500 hover:underline font-medium">Upgrade</span> to get access</p>
            <button className="upgrade bg-yellow-500 !text-black">UPGRADE</button>
          </div>
        </div>

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
      </div>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}

