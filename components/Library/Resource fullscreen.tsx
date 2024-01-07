import Image from 'next/image';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';

interface Resource {
  id: string;
  name: string;
  image: string;
  downloadLink: string;
  tags: string[];
}
interface ResourceProps {
  resource: Resource
  onDelete: (tag: string) => void;
  userStatus: string | undefined;
}

export default function Resource({resource , onDelete, userStatus}: ResourceProps) {

  return (
    <>
    {resource ? (
    <ContextMenu>
      <ContextMenuTrigger>
      <div className='group relative flex flex-col gap-4 w-full h-[25.7rem] items-center text-center border border-[--border] hover:border-white/80 rounded-xl transition duration-200 overflow-hidden'>
        <div className="relative w-full group-hover:scale-110 transition duration-200"> {/* w-full if fulscreen needed */}

          <div className="absolute top-44 left-0 w-full h-20 bg-gradient-to-b from-transparent via-transparent to-[--bg]"/>
          {resource.image ? 
          <Image loading='lazy' alt='image' src={resource.image} width={400} height={200} className='w-full h-[15.4rem] object-cover rounded-b-lg' />
          : 
          <div className='w-full h-[15.4rem] bg-[--border] animate-pulse rounded-b-lg'/>
          } {/* w-full if fulscreen needed */}
          </div>
          
        <div className="px-4 py-2 gap-4 flex flex-col relative z-10">
          <h1 className="text-3xl font-medium">{resource.name}</h1>
          <ul className='flex gap-2 justify-center'>
            {resource.tags.map((tag, index) => (
              <li className="bg-[--border] px-4 py-2 rounded-lg text-xs hover:bg-white/30 transition duration-200" key={index}>{tag}</li>
            ))}
          </ul>
          
          <Link href={resource.downloadLink || ''} target="_blank" className="flex group w-[30.2rem] items-center justify-center px-4 py-2 bg-white text-black rounded-t-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200">
            <HiDownload className="group-hover:-rotate-90 duration-200 transition"/>
            <p>Download</p>
          </Link>

          <div className='w-64 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 mt-4 blur-[110px] transition duration-500'/>
        </div>
      </div>
      </ContextMenuTrigger>
      {userStatus === 'admin' && (
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onDelete(resource.id)} className="cursor-pointer">
            <button>Delete</button>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
    ) : (
      <div className="h-[27rem] w-full animate-pulse bg-[--border]"/>
    )}
    </>
  )
}
