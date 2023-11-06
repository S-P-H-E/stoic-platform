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
          <section className="md:p-10 md:px-16 p-8 flex flex-col gap-4 md:gap-8 w-full">
          <div className="flex justify-between">
            <h1 className='text-3xl font-semibold'>Library - ui revamp soon</h1>
            <CreateButton/>
          </div>
          <div>  
            <Resources/>
          </div>
        </section>
      </>
      )} else if (userStatus !== undefined && userStatus !== null) {
        return (
          <section className="md:py-10 md:px-16 p-8 flex flex-col gap-4 md:gap-8 w-full">
            <div className="flex justify-between">
              <h1 className='text-3xl font-semibold'>Library - ui revamp soon</h1>
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
