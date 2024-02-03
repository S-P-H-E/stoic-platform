"use client"

import Resources from '@/components/Library/Resources'
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";

export default function LibraryComponent() {
    const { userStatus, userId } = UserDataFetcher();

    const allowedToFetch = isUserAllowedToFetch(userStatus)

    return (
    <section className="lg:py-10 lg:px-16 p-6 flex flex-col gap-4 w-full">
      <Resources isPremium={allowedToFetch} userStatus={userStatus} userId={userId}/>
    </section>
  )
}
