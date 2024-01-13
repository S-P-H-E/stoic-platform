"use client"

import { db, storage } from '@/utils/firebase';
import { message } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { BsTextLeft } from 'react-icons/bs';
import { FiLayout, FiImage } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';
import { RiListOrdered2 } from "react-icons/ri";

interface LessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
  url: string;
  thumbnail: string;
}

interface EditProps {
  lesson: LessonItem
  courseId: string
}

export default function Edit({lesson, courseId}: EditProps) {

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(lesson.title);
  const titleRef = useRef<HTMLInputElement| null>(null);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(lesson.description);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editedUrl, setEditedUrl] = useState(lesson.url);
  const urlRef = useRef<HTMLInputElement | null>(null);

  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editedOrder, setEditedOrder] = useState(lesson.order);
  const orderRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const onFileSelected = useCallback(async (file: File) => {
    setSelectedImage(file);
    try {
      setIsLoading(true);

      const storagePath = `images/lessons/${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      console.log(imageUrl)

      const lessonRef = doc(db, 'courses', courseId, 'lessons', lesson.id)
      await updateDoc(lessonRef, {
        thumbnail: imageUrl,
      });

      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lesson.id]);

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

  const enableEditingTitle = () => {
    setIsEditingTitle(true);
  };

  const disableEditingTitle = () => {
    setIsEditingTitle(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    disableEditingTitle();
    saveTitle();
  };

  const handleKeyDownTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveTitle();
    }
  };

  const saveTitle = async () => {
    disableEditingTitle();

    const lessonRef = doc(db, 'courses', courseId, 'lessons', lesson.id)
    await updateDoc(lessonRef, {
      title: editedTitle,
    });

    message.success('Title updated successfully!')
  };

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditingTitle]);

  /* ------ */

  const enableEditingDescription = () => {
    setIsEditingDescription(true);
  };

  const disableEditingDescription = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    disableEditingDescription();
    saveDescription();
  };

  const handleKeyDownDescription = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents the default behavior of creating a new line
      saveDescription();
    }
  };

  
  const saveDescription = async () => {
    disableEditingDescription();
  
    const lessonRef = doc(db, 'courses', courseId, 'lessons', lesson.id);
  
  
    await updateDoc(lessonRef, {
      description: editedDescription,
    });
  
    message.success('Description updated successfully!');
  };

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [isEditingDescription]);

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

    const enableEditingUrl = () => {
      setIsEditingUrl(true);
    };
  
    const disableEditingUrl = () => {
      setIsEditingUrl(false);
    };
  
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedUrl(e.target.value);
    };
  
    const handleUrlBlur = () => {
      disableEditingUrl();
      saveUrl();
    };
  
    const handleKeyDownUrl = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        saveUrl();
      }
    };
  
    const saveUrl = async () => {
      disableEditingUrl();
  
      const lessonRef = doc(db, 'courses', courseId, 'lessons', lesson.id)
      await updateDoc(lessonRef, {
        url: editedUrl,
      });
  
      message.success('Video URL updated successfully!')
    };
  
    useEffect(() => {
      if (isEditingUrl && urlRef.current) {
        urlRef.current.focus();
      }
    }, [isEditingUrl]);

    /* ------ */

    const enableEditingOrder = () => {
      setIsEditingOrder(true);
    };
  
    const disableEditingOrder = () => {
      setIsEditingOrder(false);
    };
  
    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedOrder(parseInt(e.target.value, 10));
    };
  
    const handleOrderBlur = () => {
      disableEditingOrder();
      saveOrder();
    };
  
    const handleKeyDownOrder = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        saveOrder();
      }
    };
  
    const saveOrder = async () => {
      disableEditingOrder();
  
      const lessonRef = doc(db, 'courses', courseId, 'lessons', lesson.id)
      await updateDoc(lessonRef, {
        order: editedOrder,
      });
  
      message.success('Lesson order updated successfully!')
    };
  
    useEffect(() => {
      if (isEditingOrder && orderRef.current) {
        orderRef.current.focus();
      }
    }, [isEditingOrder]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className='text-2xl font-medium justify-center flex'>Edit Lesson</h1>
      <div className="gap-2 flex items-center">
        <FiLayout/>
        {isEditingTitle ? (
          <input
          ref={titleRef}
          value={editedTitle}
          onBlur={handleTitleBlur}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDownTitle}
          className='h-full bg-transparent transition rounded-xl px-1 outline-none'
        />
        ) : (
          <h1
          ref={titleRef}
          className='h-full line-clamp-1 bg-white/5 hover:bg-white/10 transition rounded-xl px-1 outline-none'
          onClick={enableEditingTitle}
        >
          {editedTitle || lesson.title || "Add a title..."}
        </h1>
        )}

      </div>
      <div className='flex gap-3'>
        <div className='w-52 h-fit aspect-square relative object-cover rounded-xl overflow-hidden'>
          <div
          {...getRootProps()}
          className='outline-none border-dashed rounded-xl border-2 border-border hover:bg-black/40 transition p-4 text-center justify-center items-center flex cursor-pointer w-full aspect-square'
          >
            <input {...getInputProps()} />

            {selectedImage ? (
              <div className="flex justify-center items-center flex-col gap-4">
                <Image
                  alt="Selected image"
                  src={URL.createObjectURL(selectedImage)}
                  width={100}
                  height={100}
                  className="p-2 border border-border rounded-xl flex w-full object-cover"
                />
              </div>
            ) : <>
              {isDragActive ? (
                <div className='flex flex-col justify-center items-center h-full'>
                  <FiImage size={60} />
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center h-'>
                  {lesson && lesson.thumbnail ? (
                    <div className='group aspect-square'>
                      <Image fill alt="Lesson Image" className="object-cover" src={lesson.thumbnail}/>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex justify-center items-center transition duration-300 rounded-xl">
                      <div className="flex flex-col items-center aspect-square">
                        <FiImage size={48} className="text-white" />
                        <p className="text-white text-sm mt-2">Change image</p>
                      </div>
                    </div>
                    </div>
                    ) : (
                      <div className='w-full text-border justify-center items-center aspect-square rounded-xl flex'>
                        <FiImage size={48}/>
                      </div>
                  )}
                </div>
              )}
            </>}
          {selectedImage && (
            <div className="font-lg text-base lg:text-xl">
              {isLoading ? <p className="text-sm my-2">Uploading...</p> : null}
            </div>
          )}
          </div>
          
        </div>
      <div className='flex flex-col gap-1 items-start w-64'>
          <div className='flex gap-2 items-center'>
            <BsTextLeft/>
            <h1>Description</h1>
          </div>
          {isEditingDescription ? (
          <textarea
          ref={descriptionRef}
          value={editedDescription}
          onBlur={handleDescriptionBlur}
          onChange={handleDescriptionChange}
          onKeyDown={handleKeyDownDescription}
          className='h-full w-full bg-transparent transition ring-offset-[#0F0F10] rounded-xl p-2 outline-none resize-none'
        />
        ) : (
          <h1
            ref={descriptionRef as React.LegacyRef<HTMLHeadingElement>}
            className='h-full bg-white/5 hover:bg-white/10 transition ring-offset-[#0F0F10] rounded-xl p-2 outline-none w-full'
            onClick={enableEditingDescription}
            dangerouslySetInnerHTML={{
              __html: editedDescription
                ? editedDescription.replace(/\n/g, '<br/>')
                : truncateText(lesson.description, 100) || "Add a description...",
            }}
          />
        )}


        <div className='flex gap-2'>
        <div className="gap-2 pt-2 flex items-center">
          <IoIosLink/>
          {isEditingUrl ? (
            <input
            ref={urlRef}
            value={editedUrl}
            onBlur={handleUrlBlur}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDownUrl}
            className='h-full bg-transparent transition rounded-xl px-1 outline-none w-full'
          />
          ) : (
            <h1
            ref={urlRef}
            className='h-full bg-white/5 hover:bg-white/10 transition rounded-xl px-1 outline-none'
            onClick={enableEditingUrl}
          >
            { truncateText(editedUrl, 22) || truncateText(lesson.url, 22) || "Add a video url..."}
          </h1>
          )}
        </div>

        <div className="gap-2 pt-2 flex items-center ">
          <RiListOrdered2/>
          {isEditingOrder ? (
            <input
            ref={orderRef}
            value={editedOrder}
            onBlur={handleOrderBlur}
            onChange={handleOrderChange}
            onKeyDown={handleKeyDownOrder}
            className='bg-transparent transition rounded-xl px-1 outline-none'
          />
          ) : (
            <h1
            ref={orderRef}
            className='h-full bg-white/5 hover:bg-white/10 transition rounded-xl px-1 outline-none'
            onClick={enableEditingOrder}
          >
            { editedOrder || lesson.order || "Specify the lesson order..."}
          </h1>
          )}
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}
