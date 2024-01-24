'use client';

import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import CreateLessonIdComponent from './CreateLessonId';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from '@/components/Unauthorized';

export default function CreateLessonIdGuard({courseId, lessonId}: {courseId: string, lessonId: string}) {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const allowedToEnter = userStatus === 'admin'

  if (allowedToEnter) {
    return <CreateLessonIdComponent courseId={courseId} lessonId={lessonId} isAdmin={allowedToEnter} isPremium={allowedToFetch} userId={userId} userStatus={userStatus}/>
  } else if (allowedToFetch) {
    return <Unauthorized/>
  } else if (userStatus) {
    return <Unauthorized locked/>
  } else {
    return <PageLoader />;
  }
}