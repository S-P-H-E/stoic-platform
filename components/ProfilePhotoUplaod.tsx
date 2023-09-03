import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/utils/firebase';
import React from 'react';
import { message } from 'antd';
import Button from './Button';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Image from 'next/image';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {CgClose} from 'react-icons/cg'

interface PasswordModalProps {
  onClose: () => void;
}

export default function ProfilePhotoUplaod({ onClose }: PasswordModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const { user, userId } = UserDataFetcher();

  const uploadProfilePicture = async () => {
    if (selectedImage && user && userId) {
      try {
        const storageRef = ref(storage, `profilePictures/${userId}`);
        await uploadBytes(storageRef, selectedImage);

        const imageUrl = await getDownloadURL(storageRef);
        setProfileImageUrl(imageUrl);
        await updateProfile(user, { photoURL: imageUrl });
        
        
        onClose();
        message.success('Profile picture uploaded successfully!');
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { profileImageUrl: imageUrl }, { merge: true });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        message.error('Failed to upload profile picture.');
      }
    }
  };

  return (
    <div className="relative py-16 bg-black border-[--border] border flex flex-col gap-2 p-8 rounded-lg text-center">
     
     <button className='absolute top-4 right-4 text-[--highlight] hover:text-white transition cursor-pointer'>
            <CgClose onClick={() => onClose()} size="20"/>
      </button>

      <input
        type="file"
        className="bg-transparent border-[--border] text-lg border p-2 rounded-lg text-center"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedImage(file);
          }
        }}
      />
      {selectedImage ? (
        <>
        <div className="flex justify-center m-2 items-center flex-col gap-4">
          <Image
            alt="Profile picture"
            src={URL.createObjectURL(selectedImage)} // Display the selected image
            width={440}
            height={440}
            className="border border-[--border] rounded-lg flex"
          />
        </div>
        <Button className="font-normal text-base lg:text-lg" onClick={uploadProfilePicture}>
        Upload Profile Picture
      </Button>
      </>
      ) : null}
    </div>
  );
}
