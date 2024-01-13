'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { message } from 'antd';
import { motion } from 'framer-motion';
import Resource from './Resource';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from "@/components/ui/toaster"
import { ButtonShad } from '../ui/buttonshad';
import LibraryNavbar from '@/components/Library/Navbar';

interface Resource {
  id: string;
  name: string;
  image: string;
  downloadLink: string;
  tags: string[];
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [areResourcesLoading, setAreResourcesLoading] = useState(true);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<{
    name: string;
    audioRef: React.RefObject<HTMLAudioElement>;
  } | null>(null);
  const [currentAudioName, setCurrentAudioName] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);

  const { userStatus, userId } = UserDataFetcher();
  const { toast } = useToast();

  const isPremium = userStatus === 'premium' || userStatus === 'admin';

  const handlePauseAudio = () => {
    setIsPlaying(false);
  };

  const renderToastContent2 = (
    audioName: string,
    isSameAudio: boolean,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => (
    <div className="flex items-center w-full justify-between space-x-4">
      <h1 className="text-sm font-medium">{`Paused Song: ${audioName}`}</h1>
      <ButtonShad
      variant="secondary"
        onClick={() => {
          if (audioRef?.current) {
            audioRef.current.play();
            setIsPlaying(true);
            toast({
              duration: Infinity,
              render: renderToastContent(audioName, isSameAudio, audioRef),
            });
          }
        }}
      >
        Play
      </ButtonShad>
    </div>
  );

  const renderToastContent = (
    audioName: string,
    isSameAudio: boolean,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => (
    <div className="flex items-center w-full justify-between space-x-4">
      <h1 className="text-sm font-medium">{`Playing Song: ${audioName}`}</h1>
      <ButtonShad
      variant="secondary"
        onClick={() => {
          if (audioRef?.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            toast({
              duration: Infinity,
              render: renderToastContent2(audioName, isSameAudio, audioRef),
            });
          }
        }}
        className="bg-white text-black hover:bg-white/80 transition p-2 rounded-md"
      >
        Pause
      </ButtonShad>

    </div>
  );

  const playingAudio = (
    audioName: string,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => {
    setCurrentlyPlayingAudio((prevAudio) => {
      // Check if the audio is the same as the currently playing one

      const isSameAudio = prevAudio?.name === audioName;

      // Pause and reset the currently playing audio
      if (prevAudio?.audioRef.current) {
        prevAudio.audioRef.current.pause();
        prevAudio.audioRef.current.currentTime = 0;
        prevAudio.audioRef.current.removeEventListener(
          'ended',
          handleAudioEnded
        );

        toast({
          duration: 3000,
        });
      }

      // Start playing the new audio if it's not the same as the currently playing one
      if (!isSameAudio && audioRef.current) {
        audioRef.current.play();
        setCurrentAudioName(audioName);
        setIsPlaying(true);
        audioRef.current.addEventListener('ended', handleAudioEnded);

        toast({
          duration: isSameAudio ? 3000 : Infinity,
          render: renderToastContent(audioName, isSameAudio, audioRef),
        });
      }

      return isSameAudio ? null : { name: audioName, audioRef };
    });
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentAudioName('');
    toast({
      title: 'Song ended',
    });

    // Remove the event listener to avoid memory leaks
    if (currentlyPlayingAudio?.audioRef.current) {
      currentlyPlayingAudio.audioRef.current.removeEventListener(
        'ended',
        handleAudioEnded
      );
    }
  };

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      scale: 0.7,
      y: 10,
    },
    animate: (index: number) => {
      let moduloValue = 1;

      if (window.innerWidth >= 3840) {
        moduloValue = 12;
      } else if (window.innerWidth >= 2560) {
        moduloValue = 10;
      } else if (window.innerWidth >= 1910) {
        moduloValue = 8;
      } else if (window.innerWidth >= 1280) {
        moduloValue = 3;
      } else if (window.innerWidth >= 1024) {
        moduloValue = 2;
      } else {
        moduloValue = 1;
      }

      return {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          delay: (index % moduloValue) * 0.05,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
      };
    },
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagDelete = async (tagId: string) => {
    try {
      const tagRef = doc(db, 'tags', tagId);
      await deleteDoc(tagRef);

      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));

      message.success('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleResourceDelete = async (resourceId: string) => {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await deleteDoc(resourceRef);

      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== resourceId)
      );

      message.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleTagFilter = (tagName: string) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagName)) {
        return prevSelectedTags.filter(
          (selectedTag) => selectedTag !== tagName
        );
      } else {
        return [...prevSelectedTags, tagName];
      }
    });
  };

  useEffect(() => {
    const filtered = resources.filter((resources) => {
      const nameMatch = resources.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const tagMatch = selectedTags.every((tag) =>
        resources.tags.includes(tag)
      );

      return nameMatch && tagMatch;
    });

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedTags]);

  useEffect(() => {
    const fetchResources = async () => {
      if (isPremium && userId) {
        const resourcesCollection = collection(db, 'resources');
        const q = query(resourcesCollection);

        try {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const resourcesData = snapshot.docs.map((doc) => {
              const data = doc.data();

              const resource: Resource = {
                id: doc.id,
                name: data.name,
                image: data.image,
                downloadLink: data.downloadLink,
                tags: data.tags || [],
              };
              return resource;
            });
            setResources(resourcesData);
          });
          return () => unsubscribe();
        } catch {
          message.error('Error fetching resources');
        } finally {
          setAreResourcesLoading(false);
        }
      }
    };
    fetchResources();
  }, [isPremium, userId]);

  useEffect(() => {
    const fetchTags = async () => {
      if (isPremium && userId) {
        const tagsRef = collection(db, 'tags');
        const q = query(tagsRef);

        try {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const tagsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || undefined,
            }));

            setTags(tagsData);
          });

          return () => unsubscribe();
        } catch (error) {
          message.error('Error fetching tags');
        }
      }
    };
    fetchTags();
  }, [userId, isPremium]);

  return (
    <div className="flex flex-col gap-4">
      <LibraryNavbar
        onDeleteTag={handleTagDelete}
        tags={tags}
        onTagFilter={handleTagFilter}
        selectedTags={selectedTags}
        userStatus={userStatus}
        onSearch={handleSearch}
        handleTagDelete={handleTagDelete}
        handleTagFilter={handleTagFilter}
        handleSearch={handleSearch}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 gap-4 ">
        {searchQuery && filteredResources.length === 0 ? (
          <motion.div
            className="col-span-3"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Not Found
          </motion.div>
        ) : (
          filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              custom={index}
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
              }}
            >
              {areResourcesLoading ? (
                <div className="h-[27rem] w-full animate-pulse bg-border" />
              ) : (
                <Resource
                  onPauseAudio={handlePauseAudio}
                  isPlayingParent={isPlaying}
                  audioName={currentAudioName}
                  playingAudio={playingAudio}
                  userStatus={userStatus}
                  onDelete={handleResourceDelete}
                  resource={resource}
                />
              )}
            </motion.div>
          ))
        )}
      </div>

      <Toaster />
    </div>
  );
}
