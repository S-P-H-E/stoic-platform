"use client"
import React, { useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';
import '@/components/Library/video-react.css';
import clsx from 'clsx';

export default function VideoPlayer({
  videoUrl,
  videoName,
  isShortForm
}: {
  videoUrl: string;
  videoName: string;
  isShortForm: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const renderVideoContent = (videoName: string, videoUrl: string) => {

    return (
      <div className={clsx("flex flex-col gap-4 p-4 items-center justify-between relative", isShortForm ? 'h-[90vh] 2xl:h-[80vh] max-h-[80rem]' : 'w-[80vw] lg:w-[60vw] max-w-[80rem]')}>
        <h1 className="text-sm font-medium">{`Playing Video: ${videoName}`}</h1>
        <div className="w-full my-auto overflow-y-auto rounded-lg">
          <Player
            aspectRatio={isShortForm ? "9:12" : "16:9"}
          >
            <source src={videoUrl} />
            <BigPlayButton position="center" />
            <LoadingSpinner />
          </Player>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="flex w-16 h-16 p-2 text-black items-center justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200">
          <FaPlay size={28} />
        </button>
      </DialogTrigger>
      <DialogContent className={clsx(isShortForm ? 'h-[90vh] 2xl:h-[80vh] max-h-[80rem]' : '!w-[80vw] lg:!w-[60vw] max-w-[80rem]')}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <MoonLoader size={50} loading={isLoading} />
          </div>
        ) : (
          renderVideoContent(videoName, videoUrl)
        )}
      </DialogContent>
    </Dialog>
  );
}