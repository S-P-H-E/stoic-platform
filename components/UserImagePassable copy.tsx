"use client"
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export default function UserImagePassable({ userImage, userName }: { userImage: string, userName: string }) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Extract the first letter of the userName
  const userChar: string = userName ? userName : '';

  return (
    <Dialog>
      <DialogTrigger>
        <Avatar className="w-full h-full">
          <AvatarImage src={userImage ?? undefined} />
          {/* Display the first letter of the userName */}
          <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        
      </DialogContent>
    </Dialog>
  );
}