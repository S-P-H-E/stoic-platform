"use client"

import React, { useState, useCallback } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/utils/firebase';
import { message } from 'antd';
import Button from '@/components/UI Elements/Button'
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Image from 'next/image';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useDropzone } from 'react-dropzone'; // Import useDropzone
import { BsImageFill } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md';
import clsx from 'clsx';
import { User, GlobalUser } from '@/types/types';

interface PhotoModalProps {
  onClose?: () => void;
  user?: User;
  globalUser?: GlobalUser;
  userId: string;
  isAuthorized: boolean;
  bypass?: boolean;
}

export default function PhotoUpload({
  onClose,
  user,
  globalUser,
  userId,
  isAuthorized,
  bypass
}: PhotoModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [photoUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user: fireBaseUser } = UserDataFetcher();

  const onFileSelected = useCallback((file: File) => {
    setSelectedImage(file);
  }, []);

  const uploadProfilePicture = async () => {
    if (selectedImage && user && userId && isAuthorized || userId && isAuthorized && selectedImage && bypass) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Add any other allowed image types
  
      if (!allowedFileTypes.includes(selectedImage.type)) {
        message.error('Invalid file type. Please select a valid image file.');
        return;
      }
  
      try {
        setIsLoading(true); // Set isLoading to true when the upload starts
  
        const storageRef = ref(storage, `profilePictures/${userId}`);
        await uploadBytes(storageRef, selectedImage);
  
        const imageUrl = await getDownloadURL(storageRef);
        setProfileImageUrl(imageUrl);
        
        if(fireBaseUser != null || fireBaseUser != undefined) {
          await updateProfile(fireBaseUser, { photoURL: imageUrl });
        }
        
        if(onClose) {
          onClose();
        }
        
        message.success('Profile picture uploaded successfully!');
  
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { photoUrl: imageUrl }, { merge: true });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        message.error('Failed to upload profile picture.');
      } finally {
        setIsLoading(false); // Set isLoading back to false when the upload is complete or encounters an error
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 8 * 1024 * 1024) {
        message.error('File size exceeds 8MB. Please select a smaller file.');
        return;
      }
      onFileSelected(file);
    },
    /* maxSize: 8 * 1024 * 1024,  */
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    }
  });

  return (
    <div className="relative h-full bg-modal border-border border flex flex-col gap-3 p-6 rounded-xl text-center">
      <h1 className="text-lg font-medium pb-2">Change Profile Picture</h1>
      <div
        {...getRootProps()}
        className='border-dashed border-2 border-border h-full flex items-center justify-center hover:bg-black/40 transition p-4 rounded-lg text-center cursor-pointer'
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <div className="flex justify-center items-center flex-col h-full w-full gap-3">
            <p className="text-highlight">You can click again to change the image</p>
            <div className="w-full h-full aspect-square relative rounded-lg">
              <Image
                alt="Profile picture"
                src={URL.createObjectURL(selectedImage)}
                fill
                quality={95}
                className="rounded-lg object-cover"
              />
            </div>
            <button onClick={() => {setSelectedImage(null); setIsLoading(false);}} className="hover:text-white text-highlight transition flex gap-1 items-center"><MdDelete/>Clear Image</button>
          </div>
        ) : <>
          {isDragActive ? (
          <div className='flex flex-col justify-center items-center gap-1'>
            <BsImageFill size={60}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
            <p className='text-[18px] italic text-[#707070]'>max file size 8MB - png, jpeg & gif allowed</p>
          </div>
            ) : (
          <div className='flex flex-col justify-center items-center gap-1'>
            <BsImageFill size={50}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
            <p className='text-[18px] italic font-normal text-[#707070]'>max file size 8MB - png, gif & jpeg allowed</p>
          </div>
        )}
        </> }
      </div>
      {selectedImage ? 
      <Button
         className={clsx({
          'text-highlight': isLoading,
        }, 'font-lg text-base lg:text-xl')}
         onClick={uploadProfilePicture}
         disabled={isLoading}
        >
         {isLoading ? 'Uploading...' : 'Upload Profile Picture'}
      </Button>
      : null}
      </div>
  );
}