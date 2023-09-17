import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export function useTagCreator() {
  const [isLoadingTag, setIsLoadingTag] = useState(false);
  const [error, setError] = useState<Error | null>(null); // Specify the type as 'Error | null'

  const createTag = async (tagName: string) => {
    setIsLoadingTag(true);
    setError(null);

    try {
      const tagsRef = collection(db, 'tags');
      await addDoc(tagsRef, { name: tagName });
      setIsLoadingTag(false);
    } catch (error) {
        setError(error as Error); // Cast the error to 'Error'
        setIsLoadingTag(false);
    }
  };

  return { createTag, isLoadingTag, error };
}
