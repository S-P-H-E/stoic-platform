import { ButtonShad } from '@/components/ui/buttonshad'
import Image from 'next/image'
import Link from 'next/link'
import StoicLogo from '@/public/stoicWhite.webp'
 
export default function NotFound() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center gap-3'>
      <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
      <h2 className='text-7xl font-medium leading-[3rem]'>404</h2>
      <h3 className='text-2xl font-medium'>Page not found</h3>
      <Link href="/">
        <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
      </Link>
    </div>
  )
}