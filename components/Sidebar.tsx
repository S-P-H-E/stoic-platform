'use client';

import Link from 'next/link';
import Image from 'next/image';
import {Montserrat} from 'next/font/google';
import {usePathname} from 'next/navigation';
import {clsx} from 'clsx';

import {
    BrainCircuit,
    LayoutDashboard,
    GraduationCap,
    Book,
    PencilRuler,
    ImagePlus,
    Video,
    Users,
    UserCircle, Settings,
} from 'lucide-react';
import UserImage from './UserImage';
import {UserDataFetcher} from '@/utils/userDataFetcher';
import {BiLogOut} from 'react-icons/bi';
import {useFirebase} from '@/utils/authContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import UserProfile from './UserProfile';
import StoicLogo from '@/public/stoicWhite.webp';
import {useEffect, useState} from 'react';
import {collection, onSnapshot} from 'firebase/firestore';
import {db} from '@/utils/firebase';
import {truncateText} from '@/utils/utils';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const montserrat = Montserrat({weight: '600', subsets: ['latin']});

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
        userDescription,
        userId,
        userStatus,
        userProfileImageUrl,
        userProfileBannerUrl,
        userEmail,
    } = UserDataFetcher();
    const pathname = usePathname();
    const {signOut} = useFirebase();

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
        },
        {
            label: 'Community',
            icon: Users,
            href: '/community',
            locked: true
        },
        {
            label: 'Library',
            icon: Book,
            href: '/library',
        },
        {
            label: 'Stoic AI',
            icon: BrainCircuit,
            href: '/stoicai',
            locked: true,
            extraContentSide: 'top'
        },
/*        {
            label: 'Image AI',
            icon: ImagePlus,
            href: '/_imageai',
        },*/
        {
            label: 'Converters',
            icon: Video,
            href: '/converters',
        },
        {
            label: 'User',
            icon: UserCircle,
            href: `/user/${userId}` || `/user/`,
            extraContent: 'Settings',
            extraContentIcon: Settings,
            extraContentHref: `/user/${userId}/settings`,
            extraContentSide: 'right'
        },
        /*   {
          label: 'Settings',
          icon: Settings,
          href: '/settings',
        }, */
    ];

    const [roles, setRoles] = useState<Role[]>([]);
    const [extraContentHover, setExtraContentHover] = useState(false)

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

    const handleMouseEnter = () => {
        setExtraContentHover(true)
    }

    const handleMouseLeave = () => {
        setExtraContentHover(false)
    }

    return (
        <div className="flex h-full z-50">
            <div className="top-0 left-0 h-full md:border-r border-border py-8 px-2 lg:p-4 w-full md:w-60 lg:w-72 md:fixed bg-darkgray text-white">
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
                        <p className="text-xs font-light ml-1 opacity-90">BETA</p>
                    </Link>
                    <div className="justify-between h-full flex flex-col">
                        <div className="space-y-1 ">
                            {routes.map((route) => (
                                <TooltipProvider key={route.href}>
                                    <Tooltip delayDuration={1}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={route.locked ? '' : route.href}
                                                className={clsx(
                                                    'active:scale-95 duration-200 text-base group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                                                    pathname.includes(route.href) || extraContentHover && route.extraContentHref
                                                        ? 'text-white bg-white/10'
                                                        : 'text-zinc-400',
                                                    route.locked && 'opacity-50 !cursor-not-allowed'
                                                    /*  userStatus === 'user' ? 'blur-sm' : '' */
                                                )}
                                            >
                                                <div className="flex items-center flex-1 font-medium">
                                                    <route.icon className={clsx('h-5 w-5 mr-3', route.color)}/>
                                                    <h2>{route.label}</h2>
                                                </div>
                                            </Link>
                                        </TooltipTrigger>

                                        {route.extraContent || route.locked ? (
                                            <TooltipContent
                                                onMouseLeave={!route.locked ? handleMouseLeave : undefined}
                                                onMouseEnter={!route.locked ? handleMouseEnter : undefined}
                                                className={clsx("bg-darkgray text-base hover:bg-border active:scale-95 transition duration-200", route.extraContentSide === 'right' &&  'mb-2')}
                                                side={route.extraContentSide as "right" | "top" | "bottom" | "left" | undefined}
                                            >
                                                {route.extraContent ? (
                                                    <>
                                                        {route.extraContentHref ? (
                                                            <Link href={route.extraContentHref}>
                                                                <div className="px-4 py-0.5 flex items-center gap-2">
                                                                    <route.extraContentIcon size={20}/>
                                                                    {route.extraContent}
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div>{route.extraContent}</div>
                                                        )}
                                                    </>
                                                ) : (
                                                    route.locked && <div>Coming soon...</div>
                                                )}
                                            </TooltipContent>
                                        ) : null}

                                    </Tooltip>
                                </TooltipProvider>
                            ))}

                            {userStatus === 'admin' && (
                                <Link
                                    href="/create"
                                    className={clsx(
                                        'text-base group active:scale-95 relative group flex p-3 w-full duration-300 justify-start font-medium cursor-pointer hover:text-white rounded-lg transition',
                                        pathname.includes('create')
                                            ? 'text-white shadow-[0_0px_50px_rgba(8,_112,_184,_0.3)]'
                                            : 'text-zinc-400'
                                    )}
                                >
                                    <div className="flex items-center flex-1 z-10">
                                        <PencilRuler className={clsx('h-5 w-5 mr-3')}/>
                                        <h2>Create</h2>
                                    </div>
                                    <div
                                        className={clsx("opacity-0 rounded-lg shadow-[0_0px_50px_rgba(8,_112,_184,_0.6)] duration-300 transition bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400 via-fuchsia-600 to-orange-600 absolute w-full h-full inset-0", pathname.includes('create') ? 'opacity-100 group-hover:opacity-90' : 'group-hover:opacity-80')}/>
                                </Link>
                            )}

                        </div>
                        <div className="px-2 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full h-full">
                                            <UserImage/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="absolute -left-10 bottom-1 bg-black ring ring-border"
                                            side="top"
                                        >
                                            <UserProfile
                                                black
                                                userId={userId}
                                                roles={roles}
                                                userRoles={userRoles ?? 'User'}
                                                userStatus={userStatus ?? ''}
                                                userName={userName ?? ''}
                                                userDescription={userDescription}
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
                                                userRoles !== 'User' &&
                                                `text-${getUserRoleColor(userRoles)}`
                                            )}
                                        >
                                            {truncateText(userName, 10)}
                                        </h1>
                                    )}
                                    {userEmail && userId ? (
                                        <p className="text-xs line-clamp-1 tracking-tight text-highlight">
                                            {truncateText(userEmail, 18)}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <button
                                onClick={() => signOut()}
                                className="hover:text-red-500 transition duration-200"
                            >
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
