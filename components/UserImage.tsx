"use client"
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase'; // Import your Firestore instance
import clsx from 'clsx';

export default function UserImage({className}: {className?:string}) {
  const [photoUrl, setProfileImageUrl] = useState<string | null>(null);
  const { user, userId, userName } = UserDataFetcher();

  useEffect(() => {
    if (userId) {
      const userDocPath = `users/${userId}`;

      const userDocRef = doc(db, userDocPath);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const imageUrl = userData?.photoUrl || null;
          setProfileImageUrl(imageUrl);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <Avatar className={clsx("w-full h-full aspect-square", className)}>
      <AvatarImage src={photoUrl ?? undefined} />
      {/* Display the first letter of the userName */}
      <AvatarFallback className='uppercase bg-darkgray select-none text-base w-full h-full'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
    </Avatar>
  );
}
