import React from 'react'
import UserImagePassable from '../UserImagePassable';
import clsx from 'clsx';

  interface Role {
    id: string;
    name: string;
    color: string;
    order: number;
  }

  interface Member {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
    status: string;
    bannerUrl: string;
    canMessage: boolean;
    roles: Role[] | "User";
  }
  
export default function Members({ userId, members, roles }: { userId: string | null, members: Member[], roles: Role[] }) {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
    }

  return (
      <ul className="flex flex-col gap-2 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 scrollbar-track-neutral-800">
      {members.map((member) => (
        <li 
          key={member.id}
          className="group animate-pop px-4 py-2 border border-[--border] rounded-xl flex gap-3 hover:bg-[--border] transition duration-200"
          >
            <div className="w-12 h-12 relative">
              <UserImagePassable userId={userId} roles={roles} userRoles={member.roles} userBannerUrl={member.bannerUrl} userImage={member.photoUrl} userName={member.name} userStatus={member.status}/>
              <div className='bg-green-500 w-4 h-4 right-0 bottom-0 absolute rounded-full border-[--bg] group-hover:border-[--border] border-[3px] transition duration-200'/>
            </div>
            <div className='flex flex-col justify-center break-all'>
              <h1 
              className={clsx(
                "text-lg font-medium", member.roles && member.roles.length > 0 && member.roles != "User" && member.roles[0]?.color && `text-${member.roles[0].color}`)}>
                {truncateText(member.name, 30)}
              </h1>
            </div>
          </li>
        ))}
      </ul>
  )
}
