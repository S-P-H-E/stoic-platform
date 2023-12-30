'use client'

import React from 'react';
import UpgradeComponent from './Upgrade';
import Upgraded from './Upgraded'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';

export default function UpgradeGuard() {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (userStatus === 'user') {
    return <UpgradeComponent />
  } else if (
    userStatus == 'premium' ||
    (userStatus == 'admin' && userStatus !== null)
  ) {
    return <Upgraded />;
  } else {
    return (
      <PageLoader/>
    );
  }
}
