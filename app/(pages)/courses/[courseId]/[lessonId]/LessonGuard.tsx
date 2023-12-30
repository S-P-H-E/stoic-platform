'use client'

import Locked from '@/components/Locked';
import React from 'react';
import LessonComponent from './Lesson';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';

export default function LessonGuard() {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (userStatus === 'user') {
    return (
      <>
        <Locked />
        <LessonComponent />
      </>
    );
  } else if (
    userStatus == 'premium' ||
    (userStatus == 'admin' && userStatus !== null)
  ) {
    return <LessonComponent />;
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
