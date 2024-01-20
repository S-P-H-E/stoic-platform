'use client'

import Locked from '@/components/Locked';
import React from 'react';
import CourseComponent from './Course';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { isUserAllowedToFetch } from '@/utils/utils'

export default function CourseGuard() {
  const { user, userId, userStatus } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <CourseComponent user={user} userId={userId} userStatus={userStatus} allowedToFetch={allowedToFetch} />;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <CourseComponent user={user} userId={userId} userStatus={userStatus} allowedToFetch={allowedToFetch}  />
      </>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
