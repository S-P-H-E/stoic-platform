"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import Image from 'next/image';
import { IoMdCheckmarkCircle } from 'react-icons/io';

export default function UserProfile({src, userName, userStatus, userBannerUrl}: {src: string, userName: string, userStatus: string, userBannerUrl: string}) {
  const userChar: string = userName ? userName : '';
  const [userStatusEdited, setUserStatusEdited] = useState('Loading...')

  useEffect(() => {
    if (userStatus === 'free') {
      setUserStatusEdited('Free')
    } else if (userStatus === 'user') {
      setUserStatusEdited('Premium')
    } else if (userStatus === 'admin') {
      setUserStatusEdited('Admin')
    } else {
      setUserStatusEdited('')
    }
  }, [userStatus])

  const statusClass = clsx({
    'text-yellow-500': userStatus === 'admin',
    'text-orange-500': userStatus === 'user',
    'text-gray-500': userStatus === 'free'
  });
    
  return (
    <div className='flex flex-col w-64 gap-4'>
      <div className='flex flex-col gap-4 w-full items-start'>
        <div className='h-28 w-full relative rounded'>
          {userBannerUrl ? 
            <Image src={userBannerUrl} fill alt='image' className='object-cover rounded'/>
          : 
            <div className='w-full h-full bg-orange-500 rounded'></div>
          }
        </div>
        <Dialog>
          <DialogTrigger>
            <div className="absolute top-[30%] left-2 group border-[6px] border-[--darkgray] rounded-full">
              <Avatar className="w-[4.7rem] h-[4.7rem]">
                <AvatarImage src={src ?? undefined} />
                {/* Display the first letter of the userName */}
                <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-950/70 opacity-0 scale-[1.3] duration-200 group-hover:opacity-100 group-hover:scale-100 transition">
                  <span className="text-xs flex">View Profile</span>
                </div>
              </Avatar>
              <div className={clsx('z-50 w-6 h-6 bg-[--darkgray] absolute bottom-0 right-0 rounded-full border-4 border-[--darkgray]', statusClass)}>
                <IoMdCheckmarkCircle/>
              </div>
            </div>
          </DialogTrigger>
        <DialogContent>
        </DialogContent>
      </Dialog>
      <div className='p-4 w-full h-full rounded-lg'>
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl leading-6">{userName ? userName : 'Loading...'}</h1>
            <h2 className={clsx("text-lg leading-6", statusClass)}>{userStatusEdited}</h2>
          </div>
      </div>
    </div>
  </div>
  )
}
