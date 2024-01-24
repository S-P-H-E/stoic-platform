'use client';

import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import CreateComponent from './Create';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from '@/components/Unauthorized';

export default function CreateGuard() {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const allowedToEnter = userStatus === 'admin'

  if (allowedToEnter) {
    return <CreateComponent isAdmin={allowedToEnter} isPremium={allowedToFetch} userId={userId} userStatus={userStatus}/>
  } else if (allowedToFetch) {
    return <Unauthorized/>
  } else if (userStatus) {
    return <Unauthorized locked/>
  } else {
    return <PageLoader />;
  }
}