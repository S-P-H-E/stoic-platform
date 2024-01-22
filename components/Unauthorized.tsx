import React from 'react'
import { ButtonShad } from '@/components/ui/buttonshad';
import Link from 'next/link';
import Image from 'next/image';
import StoicLogo from '@/public/stoicWhite.webp'
import Locked from './Locked';

export default function Unauthorized({locked}: {locked?: boolean}) {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center gap-3 p-8'>
      {locked && <Locked/>}
      <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
      <h3 className='text-2xl font-medium text-center'>You do not have permission to view this content.</h3>
      <Link href="/">
      <ButtonShad className="active:scale-90 transition" variant={'outline'}>Take me back to homepage</ButtonShad>
      </Link>
    </div>
  )
}
