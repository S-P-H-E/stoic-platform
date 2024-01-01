'use client';

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import ImageAIComponent from "./ImageAI";
import PageLoader from "@/components/PageLoader";

export default function ImageAIGuard() {
  const { userStatus } = UserDataFetcher();
  
  if (userStatus == 'user') {
    return(
      <>
        <Locked/>
        <ImageAIComponent/>
      </>
    )
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    return(
      <ImageAIComponent/>
    )
  }
  else {
    return <PageLoader/>;
  }
}