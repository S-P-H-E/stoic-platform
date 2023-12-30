'use client'

import React from 'react'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import CoursesComponent from './Courses';
import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';

export default function CoursesGuard() {
    const { userStatus } = UserDataFetcher();

    if (userStatus == 'user') {
      return (
        <>
          <Locked/>
          <CoursesComponent/>
        </>
      )
    } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
      return (
        <CoursesComponent/>
      )
    } else {
      // Handle the case when userStatus is still loading or unavailable.
      return <PageLoader/>
    }
}
