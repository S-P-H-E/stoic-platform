"use client"

import Converters from "@/components/Converters";
import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BiLoader } from "react-icons/bi";

export default function ConvertersPage() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'user') {
    return (
      <div className='h-full flex md:p-10 md:px-16 p-6 justify-between items-start w-full'>
        <Locked/>
        <div className='flex flex-col gap-4 md:gap-8 w-full'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
        <Converters/>
        </div>
      </div>
    )
  } else if (userStatus !== undefined && userStatus !== null && userStatus !== 'user') {
    return (
      <div className='h-full flex md:p-10 md:px-16 p-6 justify-between items-start w-full'>
        <div className='flex flex-col gap-4 md:gap-8 w-full'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
        <Converters/>
        </div>
      </div>
    );
  }
  else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}
