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

interface PasswordModalProps {
  onClose: () => void;
}

export default function BannerUpload({ onClose }: PasswordModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [photoUrl, setBannerImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, userId } = UserDataFetcher();

  const onFileSelected = useCallback((file: File) => {
    setSelectedImage(file);
  }, []);

  const uploadBannerPicture = async () => {
    if (selectedImage && user && userId) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Add any other allowed image types
  
      if (!allowedFileTypes.includes(selectedImage.type)) {
        message.error('Invalid file type. Please select a valid image file.');
        return;
      }
  
      try {
        setIsLoading(true); // Set isLoading to true when the upload starts
  
        const storageRef = ref(storage, `profileBanners/${userId}`);
        await uploadBytes(storageRef, selectedImage);
  
        const imageUrl = await getDownloadURL(storageRef);
        setBannerImageUrl(imageUrl);
  
        onClose();
        message.success('Profile banner uploaded successfully!');
  
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { bannerUrl: imageUrl }, { merge: true });
      } catch (error) {
        console.error('Error uploading profile banner:', error);
        message.error('Failed to upload profile banner.');
      } finally {
        setIsLoading(false); // Set isLoading back to false when the upload is complete or encounters an error
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileSelected(acceptedFiles[0]),
    maxSize: 8 * 1024 * 1024,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    }
  });

  return (
    <div className="relative py-16  border-[--border] border flex flex-col gap-2 p-8 rounded-lg text-center">
      <div
        {...getRootProps()}
        className='border-dashed border-2 border-[--border]  hover:bg-black/40 transition p-4 rounded-lg text-center cursor-pointer'
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <div className="flex justify-center items-center flex-col gap-4">
            <p className="text-[--highlight]">You can click again to change the banner</p>
             <Image
              alt="Banner picture"
              src={URL.createObjectURL(selectedImage)}
              width={100}
              height={100}
              className="p-2 border border-[--border] rounded-lg flex w-[20vh] object-contain mx-auto"
            />
            <button onClick={() => {setSelectedImage(null); setIsLoading(false);}} className="hover:text-white text-[--highlight] transition flex gap-1 items-center"><MdDelete/>Clear Image</button>
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
          'text-[--highlight]': isLoading,
        }, 'font-lg text-base lg:text-xl')}
         onClick={uploadBannerPicture}
         disabled={isLoading}
        >
         {isLoading ? 'Uploading...' : 'Upload Profile Banner'}
      </Button>
      : null}
      </div>
  );
}