'use client';

import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import EditCourseComponent from './EditCourse';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from '@/components/Unauthorized';

export default function EditCoursePageGuard({courseId}: {courseId: string}) {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const allowedToEnter = userStatus === 'admin'

  if (allowedToEnter) {
    return <EditCourseComponent courseId={courseId} isAdmin={allowedToEnter} isPremium={allowedToFetch} userId={userId} userStatus={userStatus}/>
  } else if (allowedToFetch) {
    return <Unauthorized/>
  } else if (userStatus) {
    return <Unauthorized locked/>
  } else {
    return <PageLoader />;
  }
}