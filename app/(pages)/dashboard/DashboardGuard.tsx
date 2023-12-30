'use client'

import Locked from '@/components/Locked';
import React from 'react';
import DashboardComponent from './Dashboard';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';

export default function DashboardGuard() {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (userStatus === 'user') {
    return (
      <>
        <Locked />
        <DashboardComponent />
      </>
    );
  } else if (
    userStatus == 'premium' ||
    (userStatus == 'admin' && userStatus !== null)
  ) {
    return <DashboardComponent />;
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
