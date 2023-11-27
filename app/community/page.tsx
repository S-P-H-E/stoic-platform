"use client"
import Locked from "@/components/Locked";
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";


export default function Community() {

  const router = useRouter()

  const { userStatus} = UserDataFetcher()

  const randomMessages = [
    "Preparing your experience...",
    "Connecting you to the community...",
    "Elevating your presence in the community...",
    "Syncing with the STOIC members...",
    "Forging connections...",
    "Preparing your experience...",
    "Connecting with like-minded individuals..."
  ];
  

  if (userStatus == 'user') {
    return (
      <div className='h-screen flex flex-col justify-center items-center text-2xl'>
        <Locked/>
        <h3>Loading...</h3>
        <div className='text-lg flex gap-2 items-center justify-center text-[--highlight]'>
        <p>{randomMessages[Math.floor(Math.random() * randomMessages.length)]}</p>
          <BiLoader className="animate-spin" />
        </div>
      </div>
    )
  } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
    router.push('community/3lAzKHqOktOkzO4O4Nan')
    return(
      <div className='h-screen flex flex-col justify-center items-center text-2xl'>
        <h3>Loading...</h3>
        <div className='text-lg flex gap-2 items-center justify-center text-[--highlight]'>
        <p>{randomMessages[Math.floor(Math.random() * randomMessages.length)]}</p>
          <BiLoader className="animate-spin" />
        </div>
      </div>
    )
  } else {
    // Handle the case when userStatus is still loading or unavailable.
    return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
  }
}
