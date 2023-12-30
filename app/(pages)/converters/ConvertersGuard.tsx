"use client"

import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import ConvertersComponent from "./Converters";
import PageLoader from "@/components/PageLoader";

export default function ConvertersGuard() {
  const { userStatus } = UserDataFetcher();

  if (userStatus == 'user') {
    return (
      <>
        <Locked/>
        <ConvertersComponent/>
      </>
    )
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    return <ConvertersComponent/>
  }
  else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader/>;
  }
}
