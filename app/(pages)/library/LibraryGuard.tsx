'use client';
import CreateButton from '@/components/Library/CreateButton';
import Resources from '@/components/Library/Resources';
import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import { BiLoader } from 'react-icons/bi';
import LibraryComponent from './Library';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function LibraryGuard() {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  if (allowedToFetch) {
    return <LibraryComponent userStatus={userStatus} userId={userId} isPremium={allowedToFetch}/>;
  } else if (userStatus) {
    return (
      <>
        <Locked />
        <LibraryComponent userStatus={userStatus} userId={userId} isPremium={allowedToFetch}/>
      </>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader />;
  }
}
