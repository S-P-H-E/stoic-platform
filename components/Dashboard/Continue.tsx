"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import placeholderImage from '@/public/placeholder.jpg'

export default function Continue() {
  const { generalLastCourse, generalLastLesson, userStatus, userId, fetching, userName } = UserDataFetcher();

  const isPremium = userStatus === 'premium' || userStatus === 'admin'

  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, isLoading] = useState(true);

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  useEffect(() => {
    if (userId && generalLastCourse && generalLastLesson && isPremium) {
      const lessonDocRef = doc(db, 'courses', generalLastCourse, 'lessons', generalLastLesson);
      const courseDocRef = doc(db, 'courses', generalLastCourse);

      const lessonUnsubscribe = onSnapshot(lessonDocRef, (lessonDocSnap) => {
        if (lessonDocSnap.exists()) {
          const lessonData = lessonDocSnap.data();

          setLessonData(lessonData)

          isLoading(false)

          /* console.log(lessonData.description) */
        }
      });

      const courseUnsubscribe = onSnapshot(courseDocRef, (courseDocSnap) => {
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data();

          setCourseData(courseData)

          /* console.log(courseData) */
        }
      });

      return () => {
        lessonUnsubscribe();
        courseUnsubscribe();
      };
    }
  }, [userId, generalLastCourse, generalLastLesson, isPremium]);

  return (
    <>
      {!loading && courseData && lessonData ? (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Link href={`courses/${generalLastCourse}/${generalLastLesson}`} className='max-h-[34.5rem] h-full group rounded-xl flex border border-[--border] transition duration-200 bg-[--darkgray] hover:border-[#585757] hover:scale-105 active:scale-100'>
          <div className='w-full h-full flex flex-col items-center gap-2 p-2 overflow-hidden'>
            <h1 className='text-lg md:text-xl font-medium text-center'>Continue learning for {userName ? userName : '...'}</h1>
            <div className="relative rounded-xl overflow-hidden w-full max-h-[25rem] md:max-h-[21rem] 2xl:max-h-[40rem]">
              <div className="absolute top-8 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-[--bg]"/>
                  {lessonData.thumbnail ? 
                  <Image loading='lazy' alt='Lesson Thumbnail' src={lessonData.thumbnail} width={500} height={400} className='w-full object-cover '/>
                  :
                  <Image loading='lazy' alt="Lesson Thumbnail" src={placeholderImage} placeholder='blur' width={500} height={400} className='w-full object-cover'/>
                  }
                  <div className='absolute bottom-4 left-4 gap-2 flex flex-col'>
                    <h1 className='2xl:text-5xl lg:text-4xl md:text-2xl text-3xl font-medium hidden md:hidden 2xl:block'>{truncateText(lessonData.title, 18)}</h1>
                    <h1 className='2xl:text-5xl lg:text-4xl md:text-2xl text-3xl font-medium block 2xl:hidden'>{truncateText(lessonData.title, 14)}</h1>
                    <p>{truncateText(lessonData.description, 125)}</p>
                  </div>
              </div>
            <p>{courseData.name}</p>
          </div>
          </Link>
        </motion.div>
      ) : (
        <div className='h-[57vh] w-full border border-[--border] hover:border-[#585757] transition duration-200 rounded-xl bg-[--darkgray] p-2 flex flex-col gap-2 items-center justify-center'>
          {loading ? (
            <>
              <p className='w-4/6 h-8 rounded-xl bg-[--border] animate-pulse' />
              <div className='bg-[--border] rounded-xl animate-pulse w-full h-full' />
              <p className='w-2/6 h-8 rounded-xl bg-[--border] animate-pulse' />
            </>
          ) : (
            <p>You dont have a last lesson.</p>
          )}
        </div>
      )}
    </>
  );
}