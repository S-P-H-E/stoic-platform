import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

export default function Course({ href, name, description, image, locked }: { locked: boolean, name: string, description: string, href: string, image: string }) {

/*   const getBase64Client = async () => {
    const response = await fetch('/api/getBase64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: image,
      }),
    });
ponse.ok) {
      throw new Error('Failed to create portal');
    }
    if (!res

    const data = await response.json();
    return data;
  };

  console.log(blurDataUrl) */

  return (
    <Link href={!locked ? href : ''} passHref className={clsx('bg-darkgray pb-6 relative flex flex-col w-full h-[27rem] items-center text-center border border-border rounded-xl transition duration-200 overflow-hidden', locked ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 group')}>
      <div className="relative group-hover:scale-110 transition duration-200 rounded-xl">
        <div className="absolute top-28 left-0 w-full h-44 bg-gradient-to-b from-transparent via-darkgray to-darkgray rounded-xl"/>
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