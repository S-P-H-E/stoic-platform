import { ButtonShad } from '@/components/ui/buttonshad'
import Image from 'next/image'
import Link from 'next/link'
import StoicLogo from '@/public/stoicWhite.webp'
 
export default function Upgraded() {
  return (
    <div className='flex flex-col h-screen items-center justify-center gap-3'>
      <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
      <h2 className='text-7xl font-medium leading-[4rem]'>Upgraded</h2>
      <h3 className='text-2xl font-medium'>You are a premium member!</h3>
      <Link href="/">
        <ButtonShad variant={'outline'}>Go to dashboard</ButtonShad>
      </Link>
    </div>
  )
}