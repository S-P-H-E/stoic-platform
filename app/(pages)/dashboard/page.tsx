"use client"

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebase';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);


  return (
    <div className='h-screen flex flex-col ml-[16rem] m-4'>
      <div>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
      </div>
      <div className="flex flex-col">
        <p>Welcome,</p>{user?.displayName}
        <p>Your email address:{user?.email}</p>
      </div>
    </div>
  )
}
