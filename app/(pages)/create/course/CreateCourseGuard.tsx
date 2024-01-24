'use client';

import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import CreateCourseComponent from './CreateCourse';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from '@/components/Unauthorized';

export default function CreateCourseGuard({courseId, imageSrc, type, title, final, description}: {courseId: string | undefined, imageSrc: string | undefined, type: "public" | "locked", title: string | undefined, description: string | undefined, final: boolean | undefined}) {
  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const allowedToEnter = userStatus === 'admin'

  if (allowedToEnter) {
    return <CreateCourseComponent courseId={courseId} final={final} title={title} description={description} type={type} imageSrc={imageSrc} isAdmin={allowedToEnter} isPremium={allowedToFetch} userId={userId} userStatus={userStatus}/>
  } else if (allowedToFetch) {
    return <Unauthorized/>
  } else if (userStatus) {
    return <Unauthorized locked/>
  } else {
    return <PageLoader />;
  }
}