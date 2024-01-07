"use client"

import React from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

export default function VideoPlayer({
  videoUrl,
  videoName,
}: {
  videoUrl: string;
  videoName: string;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const renderToastContent = (videoName: string, videoUrl: string) => {
    const controls = [
      'play-large', // The large play button in the center
      'play', // Play/pause playback button
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'mute', // Toggle for mute/unmute
      'volume', // Volume control
      'fullscreen', // Toggle for fullscreen mode
    ];

    return (
      <div className="flex flex-col gap-4 p-4 items-center w-full justify-between relative">
        <h1 className="text-sm font-medium">{`Playing Video: ${videoName}`}</h1>
        <div className="w-full h-full overflow-hidden rounded-lg">
        <Plyr
        source={{
          type: 'video',
          sources: [
            {
              src: videoUrl,
              type: 'video/mp4',
            },
          ],
        }}
        options={{
          controls: [
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings',
            'fullscreen',
          ],
        }}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </div>
      </div>
    );
  };

  return (
    <div className="w-96 h-full shadow-lg flex gap-x-4 items-center justify-center">
      <Dialog>
        <DialogTrigger>
          <button className="flex w-16 h-16 p-2 text-black items-center justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200">
            {isLoading ? (
              <MoonLoader size={30} loading={isLoading} />
            ) : (
              <FaPlay size={28} />
            )}
          </button>
        </DialogTrigger>
        <DialogContent>{renderToastContent(videoName, videoUrl)}</DialogContent>
      </Dialog>
    </div>
  );
}
