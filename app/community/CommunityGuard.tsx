"use client"
import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { useRouter } from "next/navigation";
import CommunityComponent from "./Community";
import PageLoader from "@/components/PageLoader";
import { isUserAllowedToFetch } from '@/utils/utils'


export default function CommunityGuard() {

  const router = useRouter()

  const { userStatus } = UserDataFetcher()

  const allowedToFetch = isUserAllowedToFetch(userStatus)

  if (allowedToFetch) {
    router.push('community/3lAzKHqOktOkzO4O4Nan') // change in future
    return(
      <CommunityComponent/>
    )
  } else if (userStatus) {
    return (
      <>
        <Locked/>
        <CommunityComponent/>
      </>
    )
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader/>;
  }
}
