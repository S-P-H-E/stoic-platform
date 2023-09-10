"use client"
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase'; // Import your Firestore instance

export default function UserImagePassable({ userImage, userName }: { userImage: string, userName: string }) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <Avatar className="w-full h-full">
      <AvatarImage src={userImage ?? undefined} />
      {/* Display the first letter of the userName */}
      <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
    </Avatar>
  );
}