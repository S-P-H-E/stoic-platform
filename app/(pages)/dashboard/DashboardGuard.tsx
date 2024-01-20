'use client'

import Locked from '@/components/Locked';
import React from 'react';
import DashboardComponent from './Dashboard';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { User } from '@/types/types';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function DashboardGuard() {
  const { userStatus, userName, userSocial, userProfileImageUrl, generalLastCourse, generalLastLesson } = UserDataFetcher();
  
  const allowedToFetch = isUserAllowedToFetch(userStatus)

  const user: User = {
    generalLastCourse,
    generalLastLesson,
    name: userName,
    social: userSocial,
    status: userStatus,
    profileImageUrl: userProfileImageUrl,
  };

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <DashboardComponent user={user} />;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <DashboardComponent notAllowed />
      </>
    )
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
