import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import WavePattern from '@/public/wave.webp';
import { Lock } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
export default function CourseCard({
  href,
  name,
  description,
  image,
  locked,
}: {
  locked: boolean;
  name: string;
  description: string;
  href: string;
  image: string;
}) {
  return (
    <Link href={locked ? '' : href}>
      <div
        className={clsx(
          'rounded-xl h-[30rem] w-full border-border border hover:border-highlight relative transition duration-500 overflow-hidden',
          locked ? 'cursor-not-allowed' : 'group'
        )}
      >
        <div className="h-[55%] w-full z-20 relative overflow-hidden">
          {locked && (
            <div className="text-white z-30 flex items-center justify-center w-full h-full absolute inset-0">
              <Lock size={128}/>
            </div>
          )}
          {image ?
            <Image
              src={image}
              alt="Course cover image"
              fill
              className={clsx("object-cover group-hover:contrast-[.85] group-hover:scale-110 transition duration-500", locked && 'grayscale opacity-50')}
            />
          :
            <div className="bg-border w-full h-full flex items-center justify-center">
              <BeatLoader size={40} color="#fff"/>
            </div>
          }
          {/* <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-bg z-30" /> */}
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
        <div className="flex flex-col gap-2 z-30 w-full h-[45%] items-center text-center relative justify-center">
          <div className="items-center justify-center gap-2 flex-col w-full h-full absolute inset-0 flex p-4">
            <h1 className="text-2xl font-medium">{name}</h1>
            <p className="text-highlight whitespace-pre-wrap text-sm line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 via-black to-teal-950/20 z-10 group-hover:opacity-0 group-hover:brightness-125 transition duration-700" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-teal-950 via-gray-950/60 to-transparent z-20 opacity-0 group-hover:opacity-100 group-hover:brightness-125 transition duration-700" />
        <div className="absolute bottom-0 w-full h-[55%] z-10 bg-gradient-to-b from-black via-black/30 to-transparent" />
        <div className="absolute bottom-[30%] w-full h-16 z-10 bg-black blur-[20px]" />
        <Image
          className="object-cover rounded-xl brightness-50 transition duration-500 scale-150 group-hover:brightness-100 group-hover:scale-[1.15]"
          alt="test"
          src={WavePattern}
          placeholder="blur"
          fill
        />
      </div>
    </Link>
  );
}
