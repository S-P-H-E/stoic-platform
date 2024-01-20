'use client'

import Locked from '@/components/Locked';
import React, { useEffect, useState } from 'react';
import DashboardComponent from './Dashboard';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { User } from '@/types/types';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function DashboardGuard() {
  const { userStatus, userName, userSocial, userProfileImageUrl, generalLastCourse, generalLastLesson } = UserDataFetcher();

  const [user, setUser] = useState<User>()
  
  const allowedToFetch = isUserAllowedToFetch(userStatus)

  useEffect(() => {
    if (allowedToFetch) {
      const user: User = {
        generalLastCourse,
        generalLastLesson,
        name: userName,
        social: userSocial,
        status: userStatus,
        profileImageUrl: userProfileImageUrl,
      };

      setUser(user)
    }
  }, [allowedToFetch, generalLastCourse, generalLastLesson, userName, userProfileImageUrl, userSocial, userStatus])


  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <DashboardComponent user={user} allowedToFetch={allowedToFetch} />;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <DashboardComponent notAllowed allowedToFetch={allowedToFetch} />
      </>
    )
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
