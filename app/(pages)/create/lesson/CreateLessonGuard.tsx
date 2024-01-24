'use client';

import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import CreateLessonComponent from './CreateLesson';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from '@/components/Unauthorized';

export default function CreateLessonGuard({end, courseId, type, title, final, description}: {end:boolean | undefined, courseId: string | undefined, type: string | undefined, title: string | undefined, description: string | undefined, final: boolean | undefined}) {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const allowedToEnter = userStatus === 'admin'

  if (allowedToEnter) {
    return <CreateLessonComponent end={end} final={final} title={title} description={description} type={type} courseId={courseId} isAdmin={allowedToEnter} isPremium={allowedToFetch} userId={userId} userStatus={userStatus}/>
  } else if (allowedToFetch) {
    return <Unauthorized/>
  } else if (userStatus) {
    return <Unauthorized locked/>
  } else {
    return <PageLoader />;
  }
}