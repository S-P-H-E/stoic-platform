"use client"

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BiLoader } from "react-icons/bi";

export default function Converters() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'free') {
    return (
      <>
      <Locked/>
      <div className='h-screen flex flex-col gap-10 p-8 md:px-16'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
      </div>
      </>
    )
  } else if (userStatus !== undefined && userStatus !== null) {
    return (
      <div className='h-screen flex flex-col gap-10 p-8 md:px-16'>
        <h1 className='text-3xl font-semibold'>Converters - wip</h1>
      </div>
    );
  }
  else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}
