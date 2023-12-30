"use client"
import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { useRouter } from "next/navigation";
import CommunityComponent from "./Community";
import PageLoader from "@/components/PageLoader";


export default function CommunityGuard() {

  const router = useRouter()

  const { userStatus} = UserDataFetcher()

  if (userStatus == 'user') {
    return (
      <>
        <Locked/>
        <CommunityComponent/>
      </>
    )
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    router.push('community/3lAzKHqOktOkzO4O4Nan')
    return(
      <CommunityComponent/>
    )
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <PageLoader/>;
  }
}
