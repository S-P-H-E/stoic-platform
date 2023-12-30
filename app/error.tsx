'use client';

import { ButtonShad } from '@/components/ui/buttonshad'
import Image from 'next/image';
import Link from 'next/link';
import StoicLogo from '@/public/stoicWhite.webp'
export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div className='flex flex-col h-screen items-center justify-center gap-3'>
      <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
      <h2 className="text-7xl font-medium leading-[3rem]">Error!</h2>
      <h3 className="text-2xl 2xl:text-3xl font-medium">
        Something went wrong.
      </h3>
      <p>{error.message}</p>
      <Link href="/">
        <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
      </Link>
    </div>
  );
}
