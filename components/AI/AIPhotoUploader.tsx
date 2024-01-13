'use client';

import React, { useState, useCallback } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { message } from 'antd';
import { useDropzone } from 'react-dropzone';
import { BsImageFill } from 'react-icons/bs';
import Image from 'next/image';
import clsx from 'clsx';

export default function AIPhotoUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageAspect, setImageAspect] = useState<number | null>(null);

  const onFileSelected = useCallback(async (file: File) => {
    setSelectedImage(file);

    try {
      setIsLoading(true);

      const storagePath = `images/ai/${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const aspectRatio = img.width / img.height;

        const calculatedHeight = img.height; // You can adjust this value based on your requirements
        const calculatedWidth = img.width;

        setImageHeight(calculatedHeight);
        setImageWidth(calculatedWidth);
        setImageAspect(aspectRatio);
      };

      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*   const handleResizeClick = (event) => {
    // Prevent the event from propagating to the parent elements
    event.stopPropagation();
  }; */

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        await onFileSelected(file);
      } else {
        console.log('No file dropped');
      }
    },
    maxSize: 15 * 1024 * 1024,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        selectedImage ? 'border h-full' : 'border-dashed w-2/3 h-[17rem]',
        'flex flex-col gap-2 items-center justify-center border-2 border-border hover:bg-black/40 transition duration-200 p-4 rounded-lg text-center cursor-pointer'
      )}
    >
      <input {...getInputProps()} />
      {selectedImage ? (
        <div
          style={{
            width: imageWidth ? `${imageWidth / 1.5}px` : 'auto',
            height: imageHeight ? `${imageHeight / 1.5}px` : 'auto',
          }}
          className="flex w-full h-full justify-center items-center flex-col gap-4"
        >
          <p className="text-highlight">
            You can click again to change the image
          </p>
          <p className="text-highlight">
            {imageWidth} x {imageHeight}
          </p>
          <div className="rounded-lg relative overflow-hidden w-full h-full">
            <Image
              alt="Selected image"
              src={URL.createObjectURL(selectedImage)}
              fill
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      ) : (
        <>
          {isDragActive ? (
            <div className="flex flex-col justify-center items-center gap-1">
              <BsImageFill size={60} />
              <p>
                Drag your image here, or{' '}
                <mark className="bg-transparent text-blue-400 hover:underline">
                  browse
                </mark>
              </p>
              <p className="text-[18px] italic text-[#707070]">
                max file size 15MB - png, jpg & webp allowed
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-1">
              <BsImageFill size={50} />
              <p>
                Drag your image here, or{' '}
                <mark className="bg-transparent text-blue-400 hover:underline">
                  browse
                </mark>
              </p>
              <p className="text-[18px] italic font-normal text-[#707070]">
                max file size 15MB - png, jpg & webp allowed
              </p>
            </div>
          )}
        </>
      )}
      {selectedImage && (
        <div className="font-lg text-base lg:text-xl">
          {isLoading ? <p className="text-sm my-2">Uploading...</p> : null}
        </div>
      )}
    </div>
  );
}
