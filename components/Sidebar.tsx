'use client';

import Image from 'next/image'
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { RiDashboardLine } from 'react-icons/ri';
import { BiMessageAlt } from 'react-icons/bi';
import { RiSettings3Line } from 'react-icons/ri';
import { BiBook } from 'react-icons/bi';
import { VscLibrary } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Dashboard',
    icon: RiDashboardLine,
    href: '/dashboard',
  },
  {
    label: 'Community',
    icon: BiMessageAlt,
    href: '/community',
  },
  {
    label: 'Resources',
    icon: VscLibrary,
    href: '/resources',
  },
  {
    label: 'Courses',
    icon: BiBook,
    href: '/courses',
  },
  {
    label: 'Settings',
    icon: RiSettings3Line,
    href: '/settings',
  },
];

const Sidebar = () => {
    const pathname = usePathname();

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [referralLink, setReferralLink] = useState('');
  
    useEffect(() => {
      if (!loading && !user) {
        router.push('/');
      }
    }, [loading, user]);
    
    return (
      <div className='fixed left-0 h-full min-h-screen justify-center p-1 items-center w-[15rem] bg-transparent border-[--border] border-r text-white'>
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center text-center ml-4 mb-6">
            <h1
              className={clsx('mt-1 text-3xl font-semibold tracking-widest', montserrat.className)}
            >
              S T O I C
            </h1>
          </Link>
            <div className='flex flex-col gap-1'> {/* added the gap here */}
              {routes.map((route) => (
                <Link
                  href={route.href}
                  key={route.href}
                  className={clsx(
                    'text-base sm:text-lg group flex p-3 w-full justify-start  font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                      pathname === route.href
                          ? 'text-white bg-white/10'
                          : 'text-zinc-400'
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className='h-5 w-5 mr-3' />
                    {route.label}
                  </div>
                </Link>
              ))}
          </div>

          </div>
{/*           <div className='relative top-0 w-full flex justify-center items-center gap-2 text-sm font-medium'>
            {user && user.photoURL && (
              <>
                <Image src={user.photoURL} alt="user icon" height={35} width={35} className="rounded-full w-[35px] h-fit" />
                <h1>
                  {user?.displayName}
                </h1>
              </>
            )}
          </div> */}
      </div>
    );
  };
  
  export default Sidebar;
  
