'use client'

import Locked from '@/components/Locked';
import React from 'react';
import LessonComponent from './Lesson';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader';
import { isUserAllowedToFetch } from '@/utils/utils';

export default function LessonGuard({lessonId, courseId}: {lessonId: string, courseId: string}) {
  const { userStatus, userId } = UserDataFetcher();

  const isAllowed = isUserAllowedToFetch(userStatus)

  if (isAllowed) {
    return <LessonComponent userStatus={userStatus} userId={userId} courseId={courseId} lessonId={lessonId} />;
  }
  else if (userStatus) {
    return (
      <>
        <Locked />
        <LessonComponent userStatus={userStatus} userId={userId} courseId={courseId} lessonId={lessonId}/>
      </>
    );
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return (
      <PageLoader/>
    );
  }
}
