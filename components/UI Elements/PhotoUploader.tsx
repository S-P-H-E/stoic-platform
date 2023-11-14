import React, { useState, useCallback } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { message } from 'antd';
import { useDropzone } from 'react-dropzone';
import { BsImageFill } from 'react-icons/bs';
import Image from 'next/image';

interface ImageUploadProps {
  onComplete: (imageUrl: string) => void;
  customPath?: string
}

export default function ImageUpload({ onComplete, customPath }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileSelected = useCallback(async (file: File) => {
    setSelectedImage(file);

    try {
      setIsLoading(true);

      const storagePath = customPath ? `images/${customPath}/${file.name}` : `images/${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);
      onComplete(imageUrl); // Call onComplete with the imageUrl

      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, customPath]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        await onFileSelected(file);
      } else {
        console.log('No file dropped');
      }
    },
    maxSize: 10 * 1024 * 1024,
  });

  return (
      <div
        {...getRootProps()}
        className='border-dashed border-2 border-[--border] hover:bg-black/40 transition p-4 rounded-lg text-center cursor-pointer'
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <div className="flex justify-center items-center flex-col gap-4">
            <p className="text-[--highlight]">You can click again to change the image</p>
            <Image
              alt="Selected image"
              src={URL.createObjectURL(selectedImage)}
              width={100}
              height={100}
              className="p-2 border border-[--border] rounded-lg flex w-[20vh] object-contain mx-auto"
            />
          </div>
        ) : <>
          {isDragActive ? (
            <div className='flex flex-col justify-center items-center gap-1'>
              <BsImageFill size={60} />
              <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
              <p className='text-[18px] italic text-[#707070]'>max file size 10MB - png, jpeg & gif allowed</p>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-1'>
              <BsImageFill size={50} />
              <p>Drag your image here, or <mark className='bg-transparent text-blue-500 hover:underline'>browse</mark></p>
              <p className='text-[18px] italic font-normal text-[#707070]'>max file size 10MB - png, gif & jpeg allowed</p>
            </div>
          )}
        </>}
      {selectedImage && (
        <div className="font-lg text-base lg:text-xl">
          {isLoading ? <p className="text-sm my-2">Uploading...</p> : null}
        </div>
      )}
    </div>
  );
}
