'use client';

import Locked from "@/components/Locked";
import StoicAI from "@/components/StoicAI/StoicAI";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BiLoader } from "react-icons/bi";

export default function Chat() {
  const { userStatus } = UserDataFetcher();
  
  if (userStatus == 'user') {
    return(
      <>
        <Locked/>
        <StoicAI/>
      </>
    )
  } else if (userStatus !== undefined && userStatus !== null) {
    return(
      <StoicAI/>
    )
  }
  else {
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}