"use client";

import React, { useEffect, useState } from 'react';
import Resource from './Resource';
import { collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Input from '../UI Elements/Input';
import { ButtonShad } from '../ui/buttonshad';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import {AiOutlinePlus} from 'react-icons/ai'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CreateTag from './CreateTag';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { message } from 'antd';

interface ResourceData {
  id: string;
  downloadLink: string | null;
  resourceName: string | null;
  resourceImage: string | StaticImport;
  tags: string[];
}

export default function Resources() {
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { user, userId, userStatus } = UserDataFetcher();
  const isPremium = userStatus === 'user' || userStatus === 'admin'
  

  useEffect(() => {
    if (userId && isPremium) {
      try {
        const resourcesRef = collection(db, 'resources');
    
        const unsubscribe = onSnapshot(resourcesRef, async (querySnapshot) => {
          const resources: ResourceData[] = [];
          for (const doc of querySnapshot.docs) {
            const data = doc.data();
            
            const tagsSnapshot = await getDocs(collection(doc.ref, 'tags'));
            const tagsData = tagsSnapshot.docs.map((tagDoc) => tagDoc.data().name);
    
            resources.push({
              id: doc.id,
              downloadLink: data.downloadLink || "/null",
              resourceName: data.name || "undefined",
              resourceImage: data.resourceImage || "/null",
              tags: tagsData, // Add tags to ResourceData
            });
          }
          setResourceData(resources);
        });
          
        return () => {
          unsubscribe();
        };
      } catch(error) {
        message.error("Unable to fetch resources")
      }
    }

  }, [isPremium, userId]);


  const handleTagClick = (tagName: any) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((name) => name !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const filteredResources = resourceData.filter((resource) => {
    const resourceName = resource.resourceName?.toLowerCase();
    const searchTerm = searchInput.toLowerCase();
  
    const resourceTags = resource.tags || [];
    const hasSelectedTag = selectedTags.some((tagName) =>
      resourceTags.includes(tagName)
    );
  
    return (
      (resourceName?.includes(searchTerm) || !searchTerm) &&
      (hasSelectedTag || selectedTags.length === 0)
    );
  });

  useEffect(() => {
    if (userId && isPremium) {
      try{    
        const tagsRef = collection(db, 'tags');
    
        const unsubscribeTags = onSnapshot(tagsRef, (querySnapshot) => {
          const tagsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || 'undefined',
          }));
          setTags(tagsData);
        });
    
        return () => {
          unsubscribeTags();
        };
      } catch(error) {
        message.error("Error fetching tags")
      }
    }

  }, [userId, isPremium]);

  const deleteResource = async (resourceId: string) => {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await deleteDoc(resourceRef);
      
      setResourceData((prevResources) =>
        prevResources.filter((resource) => resource.id !== resourceId)
      );
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const tagRef = doc(db, 'tags', tagId);
      await deleteDoc(tagRef);
      
      setResourceData((prevResources) =>
        prevResources.filter((tag) => tag.id !== tagId)
      );
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Search resources..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <ContextMenu key={tag.name}>
          <ContextMenuTrigger>
          <ButtonShad
            variant="outline"
            onClick={() => handleTagClick(tag.name)}
            className={`px-2 py-1 whitespace-nowrap	${
              selectedTags.includes(tag.name) ? 'hover:bg-white/80 bg-white text-black border-white' : ''
            }`}
            >
            {tag.name}
          </ButtonShad>
          </ContextMenuTrigger>
          {userStatus === 'admin' && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => deleteTag(tag.id)} className="cursor-pointer">
              <button>Delete</button>
            </ContextMenuItem>
          </ContextMenuContent>
          )}
        </ContextMenu>
      ))}
      {userStatus == 'admin' ?
      <Dialog>
        <DialogTrigger>
        <ButtonShad
        variant="outline"
        className="group border-dotted px-2 py-1 gap-1"
        >
          Add a tag
          <AiOutlinePlus className="group-hover:scale-110 transition"/>
        </ButtonShad>
        </DialogTrigger>
        <DialogContent>
          <CreateTag/>
        </DialogContent>
      </Dialog>
      : null}
    </div>
      <div className="flex gap-4 flex-wrap items-center mt-4 justify-center sm:items-start sm:justify-start">
        {filteredResources.map((resource) => (
          <ContextMenu key={resource.resourceName}>
            <ContextMenuTrigger>
              <Resource
                downloadLink={resource.downloadLink}
                resourceName={resource.resourceName}
                resourceImage={resource.resourceImage}
                onDelete={() => deleteResource(resource.id)}
              />
              {userStatus === 'admin' && (
              <ContextMenuContent>
                <ContextMenuItem onClick={() => deleteResource(resource.id)} className="cursor-pointer">
                  <button>Delete</button>
                </ContextMenuItem>
              </ContextMenuContent>
              )}
            </ContextMenuTrigger>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
}