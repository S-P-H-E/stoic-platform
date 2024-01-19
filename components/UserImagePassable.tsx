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

export default function UserImagePassable({ roles, userId, userRoles, userDescription, userImage, userName, userStatus, userBannerUrl }: { userDescription: string | undefined, roles:Role[], userId: string | null, userBannerUrl: string, userImage: string, userName: string, userStatus:string, userRoles: Role[] | "User"}) {

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-full h-full">
          <AvatarImage src={userImage ?? undefined} />
          {/* Display the first letter of the userName */}
          <AvatarFallback className='uppercase select-none w-full h-full'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-darkgray ring ring-border' side='right' >
        <UserProfile userDescription={userDescription || 'No description provided'} userId={userId} roles={roles} userRoles={userRoles} userBannerUrl={userBannerUrl} userStatus={userStatus ?? undefined} userName={userName} src={userImage ?? undefined}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}