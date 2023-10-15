"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Continue() {
  const { generalLastCourse, generalLastLesson, userStatus, userId, fetching, userName } = UserDataFetcher();

  const router = useRouter()
  const isPremium = userStatus === 'user' || userStatus === 'admin'

  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);

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
        }
      });

      const courseUnsubscribe = onSnapshot(courseDocRef, (courseDocSnap) => {
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data();

          setCourseData(courseData)
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
    {courseData && lessonData ? 
        <Link href={`/${generalLastCourse}/${generalLastLesson}`} className='group rounded-xl flex border-2 border-[--border] transition duration-200 bg-[#161515] hover:border-[#585757] hover:scale-105'>
          <div className='w-full flex flex-col items-center gap-2 px-2 py-4 overflow-hidden'>
            <h1 className='text-lg md:text-xl font-medium text-center'>Continue learning for {userName ? userName : '...'}</h1>
            <div className="relative rounded-xl overflow-hidden w-full">
              <div className="absolute top-8 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-[--bg]"/>
                    <Image loading='lazy' alt='image' src={courseData.image} width={400} height={200} className='w-full'/>
                    <div className='absolute bottom-4 left-4 gap-2 flex flex-col'>
                      <h1 className='2xl:text-5xl text-4xl font-medium'>{lessonData.title}</h1>
                      <p>{lessonData.description}</p>
                    </div>
              </div>
            <p>{courseData.name}</p>
          </div>
        </Link>
    : null}
    </>
  )
}