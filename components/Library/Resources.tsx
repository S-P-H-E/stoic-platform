"use client"

import React, { useEffect, useState } from 'react'
import SearchBar from './Searchbar';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import TagFilter from './TagFilter';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { message } from 'antd';
import { motion } from 'framer-motion';
import Resource from './Resource';

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

  const {userStatus, userId} = UserDataFetcher()

  const isPremium = userStatus === 'premium' || userStatus === 'admin'

  const fadeInAnimationVariants = { // for framer motion  
    initial: {
        opacity: 0,
        scale: 0.7,
        y: 10,
    },
    animate: (index: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          delay: 0.05 * index,
          type: "spring",
          stiffness: 260,
          damping: 20
        }
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagDelete = async (tagId: string) => {
    try {
      const tagRef = doc(db, 'tags', tagId);
      await deleteDoc(tagRef);
  
      setTags((prevTags) =>
        prevTags.filter((tag) => tag.id !== tagId)
      );

      message.success('Tag deleted successfully')
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  }

  const handleResourceDelete = async (resourceId: string) => {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await deleteDoc(resourceRef);
      
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== resourceId)
      );

      message.success('Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleTagFilter = (tagName: string) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagName)) {
        return prevSelectedTags.filter(selectedTag => selectedTag !== tagName);
      } else {
        return [...prevSelectedTags, tagName];
      }
    });
  };

  useEffect(() => {
      const filtered = resources.filter((resources) => {
      const nameMatch = resources.name.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = selectedTags.every(tag => resources.tags.includes(tag));

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
        }
        
        catch {
          message.error('Error fetching resources');
        }
        
        finally {
          setAreResourcesLoading(false)
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
    <div className='flex flex-col gap-4'>
      <TagFilter onDeleteTag={handleTagDelete} tags={tags} onTagFilter={handleTagFilter} selectedTags={selectedTags} userStatus={userStatus}/> 
      <SearchBar onSearch={handleSearch}/>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {searchQuery && filteredResources.length === 0 ? (
        <motion.div className="col-span-3"
        initial={{y:100, opacity:0}}
        animate={{y:0, opacity: 1}}
        >
          Not Found
        </motion.div>
        ) : (
          filteredResources.map((resource, index) => (
          <motion.div key={resource.id}
          custom={index}
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: true
          }}
          >
            {areResourcesLoading ? 
            <div className="h-[27rem] w-full animate-pulse bg-[--border]"/>
            :
            <Resource userStatus={userStatus} onDelete={handleResourceDelete} resource={resource} />
            }
          </motion.div>
        ))
      )}
    </div>
    </div>
  )
}
