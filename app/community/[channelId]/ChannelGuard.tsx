'use client'

import Locked from '@/components/Locked';
import React from 'react';
import ChannelComponent from './Channel';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';

export default function ChannelGuard({channelId}: {channelId: string}) {
  const { userStatus } = UserDataFetcher();

  // Check if userStatus is 'user' and userStatus is loaded before rendering.
  if (userStatus === 'user') {
    return (
      <>
        <Locked />
        <ChannelComponent channelId={channelId} />
      </>
    );
  } else if (
    userStatus == 'premium' ||
    (userStatus == 'admin' && userStatus !== null)
  ) {
    return <ChannelComponent channelId={channelId} />;
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
