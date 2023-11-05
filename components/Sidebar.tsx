'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

import {BrainCircuit,LayoutDashboard,GraduationCap,Book,Settings,Video} from 'lucide-react';
import UserImage from './UserImage';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { BiLogOut } from 'react-icons/bi';
import { useFirebase } from '@/utils/authContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserProfile from './UserProfile';

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-white',
  },
  {
    label: 'Courses',
    icon: GraduationCap,
    href: '/courses',
    color: 'text-white',
  },
  {
    label: 'Library',
    icon: Book,
    href: '/library',
    color: 'text-white',
  },
  {
    label: 'Stoic AI',
    icon: BrainCircuit,
    href: '/stoicai',
    color: 'text-white',
  },
  {
    label: 'Converters',
    icon: Video,
    href: '/converters',
    color: 'text-white',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

const Sidebar = () => {
  const { userName, userId, userStatus, userProfileImageUrl, userProfileBannerUrl } = UserDataFetcher();
  const pathname = usePathname();
  const { signOut } = useFirebase()
  
  return (
    <div className="flex h-full z-50">
    <div className="top-0 left-0 h-full md:border-r border-[--border] p-4 w-full md:w-72 md:fixed bg-[--bg] text-white">
      <div className="px-3 py-2 flex flex-col h-full">
        <Link href="/dashboard" className="w-fit flex items-center pl-3 mb-14">
          <div className="relative w-8 h-11 mr-4">
            <Image fill alt="Logo" src="/stoicWhite.png" />
          </div>
          <h1
            className={clsx(
              'mt-1 text-2xl font-bold tracking-widest',
              montserrat.className
            )}
          >
            STOIC
          </h1>
        </Link>
        <div className="justify-between h-full flex flex-col">
        <div className="space-y-1 ">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={clsx(
                'text-base group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={clsx('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="px-2 flex justify-between items-center">
          <div className='flex items-center gap-2'>
            <div className="h-10 w-10">
            <DropdownMenu>
              <DropdownMenuTrigger className='w-full h-full'>
                <UserImage/>
              </DropdownMenuTrigger>
                <DropdownMenuContent className='absolute -left-10 bottom-1 bg-[--darkgray] border-[--border]' side='top' >
                  <UserProfile userStatus={userStatus ?? ''} userName={userName ?? ''} src={userProfileImageUrl ?? undefined} userBannerUrl={userProfileBannerUrl}/>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
            {userId ? <p className='font-medium'>{userName}</p>:null}
          </div>
            
            <button onClick={()=> signOut()} className='hover:text-red-500 transition duration-200'>
              <BiLogOut size={24}/>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;
