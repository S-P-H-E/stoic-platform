import Image from 'next/image'
import Link from 'next/link'

export default function Course({ href, name, description, image}: { name: string, description: string, href: string, image:string}) {
  return (
    <Link href={href} passHref className='group bg-[--bg] pb-6 group relative flex flex-col w-full sm:w-[22rem] h-[27rem] items-center text-center border border-[--border] rounded-xl hover:scale-105 transition duration-200 overflow-hidden'>
      <div className="relative group-hover:scale-110 transition duration-200 rounded-xl">
        <div className="absolute top-28 left-0 w-full h-44 bg-gradient-to-b from-transparent via-[--bg] to-[--bg] rounded-xl"/>
        <Image loading='lazy' alt='image' src={image} width={400} height={200} className='rounded-xl h-60 object-cover' />
      </div>
      <div className="px-4 pb-4 gap-4 flex flex-col relative z-10">
        <h1 className="xl:text-3xl md:text-2xl text-3xl font-medium">{name}</h1>
        <h2 className='font-light'>{description}</h2>
      </div>
      <div className='absolute -bottom-40 w-32 h-32 bg-white rounded-full opacity-0 group-hover:opacity-100 mt-4 blur-[120px] transition duration-500 z-20'/>
    </Link>
  )
}