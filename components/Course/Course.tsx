
import Image from 'next/image'
import Link from 'next/link'

export default function Course({ href, name, description, image}: { name: string, description: string, href: string, image:string}) {
  
  return (
    <Link href={href} passHref className='pb-6 group relative flex flex-col w-80 items-center text-center border border-[--border] rounded-xl hover:scale-105 transition duration-200 overflow-hidden'>
      <div className="relative group-hover:scale-110 transition duration-200">
        <div className="absolute top-24 left-0 w-full h-40 bg-gradient-to-b from-transparent via-[--bg] to-[--bg]"></div>
        <Image loading='lazy' alt='image' src={image} width={400} height={200} className='w-full rounded-none' />
      </div>
      <div className="px-4 pb-4 gap-2 flex flex-col relative z-10">
        <h1 className="text-3xl font-medium">{name}</h1>
        <h2 className='font-light'>{description}</h2>
      </div>
    </Link>
  )
}