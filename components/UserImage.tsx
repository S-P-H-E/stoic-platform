"use client"
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase'; // Import your Firestore instance

export default function UserImage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { user, userId, userName } = UserDataFetcher();

  useEffect(() => {
    if (userId) {
      const userDocPath = `users/${userId}`;

      const userDocRef = doc(db, userDocPath);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const imageUrl = userData?.profileImageUrl || null;
          setProfileImageUrl(imageUrl);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  // Extract the first letter of the userName
  const firstLetter = userName ? userName.charAt(0) : '';
  const lastLetter = userName ? userName.charAt(userName.length-1) : ''

  return (
    <Avatar className="w-full h-full">
      <AvatarImage src={profileImageUrl ?? undefined} />
      {/* Display the first letter of the userName */}
      <AvatarFallback className='uppercase select-none'>{firstLetter}{lastLetter}</AvatarFallback>
    </Avatar>
  );
}
