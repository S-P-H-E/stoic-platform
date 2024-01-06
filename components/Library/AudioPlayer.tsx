"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';

const CustomAudioPlayer = ({ audioSrc, audioPlaying }: { audioSrc: string; audioPlaying: (isPlaying: boolean) => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
      audioPlaying(false); // Notify parent component that audio has stopped
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
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
        audioPlaying(false); // Notify parent component that audio is paused
        audioRef.current.pause();
      } else {
        audioPlaying(true); // Notify parent component that audio is playing
        await audioRef.current.play();
      }

      setIsPlaying(!isPlaying);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-16 h-16 shadow-lg">
      <audio ref={audioRef}></audio>
      <button
        onClick={handleTogglePlay}
        className="flex w-16 h-16 p-2 text-black items-center backdrop-blur-sm justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200"
      >
        {isLoading ? (
          <MoonLoader size={30} loading={isLoading} />
        ) : !isPlaying ? (
          <FaPlay size={28} />
        ) : (
          <FaPause size={28} />
        )}
      </button>
    </div>
  );
};

export default CustomAudioPlayer;