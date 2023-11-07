"use client"

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BiLoader } from "react-icons/bi";

export default function Converters() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'user') {
    return (
      <>
      <Locked/>
      <div className='h-full flex md:p-10 md:px-16 p-8 justify-between items-start w-full'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
      </div>
      </>
    )
  } else if (userStatus !== undefined && userStatus !== null && userStatus !== 'user') {
    return (
      <div className='h-full flex md:p-10 md:px-16 p-8 justify-between items-start w-full'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
      </div>
    );
  }
  else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}
