"use client"

import { ButtonShad } from '@/components/ui/buttonshad'
import Image from 'next/image'
import Link from 'next/link'
import StoicLogo from '@/public/stoicWhite.webp'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import PageLoader from '@/components/PageLoader'
import {useState, useEffect} from 'react'
import { BiLoader } from 'react-icons/bi';
import {useRouter} from 'next/navigation'

// ! REDIRECT TO OWN USER ID PAGE IF PREMIUM IF NOT DISPLAY 404

const UserComponent = () => {
  
  const router = useRouter()

  const { userStatus, userId, userName } = UserDataFetcher();
  const [timedout, setTimedout] = useState(false);
  if(userStatus == 'premium' || userStatus == 'admin') {
    router.push(`user/${userId}`)
  }
  useEffect(() => {
      const timeoutId = setTimeout(() => {
        setTimedout(true);
     }, 5500);
      return () => clearTimeout(timeoutId);
  }, []);
  
   if(userId) {
     return(
    <div className='h-screen flex flex-col justify-center items-center text-2xl'>
      <h3>Loading...</h3>
      <div className='text-lg flex gap-2 items-center justify-center text-highlight'>
      <p>Loading {userName ? userName : 'User'}</p>
        <BiLoader className="animate-spin" />
      </div>
    </div>
  )
  } else if (!userId && timedout) {
    return (   
      <div className='flex flex-col min-h-screen items-center justify-center gap-3'>
        <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
        <h3 className='text-2xl font-medium'>No user found</h3>
        <Link href="/">
        <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
        </Link>
      </div>
    );
  } else {
    return (
      <PageLoader/>
    );
  }

}
 
export default UserComponent;