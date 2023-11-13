"use client"
import CreateButton from '@/components/Library/CreateButton'
import Resources from '@/components/Library/Resources'
import Locked from '@/components/Locked';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react'
import { BiLoader } from 'react-icons/bi';

export default function Library() {
  const { userStatus } = UserDataFetcher();
    if(userStatus == 'user') {
      return (
        <>
        <Locked/>
        <section className="md:py-10 md:px-16 p-6 flex flex-col gap-4 w-full">
            <div className="flex justify-between">
              <h1 className='text-3xl font-semibold'>Library</h1>
              <CreateButton/>
            </div>
            <div>  
              <Resources/>
            </div>
        </section>
      </>
      )} else if (userStatus !== undefined && userStatus !== null && userStatus !== 'user') {
        return (
          <section className="md:py-10 md:px-16 p-6 flex flex-col gap-4 w-full">
            <div className="flex justify-between">
              <h1 className='text-3xl font-semibold'>Library</h1>
              <CreateButton/>
            </div>
            <div>  
              <Resources/>
            </div>
          </section>
        )
    } else {
      // Handle the case when userStatus is still loading or unavailable.
      return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
    }
}
