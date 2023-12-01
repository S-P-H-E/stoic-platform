import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserProfile from './UserProfile';

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export default function UserImagePassable({ roles, userId, userRoles, userImage, userName, userStatus, userBannerUrl }: { roles:Role[], userId: string | null, userBannerUrl: string, userImage: string, userName: string, userStatus:string, userRoles: Role[] | "User"}) {

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-full h-full aspect-square'>
        <Avatar className="w-full h-full">
          <AvatarImage src={userImage ?? undefined} />
          {/* Display the first letter of the userName */}
          <AvatarFallback className='uppercase select-none text-base w-full h-full'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-[--background] border-[--border]' side='right' >
        <UserProfile userId={userId} roles={roles} userRoles={userRoles} userBannerUrl={userBannerUrl} userStatus={userStatus ?? undefined} userName={userName} src={userImage ?? undefined}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}