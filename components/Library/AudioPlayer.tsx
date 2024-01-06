"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FaPause, FaPlay, FaForward, FaBackward } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';

interface CustomAudioPlayerProps {
  audioSrc: string;
  audioPlaying: (isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>) => void;
  isPlaying: boolean
  isPlayingParent: boolean
  onPauseAudio: () => void;
}

const CustomAudioPlayer = ({ onPauseAudio, isPlayingParent, audioSrc, audioPlaying, isPlaying }: CustomAudioPlayerProps) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleAudioEnded = () => {
      audioPlaying(false, audioRef);
    };

    let currentAudioRef = audioRef.current;

    if (currentAudioRef) {
      currentAudioRef.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioPlaying, isLoading]);

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (!audioLoaded) {
        setIsLoading(true);
  
        const handleCanPlayThrough = () => {
          if( audioRef.current) {
            setIsLoading(false);
            audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          }
        };
  
        audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
  
        audioRef.current.src = audioSrc;
        audioRef.current.load();
        setAudioLoaded(true);
      }
  
      if (isPlaying) {
        audioPlaying(false, audioRef);
        onPauseAudio();
        audioRef.current.pause();
      } else {
        audioPlaying(true, audioRef);
        audioRef.current.play();
      }
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      audioRef.current.currentTime = currentTime + seconds;
    }
  };
  
  return (
    <div className="w-full h-full shadow-lg flex gap-x-4 items-center justify-center">
      <button
        onClick={() => handleSkip(-5)}
        className="p-2 text-black bg-white/80 hover:bg-white rounded-xl font-medium transition duration-200"
      >
        <FaBackward />
      </button>
      <audio ref={audioRef}></audio>
      <button
        onClick={handleTogglePlay}
        className="flex w-16 h-16 p-2 text-black items-center justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200"
      >
        {isLoading ? (
          <MoonLoader size={30} loading={isLoading} />
        ) : !isPlayingParent || !isPlaying ? (
          <FaPlay size={28} />
        ) : (
          <FaPause size={28} />
        )}
      </button>
      <button
        onClick={() => handleSkip(5)}
        className="p-2 text-black bg-white/80 hover:bg-white rounded-xl font-medium transition duration-200"
      >
        <FaForward />
      </button>
    </div>
  );
};

export default CustomAudioPlayer;
