"use client"
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserProfile from './UserProfile';

export default function UserImagePassable({ userImage, userName, userStatus, userBannerUrl }: { userBannerUrl: string, userImage: string, userName: string, userStatus:string }) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-full h-full'>
        <Avatar className="w-full h-full">
          <AvatarImage src={userImage ?? undefined} />
          {/* Display the first letter of the userName */}
          <AvatarFallback className='uppercase select-none text-base w-full h-full'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-[--background] border-[--border]' side='right' >
        <UserProfile userBannerUrl={userBannerUrl} userStatus={userStatus ?? undefined} userName={userName} src={userImage ?? undefined}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}