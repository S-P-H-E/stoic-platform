'use client'

import Locked from '@/components/Locked';
import React from 'react';
import ChannelComponent from './Channel';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { isUserAllowedToFetch } from '@/utils/utils'

export default function ChannelGuard({channelId}: {channelId: string}) {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (allowedToFetch) {
    return <ChannelComponent userStatus={userStatus} userId={userId} channelId={channelId} />;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <ChannelComponent userStatus={userStatus} userId={userId} channelId={channelId} />
      </>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
