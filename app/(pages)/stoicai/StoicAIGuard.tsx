'use client';

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import StoicAIComponent from "./StoicAI";
import PageLoader from "@/components/PageLoader";
import { isUserAllowedToFetch } from '@/utils/utils';

export default function StoicAIGuard() {
  const { userStatus } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  if (allowedToFetch) {
    return(
      <div className="flex flex-col gap-4 w-full">
        <StoicAIComponent/>
      </div>
    )
  } else if (userStatus) {
    return(
      <div className="flex flex-col gap-4 w-full">
        <Locked/>
        <StoicAIComponent/>
      </div>
    )
  }
  else {
    return <PageLoader/>;
  }
}