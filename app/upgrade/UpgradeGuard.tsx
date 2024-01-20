'use client'

import React from 'react';
import UpgradeComponent from './Upgrade';
import Upgraded from './Upgraded'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function UpgradeGuard() {
  const { userStatus } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <Upgraded />;
  } else if (userStatus) {
    return <UpgradeComponent userStatus={userStatus} />
  } else {
    return (
      <PageLoader/>
    );
  }
}
