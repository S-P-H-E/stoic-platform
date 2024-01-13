"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export default function UserProfile({src, userName, userStatus}: {src: string, userName: string, userStatus: string}) {
  const userChar: string = userName ? userName : '';
  const [userStatusEdited, setUserStatusEdited] = useState('Loading...')

  useEffect(() => {
    if (userStatus === 'user') {
      setUserStatusEdited('Free')
    } else if (userStatus === 'premium') {
      setUserStatusEdited('Premium')
    } else if (userStatus === 'admin') {
      setUserStatusEdited('Admin')
    } else {
      setUserStatusEdited('')
    }
  }, [userStatus])

  const statusClass = clsx({
    'text-yellow-500': userStatus === 'admin',
    'text-orange-500': userStatus === 'premium',
    'text-gray-500': userStatus === 'user'
  });
    
  return (
    <div className='flex flex-col w-64 p-4 gap-4'>
      <div className='flex gap-3 w-full items-center'>
      <Dialog>
        <DialogTrigger>
          <div className="relative group">
            <Avatar className="w-16 h-16">
              <AvatarImage src={src ?? undefined} />
              {/* Display the first letter of the userName */}
              <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-950/90 opacity-0 scale-[1.3] duration-200 group-hover:opacity-100 group-hover:scale-100 transition">
                  <span className="text-sm">View Profile</span>
                </div>
            </Avatar>
          </div>
        </DialogTrigger>
      <DialogContent>
        
      </DialogContent>
    </Dialog>
        <div className="flex flex-col">
          <h1 className="text-2xl leading-6">{userName ? userName : 'Loading...'}</h1>
          <h2 className={clsx("text-lg leading-6", statusClass)}>{userStatusEdited}</h2>
        </div>
      </div>
      <hr className="border-border"/>
    </div>
  )
}
