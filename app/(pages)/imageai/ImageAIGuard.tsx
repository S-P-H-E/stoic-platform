'use client';

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import ImageAIComponent from "./ImageAI";
import PageLoader from "@/components/PageLoader";
import { isUserAllowedToFetch } from '@/utils/utils'

export default function ImageAIGuard() {
  const { userStatus } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  
  if (allowedToFetch) {
    return(
      <ImageAIComponent/>
    )
  } else if (userStatus) {
    return(
      <>
        <Locked/>
        <ImageAIComponent/>
      </>
    )
  }
  else {
    return <PageLoader/>;
  }
}