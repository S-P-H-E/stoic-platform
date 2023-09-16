"use client";

import React, { useEffect, useState } from 'react';
import Resource from './Resource';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Input from '../Input';
import { ButtonShad } from '../ui/buttonshad';

interface ResourceData {
  id: string;
  downloadLink: string | null;
  resourceName: string | null;
  resourceImage: string | StaticImport;
}

export default function Resources() {
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const resourcesRef = collection(db, 'resources');
    
    const unsubscribe = onSnapshot(resourcesRef, (querySnapshot) => {
      const resources: ResourceData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        resources.push({
          id: doc.id,
          downloadLink: data.downloadLink || "/null",
          resourceName: data.name || "undefined",
          resourceImage: data.resourceImage || "/null",
        });
      });
      setResourceData(resources);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const handleTagClick = (tagName: any) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((name) => name !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  console.log(selectedTags)

  const filteredResources = resourceData.filter((resource) => {
    const resourceName = resource.resourceName?.toLowerCase();
    const searchTerm = searchInput.toLowerCase();

    /* const resourceTags = resource.tags || []; */ // gonna fix this part soon
    const hasSelectedTag = selectedTags.some((tagId) =>
      resourceTags.includes(tagId)
    );

    return (
      (resourceName?.includes(searchTerm) || !searchTerm) &&
      (hasSelectedTag || selectedTags.length === 0)
    );
  });

  useEffect(() => {
    const tagsRef = collection(db, 'tags');
    const fetchTags = async () => {
      const querySnapshot = await getDocs(tagsRef);
      const tagsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || 'undefined',
      }));
      setTags(tagsData);
    };
    fetchTags();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Input
        type="text"
        placeholder="Search resources..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
      {tags.map((tag) => (
        <ButtonShad
          variant="outline"
          key={tag.name}
          onClick={() => handleTagClick(tag.name)}
          className={`px-2 py-1 ${
            selectedTags.includes(tag.name) ? 'hover:bg-white/80 bg-white text-black' : ''
          }`}
        >
          {tag.name}
        </ButtonShad>
      ))}
    </div>
      <div className="flex gap-4 flex-wrap items-center">
        {filteredResources.map((resource) => (
          <Resource
            key={resource.resourceName}
            downloadLink={resource.downloadLink}
            resourceName={resource.resourceName}
            resourceImage={resource.resourceImage}
          />
        ))}
      </div>
    </div>
  );
}