'use client'

import Locked from '@/components/Locked';
import UserIdComponent from './UserId';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { useState, useEffect } from 'react';
import { UserDataFetcherById } from '@/utils/userDataFetcherById';
import Image from 'next/image'
import Link from 'next/link'
import StoicLogo from '@/public/stoicWhite.webp'
import { ButtonShad } from '@/components/ui/buttonshad'
import { User } from './../../../../types/types';

interface GlobalUser {
  id: string | null;
  status: string | undefined;
}

export default function UserIdGuard({userId}: {userId: string}) {

  const { userId: userIdGlobal, userStatus: userStatusGlobal } = UserDataFetcher();

  const { userDescription, userStripeId, userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userStatus, userProfileImageUrl, userProfileBannerUrl } = UserDataFetcherById(userId);

  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

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

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (loading && !timedOut) {
    return <PageLoader/>
  }

  const user: User = {
    stripeId: userStripeId,
    roles: userRoles,
    generalLastCourse,
    email: userEmail,
    generalLastLesson,
    name: userName,
    status: userStatus,
    description: userDescription,
    profileImageUrl: userProfileImageUrl,
    profileBannerUrl: userProfileBannerUrl,
  };

  const globalUser: GlobalUser = {
    id: userIdGlobal,
    status: userStatusGlobal
  }

  if (timedOut) {
    return (
      <div className='flex flex-col min-h-screen items-center justify-center gap-3'>
        <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
        <h3 className='text-2xl font-medium'>No user found</h3>
        <Link href="/">
        <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
        </Link>
      </div>
    );
  }

  if (userStatusGlobal === 'user') {
    return (
      <>
        <Locked />
        <UserIdComponent globalUser={globalUser} user={user} userId={userId} />
      </>
    );
  } else if (
    userId && userStatusGlobal == 'premium' ||
    (userStatusGlobal == 'admin' && userStatusGlobal !== null)
  ) {
    return <UserIdComponent globalUser={globalUser} user={user} userId={userId} />;
  }

  else {
    // Handle the case when userStatusGlobal is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
