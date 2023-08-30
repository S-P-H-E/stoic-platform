"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import Input from './Input'
import Button from './Button'
import {BiLogOut} from 'react-icons/bi'
import { UserDataFetcher } from '@/utils/userDataFetcher'
import { signOut} from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { db } from '@/utils/firebase'
import { doc, updateDoc } from 'firebase/firestore';
import { message } from 'antd';
import Link from 'next/link'

export default function AccountSettings() {
  const { userName, user, loading, userId } = UserDataFetcher();
  const router = useRouter()

  const [displayName, setDisplayName] = useState("")

  const handleUpdateDisplayName = async () => {
    if (userId && displayName.trim() !== '') {
      try {
        await updateDoc(doc(db, 'users', userId), { name: displayName });
        message.success("Display name changed successfully!");
        setDisplayName('');
      } catch (error) {
        message.error("Something went wrong when changing display name");
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full w-fullsm:flex-none">
    <h1 className="font-bold sm:text-2xl md:text-3xl 2xl:text-4xl">Account Setings</h1>
      <div>
        <button onClick={() => router.back()} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
        <BsChevronLeft/>
            <h3 className="text-lg">Go back</h3>
        </button>
      </div>
      <div className="border-[--border] border rounded-lg">
        <div className="w-full h-2/6 px-8 md:px-12 py-2">
          <div className='2xl:py-8 md:py-4 py-4 px-0 flex items-center justify-between gap-4'>
            <div className="flex items-center gap-4">
              <div className='rounded-full bg-white 2xl:w-32 2xl:h-32 md:h-28 md:w-28 h-20 w-20'>

              </div>
                <div>
                  <h1 className="2xl:text-4xl lg:text-3xl md:text-2xl font-bold">{userName ? userName : 'loading...'}</h1>
                  <h2 className='text-light text-[--highlight] 2xl:text-lg lg:text-base text-sm'>{user ? user?.email : "loading..."}</h2>
                </div>
              </div>

              <div className="gap-2 lg:flex flex-col lg:w-[25%] md:w-40 h-32 items-center justify-center hidden">
              <Button onClick={() => signOut(auth)} className='bg-red-600 hover:bg-red-500 lg:font-semibold 2xl:text-lg md:text-base gap-3 !ring-red-500/50'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
          <hr className='border-[--border]'/>
          <div className='flex flex-col md:mt-6 mt-6 2xl:mt-16 md:text-2xl 2xl:text-3xl font-semibold gap-2'>
            <div className="2xl:mb-8 mb-4 gap-2 flex flex-col">
              <h1>Display Name</h1>
              <div className="flex-col flex md:flex-row gap-3">
                <Input value={displayName} onChange={(event: any) => setDisplayName(event.target.value)} className="font-normal text-lg" type='text' placeholder={userName ? userName : 'loading...'}/>
                <Button onClick={handleUpdateDisplayName} className='lg:font-semibold 2x:text-lg md:text-base gap-3 md:max-w-[25%]'>
                  Update
                </Button>
              </div>
            </div>

            <div className="2xl:mb-8 mb-4 gap-2 flex flex-col">
              <h1>Email</h1>
              <p className='text-[--highlight] lg:text-xl'>{user ? user?.email : "loading..."}</p>
            </div>

            <div className="2xl:mb-8 lg:mb-4 mb-0 gap-2 flex flex-col w-64 2xl:h-32">
              <h1>Password</h1>
              <Link
                href="/change-password"
                className="text-sm rounded-lg transition-all bg-slate-700/10 hover:bg-slate-700/20 p-1 hover:p-[7px] no-underline shadow-md"
              >
              <Button className='font-normal text-base lg:text-lg'>Change Password</Button>
              </Link>
            </div>

            <div className="md:w-40 items-center justify-center lg:hidden mt-6 mb-3">
              <Button onClick={() => signOut(auth)} className='bg-red-600 hover:bg-red-500 font-normal 2x:text-lg md:text-base !ring-red-500/50'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
