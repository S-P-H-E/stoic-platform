"use client"

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import ConvertersComponent from "./Converters";
import PageLoader from "@/components/PageLoader";
import {isUserAllowedToFetch} from '@/utils/utils'

export default function ConvertersGuard() {
  const { userStatus } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  if (allowedToFetch) {
    return <ConvertersComponent allowedToFetch={allowedToFetch}/>
  }
  else if (userStatus) {
    return (
      <>
        <Locked/>
        <ConvertersComponent allowedToFetch={allowedToFetch}/>
      </>
    )
  }
  else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader/>;
  }
}
