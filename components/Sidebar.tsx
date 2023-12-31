'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

import {
  BrainCircuit,
  LayoutDashboard,
  GraduationCap,
  Book,
  Settings,
  ImagePlus,
  Video,
  Users,
} from 'lucide-react';
import UserImage from './UserImage';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { BiLogOut } from 'react-icons/bi';
import { useFirebase } from '@/utils/authContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import UserProfile from './UserProfile';
import StoicLogo from '@/public/stoicWhite.webp';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

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
    label: 'Community',
    icon: Users,
    href: '/community',
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
    label: 'Image AI',
    icon: ImagePlus,
    href: '/imageai',
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

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

const Sidebar = () => {
  const {
    userRoles,
    userName,
    userId,
    userStatus,
    userProfileImageUrl,
    userProfileBannerUrl,
    userEmail,
  } = UserDataFetcher();
  const pathname = usePathname();
  const { signOut } = useFirebase();

  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const rolesCollection = collection(db, 'roles');

    const unsubscribe = onSnapshot(rolesCollection, (snapshot) => {
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
        order: doc.data().order,
      }));
      setRoles(rolesData);
    });

    return () => unsubscribe();
  }, []);

  function getUserRoleColor(userRoles: Role[] | 'User'): string {
    if (userRoles === 'User' || userRoles.length === 0) {
      return 'white';
    }

    const leastOrderRole = userRoles.reduce(
      (minRole, currentRole) =>
        minRole.order < currentRole.order ? minRole : currentRole,
      userRoles[0]
    );

    return leastOrderRole.color;
  }

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <div className="flex h-full z-50">
      <div className="top-0 left-0 h-full md:border-r border-[--border] py-8 px-2 lg:p-4 w-full md:w-60 lg:w-72 md:fixed bg-[--bg] text-white">
        <div className="px-3 py-6 flex flex-col h-full">
          <Link href="/dashboard" className="w-fit flex items-center pl-3 mb-8">
            <div className="relative w-8 h-11 mr-4">
              <Image
                fill
                alt="Stoic Logo"
                priority
                src={StoicLogo}
                placeholder="blur"
              />
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
                    pathname.includes(route.href)
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400'
                    /*  userStatus === 'user' ? 'blur-sm' : '' */
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={clsx('h-5 w-5 mr-3', route.color)} />
                    <h2>{route.label}</h2>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full h-full">
                      <UserImage />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="absolute -left-10 bottom-1 bg-[--background] border-[--border]"
                      side="top"
                    >
                      <UserProfile
                        userId={userId}
                        roles={roles}
                        userRoles={userRoles ?? 'User'}
                        userStatus={userStatus ?? ''}
                        userName={userName ?? ''}
                        src={userProfileImageUrl ?? undefined}
                        userBannerUrl={userProfileBannerUrl}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col">
                  {userName && userId && (
                    <h1
                      className={clsx(
                        'text-lg font-medium line-clamp-1',
                        userRoles &&
                        userRoles &&
                        userRoles.length > 0 &&
                        userRoles !== "User" &&
                        `text-${getUserRoleColor(userRoles)}`
                      )}
                    >
                      {userName}
                    </h1>
                  )}
                  {userEmail && userId ? (
                    <p className="text-xs line-clamp-1 tracking-tight text-[--highlight]">
                      {truncateText(userEmail, 18)}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="hover:text-red-500 transition duration-200"
              >
                <BiLogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
