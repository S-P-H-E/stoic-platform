'use client'

import React from 'react'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import CoursesComponent from './Courses';
import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';
import {isUserAllowedToFetch} from '@/utils/utils'

export default function CoursesGuard() {
    const { userStatus, userId } = UserDataFetcher();

    const allowedToFetch = isUserAllowedToFetch(userStatus)
    
    if (allowedToFetch) {
      return (
        <CoursesComponent userStatus={userStatus} userId={userId} isPremium={allowedToFetch}/>
      )
    } else if (userStatus) {
      return (
        <>
          <Locked/>
          <CoursesComponent userStatus={userStatus} userId={userId} isPremium={allowedToFetch}/>
        </>
      )
    } else {
      // Handle the case when userStatus is still loading or unavailable.
      return <PageLoader/>
    }
}
