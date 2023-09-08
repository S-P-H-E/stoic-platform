"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Continue() {
  const { generalLastCourse, generalLastLesson, userId, fetching } = UserDataFetcher();

  const [lastLessonName, setLastLessonName] = useState<string | null>(null);
  const [lastLessonDescription, setLastLessonDescription] = useState<string | null>(null);

  const [lastCourseName, setLastCourseName] = useState<string | null>(null);
  const [lastCourseDescription, setLastCourseDescription] = useState<string | null>(null)

  const router = useRouter()


  useEffect(() => {
    if (userId && generalLastCourse && generalLastLesson) {
      const lessonDocRef = doc(db, 'courses', generalLastCourse, 'lessons', generalLastLesson);
      const courseDocRef = doc(db, 'courses', generalLastCourse);

      const lessonUnsubscribe = onSnapshot(lessonDocRef, (lessonDocSnap) => {
        if (lessonDocSnap.exists()) {
          const lessonData = lessonDocSnap.data();
          const lessonName = lessonData.title;
          const lessonDescription = lessonData.description;

          setLastLessonName(lessonName);
          setLastLessonDescription(lessonDescription);
        }
      });

      const courseUnsubscribe = onSnapshot(courseDocRef, (courseDocSnap) => {
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data();
          const courseName = courseData.name;
          const courseDescription = courseData.description;

          setLastCourseName(courseName);
          setLastCourseDescription(courseDescription);
        }
      });

      return () => {
        lessonUnsubscribe();
        courseUnsubscribe();
      };
    }
  }, [userId, generalLastCourse, generalLastLesson]);

  return (
    <>
    {lastLessonName ? 
          <button onClick={() => router.push(`/${generalLastCourse}/${generalLastLesson}`)}>
          <div className='bg-gradient-to-t from-[#181818] border border-[#3030307a] to-50% p-4 rounded-2xl md:w-[500px] h-[200px] flex flex-col cursor-pointer transition-all active:scale-105 md:hover:scale-105'>
            <h1 className='text-2xl md:text-3xl font-medium text-start'>Continue where you left off</h1>
            <h1 className='text-2xl md:text-3xl font-medium text-start'>{lastCourseName}</h1>
            <div className="justify-end md:w-[500px] h-[200px] flex flex-col ">
              <h1 className='text-2xl md:text-3xl font-medium text-start'>{lastLessonName ? lastLessonName : null}</h1>
              <p className='text-[#8c8c8c]'>{lastLessonDescription ? lastLessonDescription : null}</p> 
            </div>
          </div>
        </button>
    : null}
    </>
  )
}