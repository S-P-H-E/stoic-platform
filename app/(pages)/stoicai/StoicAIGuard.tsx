'use client';

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import StoicAIComponent from "./StoicAI";
import PageLoader from "@/components/PageLoader";

export default function StoicAIGuard() {
  const { userStatus } = UserDataFetcher();
  
  if (userStatus == 'user') {
    return(
      <div className="flex flex-col gap-4 w-full">
        <Locked/>
        <StoicAIComponent/>
      </div>
    )
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    return(
      <div className="flex flex-col gap-4 w-full">
        <StoicAIComponent/>
      </div>
    )
  }
  else {
    return <PageLoader/>;
  }
}