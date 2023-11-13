"use client"

import Locked from "@/components/Locked";
import AccountSettings from "@/components/Settings/AccountSettings"
import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BiLoader } from "react-icons/bi";

export default function Settings() {
    const { userStatus } = UserDataFetcher();

    if (userStatus == "user") {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <Locked/>
          <AccountSettings />
        </div>
      );
    } else if (userStatus !== undefined && userStatus !== null && userStatus !== 'user') {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <AccountSettings />
        </div>
      );
    }  else {
      // Handle the case when userStatus is still loading or unavailable.
      return <div className="h-screen flex items-center justify-center"><BiLoader size={72} className="animate-spin"/></div>;
    }
  }