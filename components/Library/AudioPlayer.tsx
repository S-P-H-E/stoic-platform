"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
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
  }, [audioPlaying]);

  const handleTogglePlay = async () => {
    if (audioRef.current) {
      if (!audioLoaded) {
        setIsLoading(true);
        try {
          await audioRef.current.load();
          audioRef.current.src = audioSrc;

          setAudioLoaded(true);
        } catch (error) {
          console.error('Error loading audio:', error);
          setIsLoading(false);
        }
      }

      if (isPlaying) {
        audioPlaying(false, audioRef);
        onPauseAudio();
        audioRef.current.pause()
      } else {
        audioPlaying(true, audioRef);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="w-16 h-16 shadow-lg">
      <audio ref={audioRef}></audio>
      <button
        onClick={handleTogglePlay}
        className="flex w-16 h-16 p-2 text-black items-center justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200"
      >
        {isLoading ? (
          <MoonLoader size={30} loading={isLoading} />
        ) : !isPlayingParent || !isPlaying  ? (
          <FaPlay size={28} />
        ) : (
          <FaPause size={28} />
        )}
      </button>
    </div>
  );
};

export default CustomAudioPlayer;
