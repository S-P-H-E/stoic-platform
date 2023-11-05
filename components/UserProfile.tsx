"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import Image from 'next/image';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { BiFilm, BiLogoInstagram, BiVideo } from 'react-icons/bi';
import UserProfileDialog from './UserProfileDialog';

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
    <div className='flex flex-col w-[450px] gap-4 p-1'>
      <div className='flex flex-col gap-4 w-full items-start'>
        <div className='h-[140px] w-full relative rounded aspect-auto'>
          {userBannerUrl ? 
            <Image src={userBannerUrl} fill alt='image' className='object-cover rounded-2xl w-[500px]'/>
          : 
            <div className='w-full h-full bg-orange-500 rounded'></div>
          }
        </div>
        <Dialog>
          <DialogTrigger>
            <div className="absolute top-[6rem] left-4 group border-[9px] border-[black] rounded-full">
              <Avatar className="w-[6rem] h-[6rem] bg-black">
                <AvatarImage src={src ?? undefined} />
                {/* Display the first letter of the userName */}
                <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-950/70 opacity-0 scale-[1.3] duration-200 group-hover:opacity-100 group-hover:scale-100 transition">
                  <span className="text-xs flex">VIEW PROFILE</span>
                </div>
              </Avatar>
              <div className={clsx('z-50 w-fit h-fit bg-[black] absolute top-[70px] right-0 rounded-full border-4 border-[black]', statusClass)}>
                <HiMiniCheckBadge size={30}/>
              </div>
            </div>
          </DialogTrigger>
        <DialogContent>
          <UserProfileDialog userBannerUrl={userBannerUrl} userStatus={userStatusEdited ?? undefined} userName={userName} src={src}/>
        </DialogContent>
      </Dialog>
      <div className='p-4 px-7 mt-8 flex flex-col w-full h-full rounded-lg gap-2'>
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl leading-6 font-semibold">{userName ? userName : 'Loading...'}</h1>
            <h2 className={clsx("text-md leading-6 py-1", statusClass)}>{userStatusEdited}</h2>
          </div>

          <hr className='border-[--border]'/>

          <div className='flex flex-col'>
            <h1 className='text-lg font-medium'>INFO</h1>
            <div className='flex justify-between pb-5 pt-2'>
              <div className='bg-white text-black w-fit p-1 px-3 rounded-full flex items-center gap-2 text-[13px] font-semibold'>
                <BiFilm size={15}/>
                After Effects
              </div>
              <div className='bg-white text-black w-fit p-1 px-3 rounded-full flex items-center gap-2 text-[13px] font-semibold'>
                <BiLogoInstagram size={15}/>
                Instagram
              </div>
              <div className='bg-white text-black w-fit p-1 px-3 rounded-full flex items-center gap-2 text-[13px] font-semibold'>
                <BiVideo size={15}/>
                Short Form
              </div>
            </div>

            <div className='border border-[#2C2C2C] bg-[#0f0f0f] rounded-xl p-3 gap-3 flex flex-col'>
              <h1>ROLES</h1>
              <div className='flex flex-wrap gap-3'>
                <div className='flex bg-[#dcb000] w-fit px-3 py-1 rounded-md gap-1 items-center'>
                  <HiMiniCheckBadge />
                  <h1>Admin</h1>
                </div>
                <div className='flex bg-[#ca0000] w-fit px-3 py-1 rounded-md gap-1 items-center'>
                  <HiMiniCheckBadge />
                  <h1>Professor</h1>
                </div>
                <div className='flex bg-[#1d00cc] w-fit px-3 py-1 rounded-md gap-1 items-center'>
                  <HiMiniCheckBadge />
                  <h1>After Effects Course</h1>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  )
}
