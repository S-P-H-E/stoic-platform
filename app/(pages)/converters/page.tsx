"use client"

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import Image from "next/image";
import { BiLoader } from "react-icons/bi";
import bgCover from '@/public/backgroundCover.jpg'
import Converters from "@/components/Converter/Converters";

export default function ConvertersPage() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'user') {
    return (
      <div className='h-full flex flex-col gap-16 justify-between items-start w-full'>
        <Locked/>
        <div className="relative flex w-full h-96">
          <Image alt="Background Cover" src={bgCover} fill className="object-cover"/>
          <div className="absolute h-64 w-full bottom-0 bg-gradient-to-b from-transparent via-transparent to-[--bg]"/>
          <h1 className="absolute -bottom-4 px-8 text-5xl md:text-7xl font-medium">Converters</h1>
        </div>
        <div className='flex flex-col gap-4 md:gap-8 w-full p-8'>
          <Converters/>
        </div>
      </div>
    )
  } else if (userStatus !== undefined && userStatus !== null && userStatus !== 'user') {
    return (
      <div className='h-full flex flex-col md:gap-16 gap-8 justify-between items-start w-full'>
        <div className="relative flex w-full h-96">
          <Image alt="Background Cover" src={bgCover} fill className="object-cover" placeholder="blur"/>
          <div className="absolute h-64 w-full bottom-0 bg-gradient-to-b from-transparent via-transparent to-[--bg]"/>
          <h1 className="absolute -bottom-4 px-8 text-5xl md:text-7xl font-medium">Converters</h1>
        </div>
        <div className='flex flex-col gap-4 md:gap-8 w-full p-8'>
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
