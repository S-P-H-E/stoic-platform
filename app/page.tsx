"use client"

import Login from '@/components/Login'
import { useRouter } from 'next/navigation'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Skeleton from '@/components/Skeleton';
import { BiLoader } from 'react-icons/bi';

export default function Home() {
  const router = useRouter()
  const { user, fetching } = UserDataFetcher();

  if (fetching ) {
    return (
      <main className='h-screen flex justify-center items-center text-2xl'>
        {/* <Skeleton/> */}
      </main>
    );
  }

  if (!user) {
    return (
      <main className='h-screen flex justify-center items-center'>
        <Login />
      </main>
    )
  } else {
    router.push('/dashboard')
    return (
      <div className='h-screen flex flex-col justify-center items-center text-2xl'>
        <h3>You are logged in</h3>
        <div className='text-lg flex gap-2 items-center justify-center text-[--highlight]'>
          <p>Returning to dashboard</p>
          <BiLoader className="animate-spin" />
        </div>
      </div>
  )}

}
