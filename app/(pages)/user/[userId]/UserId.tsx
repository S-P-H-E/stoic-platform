'use client'

import UserIdHeader from '@/components/UserId/Header';
import AboutMe from '@/components/UserId/AboutMe';
import Activities from '@/components/UserId/Activities';
import Locked from '@/components/Locked';
import StoicLogo from '@/public/stoicWhite.webp'
import Socials from '@/components/UserId/Socials';
import Unauthorized from '@/components/Unauthorized';
import {User} from "@/types/types";
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {UserDataFetcherById} from "@/utils/userDataFetcherById";
import {useEffect, useState} from "react";
import PageLoader from "@/components/PageLoader";
import Image from "next/image";
import Link from "next/link";
import {ButtonShad} from "@/components/ui/buttonshad";

interface GlobalUser {
    id: string | null;
    status: string | undefined;
    name: string | null
    stripeId: string | undefined;
    onboarding: boolean
}

const UserIdComponent = ({userId}: {userId: string}) => {
    const { userOnboarding: userOnboardingGlobal, userId: userIdGlobal, userStatus: userStatusGlobal, userStripeId: userStripeIdGlobal, userName: userNameGlobal } = UserDataFetcher();
    const { userSocial, userOnboarding, userDescription, userStripeId, userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userStatus, userProfileImageUrl, userProfileBannerUrl } = UserDataFetcherById(userId);

    const [loading, setLoading] = useState(true);
    const [timedOut, setTimedOut] = useState(false);

    const [globalUser, setGlobalUser] = useState<GlobalUser>()
    const [user, setUser] = useState<User>()

    const userNotFound = userName == undefined && userName == null

    useEffect(() => {
        if (!userNotFound) {
            setLoading(false);
        }
    }, [userNotFound]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (userNotFound) {
                setTimedOut(true);
            }
        }, 6000);

        return () => clearTimeout(timeoutId);
    }, [userNotFound]);


    useEffect(() => {
        if (userStatusGlobal !== 'user') {
            const user: User = {
                stripeId: userStripeId,
                roles: userRoles,
                generalLastCourse,
                email: userEmail,
                generalLastLesson,
                name: userName,
                social: userSocial,
                status: userStatus,
                description: userDescription,
                profileImageUrl: userProfileImageUrl,
                profileBannerUrl: userProfileBannerUrl,
                onboarding: userOnboarding,
            };

            const globalUser: GlobalUser = {
                id: userIdGlobal,
                name: userNameGlobal,
                status: userStatusGlobal,
                stripeId: userStripeIdGlobal,
                onboarding: userOnboardingGlobal
            }

            setGlobalUser(globalUser)
            setUser(user)
        }
    }, [generalLastCourse, generalLastLesson, userDescription, userEmail, userIdGlobal, userName,
        userNameGlobal, userProfileBannerUrl, userProfileImageUrl, userRoles, userStatus, userStatusGlobal,
        userStripeId, userStripeIdGlobal, userSocial, userOnboardingGlobal, userOnboarding
    ])

    const isAuthorized = userId === globalUser?.id || globalUser?.status === 'admin' && user?.status !== 'admin';
    if (loading && !timedOut) {
        return <PageLoader/>
    } else if (timedOut) {
        return (
            <div className='flex flex-col min-h-screen items-center justify-center gap-3'>
                <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
                <h3 className='text-2xl font-medium'>No user found</h3>
                <Link href="/">
                    <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
                </Link>
            </div>
        );
    } else if (user && globalUser && globalUser.status !== 'user') {
        return (
            <main className='h-full flex flex-col gap-4 w-full'>
                <UserIdHeader isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                <div className='w-full xl:w-[80%] lg:w-[85%] max-w-7xl max-h-7xl px-6 mx-auto flex flex-col lg:flex-row gap-4 pb-8'>{/*  PADDING CHECK! !! ! ! */}
                    <Activities isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                    <div className="gap-4 flex flex-col w-1/2 max-w-[20rem]">
                        <AboutMe isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                        <Socials isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                    </div>
                </div>
            </main>
        );
    } else {
        return <Unauthorized locked={globalUser?.status === 'user'}/>
    }
}
 
export default UserIdComponent;


{/* <div className='h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full'>
    <div className='flex flex-col gap-4 w-full'>
        <h1>{userId}</h1>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
        {globalUser.id == userId &&
        <Link href={`${userId}/settings`}><ButtonShad>Settings</ButtonShad></Link>
        }
    </div>
</div> */}