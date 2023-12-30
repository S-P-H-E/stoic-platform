'use client';
import CreateButton from '@/components/Library/CreateButton';
import Resources from '@/components/Library/Resources';
import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import { BiLoader } from 'react-icons/bi';
import LibraryComponent from './Library';

export default function LibraryGuard() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'user') {
    return (
      <>
        <Locked />
        <LibraryComponent />
      </>
    );
  } else if (
    userStatus == 'premium' ||
    (userStatus == 'admin' && userStatus !== null)
  ) {
    return <LibraryComponent />;
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader />;
  }
}
