import React, { useState, useCallback } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/utils/firebase';
import { message } from 'antd';
import Button from './Button';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Image from 'next/image';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { CgClose } from 'react-icons/cg';
import { useDropzone } from 'react-dropzone'; // Import useDropzone
import { BsImageFill } from 'react-icons/bs'

interface PasswordModalProps {
  onClose: () => void;
}

type Accept = string | string[];

export default function ProfilePhotoUpload({ onClose }: PasswordModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, userId } = UserDataFetcher();

  const onFileSelected = useCallback((file: File) => {
    setSelectedImage(file);
  }, []);

  const uploadProfilePicture = async () => {
    if (selectedImage && user && userId) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add any other allowed image types
  
      if (!allowedFileTypes.includes(selectedImage.type)) {
        // Check if the selected file's MIME type is in the allowed list
        message.error('Invalid file type. Please select a valid image file.');
        return; // Abort the upload process if the file type is not allowed
      }
  
      try {
        setIsLoading(true); // Set isLoading to true when the upload starts
  
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
      } finally {
        setIsLoading(false); // Set isLoading back to false when the upload is complete or encounters an error
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileSelected(acceptedFiles[0]),
    maxSize: 5 * 1024 * 1024, 
  });

  return (
    <div className="relative py-16 bg-black border-[--border] border flex flex-col gap-2 p-8 rounded-lg text-center">
      <button className='absolute top-4 right-4 text-[--highlight] hover:text-white transition cursor-pointer'>
        <CgClose onClick={() => onClose()} size="20"/>
      </button>

      <div
        {...getRootProps()}
        className='border-dashed border border-[--border] bg-black p-8 rounded-lg text-center cursor-pointer'
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className='flex flex-col justify-center items-center gap-3'>
            <BsImageFill size={60}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center gap-3'>
            <BsImageFill size={50}/>
            <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
          </div>
        )}
      </div>

      {selectedImage ? (
        <>
          <div className="flex justify-center m-2 items-center flex-col gap-4">
            <Image
              alt="Profile picture"
              src={URL.createObjectURL(selectedImage)} // Display the selected image
              width={100}
              height={0}
              className="border border-[--border] rounded-lg flex w-[20vh] object-contain mx-auto"
            />
          </div>
          <Button
             className='font-lg text-base lg:text-xl'
            onClick={uploadProfilePicture}
            disabled={isLoading} // Disable the button when isLoading is true
          >
            {isLoading ? 'Uploading...' : 'Upload Profile Picture'}
          </Button>
        </>
      ) : null}
    </div>
  );
}
