"use client"

import Login from '@/components/Auth/Login'
import { useRouter } from 'next/navigation'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { BiLoader } from 'react-icons/bi';
import PageLoader from './../components/PageLoader';
import Image from 'next/image';
import StoicPatternBG from '@/public/Stoic_Pattern_EM.webp'
import { motion } from 'framer-motion';
import NewLogin from '@/components/Auth/NewLogin';
import NewRegister from "@/components/Auth/NewRegister";

interface RootPageParams {
  searchParams: {
    mode: string;
  }
}

export default function Root({
  searchParams: { mode }
}: RootPageParams) {
  const router = useRouter()
  const { user, fetching, userStatus } = UserDataFetcher();

  if (fetching ) {
    return (
      <main className='h-screen flex justify-center items-center text-2xl'>
        <PageLoader/>
      </main>
    );
  }

  if (!user) {
    return (
      <main className='min-h-screen flex justify-center items-center'>
        <div className='z-10'>
            {mode === 'register' ?
                <NewRegister/>
            :
                <NewLogin />
            }

        </div>
        <motion.div className="pointer-events-none" initial={{opacity: 0}} whileInView={{opacity: 0.4}} transition={{type: 'tween'}}>
          <Image fill alt="Background pattern" quality={95} priority src={StoicPatternBG}/>
        </motion.div>
      </main>
    )
  } else if (userStatus && userStatus == 'user') {
    router.push('/upgrade')
  }
  else {
    router.push('/dashboard')
    return (
      <div className='h-screen flex flex-col justify-center items-center text-2xl'>
        <h3>You are logged in</h3>
        <div className='text-lg flex gap-2 items-center justify-center text-highlight'>
          <p>Returning to dashboard</p>
          <BiLoader className="animate-spin" />
        </div>
      </div>
  )}
}
