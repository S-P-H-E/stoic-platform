"use client"

import { UserDataFetcher } from "@/utils/userDataFetcher";

export default function Dashboard() {
  const { userName, user, loading } = UserDataFetcher();

  return (
    <div className='h-screen flex flex-col ml-[16rem] m-4'>
      <div>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
      </div>
      <div className="flex flex-col">
        <p>Welcome, {userName ? userName : 'loading...'}</p>
        <p>Your email address: {userName ? user?.email : "loading..."}</p>
      </div>
    </div>
  );
}
