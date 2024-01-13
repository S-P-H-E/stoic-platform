'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPause, FaPlay, FaForward, FaBackward } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';

interface CustomAudioPlayerProps {
  audioSrc: string;
  audioPlaying: (
    isPlaying: boolean,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => void;
  isPlaying: boolean;
  isPlayingParent: boolean;
  onPauseAudio: () => void;
}

const CustomAudioPlayer = ({
  onPauseAudio,
  isPlayingParent,
  audioSrc,
  audioPlaying,
  isPlaying,
}: CustomAudioPlayerProps) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mergedPlaying = isPlayingParent && isPlaying;

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
          if (audioRef.current) {
            setIsLoading(false);
            audioRef.current.removeEventListener(
              'canplaythrough',
              handleCanPlayThrough
            );
          }
        };

        audioRef.current.addEventListener(
          'canplaythrough',
          handleCanPlayThrough
        );

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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100; // Adjust volume between 0 and 1
    }
  };

  useEffect(() => {
    if(volume != 0) {
      setMuted(false)
    } else {
      setMuted(true)
    }
  }, [volume])

  return (
    <div className="w-full relative h-full shadow-lg flex flex-col items-center justify-center">
      <div className="flex gap-x-4 items-center justify-center">
        <AnimatePresence>
          {mergedPlaying && (
            <motion.button
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              onClick={() => handleSkip(-5)}
            >
              <div className="p-2 text-black bg-white/80 hover:bg-white hover:scale-110 active:scale-95 rounded-xl font-medium transition duration-200">
                <FaBackward />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
        <audio ref={audioRef}></audio>
        <button
          onClick={handleTogglePlay}
          className="flex w-16 z-20 h-16 p-2 text-black items-center justify-center bg-white/80 hover:bg-white rounded-xl gap-2 hover:bg-white/90 font-medium hover:scale-110 active:scale-95 transition duration-200"
        >
          {isLoading ? (
            <MoonLoader size={30} loading={isLoading} />
          ) : !mergedPlaying ? (
            <FaPlay size={28} />
          ) : (
            <FaPause size={28} />
          )}
        </button>
        <AnimatePresence>
          {mergedPlaying && (
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              onClick={() => handleSkip(5)}
            >
              <div className="p-2 text-black bg-white/80 hover:bg-white hover:scale-110 active:scale-95 rounded-xl font-medium transition duration-200">
                <FaForward />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="w-5/6 absolute bottom-[20%]">
        <AnimatePresence>
          {mergedPlaying && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{
                duration: 0.1,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="w-full flex gap-2 items-center justify-center"
            >
              <button
              onClick={ () =>
                {
                  setMuted(!muted)
                  if(audioRef?.current) {
                    if(!muted) {
                      setVolume(0)
                      audioRef.current.volume = 0
                    } else {
                      setVolume(100)
                      audioRef.current.volume = 1
                    }
                  }

                }
              }
              >
              {!muted ?
              <HiMiniSpeakerWave size={20} />
              : <HiMiniSpeakerXMark size={20}/>
              }
              </button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-full appearance-none rounded-lg bg-border overflow-hidden"
                style={{ outline: 'none' }}
              />

              <style jsx>{`
                input::-webkit-slider-thumb {
                  appearance: none;
                  width: 1rem;
                  height: 1rem;
                  background-color: white;
                  border-radius: 50%; /* Make the thumb round */
                  cursor: pointer;
                }

                /* Additional styling for the thumb in Firefox */
                input::-moz-range-thumb {
                  width: 1rem;
                  height: 1rem;
                  background-color: var(--border);
                  border-radius: 50%;
                  cursor: pointer;
                }
              `}</style>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
