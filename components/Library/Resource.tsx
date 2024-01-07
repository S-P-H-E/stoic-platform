"use client"

import Image from 'next/image';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { FaFileAudio, FaFileVideo } from 'react-icons/fa';
import clsx from 'clsx';
import CustomAudioPlayer from './AudioPlayer';
import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

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
  audioName: string;
  playingAudio: (audioName: string, audioRef: React.RefObject<HTMLAudioElement>) => void,
  isPlayingParent: boolean
  onPauseAudio: () => void;
}

export default function Resource({onPauseAudio, isPlayingParent, audioName, playingAudio, resource , onDelete, userStatus}: ResourceProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(audioName === resource.name);
  }, [audioName, resource.name]);

  const audioPlaying = (isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>) => {
    setIsPlaying(isPlaying);
    playingAudio(resource.name, audioRef);
  };

  return (
    <>
    {resource ? (
    <ContextMenu>
      <ContextMenuTrigger>
      <div className={clsx('group relative flex flex-col gap-4 h-[27rem] items-center text-center border border-[--border] hover:border-white/80 rounded-xl transition  overflow-hidden', isPlaying && isPlayingParent && 'animate-pulse')}>
        <div className={clsx('relative', !resource.tags.some(tag => tag.toLowerCase() === 'audio') && 'group-hover:scale-110 transition duration-200')}>
          <div className="absolute top-44 left-0 w-full h-20 bg-gradient-to-b from-transparent via-transparent to-[--bg]"/>
          {resource.image ? (
          <Image loading='lazy' alt='image' src={resource.image} width={400} height={200} className='w-full h-[15.4rem] object-cover aspect-square rounded-b-lg' />
        ) : (
          resource.tags.some(tag => tag.toLowerCase() === 'audio') ? (
            <div className='relative h-[15.4rem] grup text-white aspect-square rounded-b-lg flex items-center justify-center'>
              <FaFileAudio className={clsx("duration-300 group-hover:opacity-50 group-hover:scale-90 group-hover:blur transition", isPlaying && isPlayingParent && 'opacity-50 blur-sm')} size={128} />
              <div className={clsx("absolute group-hover:scale-125 top-0 opacity-0 group-hover:opacity-100 scale-90 transition duration-300 w-full h-full flex items-center justify-center", isPlaying && isPlayingParent && 'scale-105 opacity-100')}>
                <CustomAudioPlayer onPauseAudio={onPauseAudio} isPlayingParent={isPlayingParent} isPlaying={isPlaying} audioPlaying={audioPlaying} audioSrc={resource.downloadLink} />
              </div>
            </div>
          ) : (
            resource.tags.some(tag => tag.toLowerCase() === 'video') ? (
              <div className='group relative h-[15.4rem] text-white aspect-square rounded-b-lg flex items-center justify-center'>
                <FaFileVideo size={128} className="duration-300 group-hover:opacity-50 group-hover:scale-90 group-hover:blur transition"/> {/* Assuming you have a video icon component */}
                <div className={clsx("absolute group-hover:scale-125 top-0 opacity-0 group-hover:opacity-100 scale-90 transition duration-300 w-full h-full flex items-center justify-center", isPlaying && isPlayingParent && 'scale-105 opacity-100')}>
                <VideoPlayer videoName={resource.name} videoUrl={resource.downloadLink} isShortForm={resource.tags.includes('Short-Form')} />
              </div>
              </div>
            ) : (
              <div className='h-[15.4rem] bg-[--border] aspect-square animate-pulse rounded-b-lg' />
            )
          )
        )}
      </div>

        <div className="px-4 py-2 gap-4 flex flex-col items-center justify-center relative z-10">
        <h1 className={clsx('font-medium line-clamp-1', resource.name.length > 28 ? 'text-xl' : resource.name.length > 14 ? 'text-2xl' : 'text-2xl')}>{resource.name}</h1>
          <ul className='flex gap-2 justify-center'>
            {resource.tags.map((tag, index) => (
              <li className="bg-[--border] px-4 py-2 rounded-lg text-xs hover:bg-white/30 transition duration-200" key={index}>{tag}</li>
            ))}
          </ul>
          
          <Link href={resource.downloadLink || ''} target="_blank" className="flex w-11/12 items-center justify-center px-4 py-2 bg-white/90 hover:bg-white text-black rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200">
            <HiDownload/>
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
