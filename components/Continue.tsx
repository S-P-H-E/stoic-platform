"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function Continue() {
  const { userLastLesson, userId } = UserDataFetcher();

  const [lastCourse, setLastCourse ] = useState<string | null>(null)
  const [lastLessonName, setLastLessonName] = useState<string | null>(null);
  const [lastLessonDescription, setLastLessonDescription] = useState<string | null>(null);

  useEffect(() => {
    if ( userId ) {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const lastCourseId = userData.lastCourse;

        if (lastCourseId) {
          setLastCourse(lastCourseId);
        }
      }
    });
    

    if (userLastLesson && lastCourse) {
      const lessonDocRef = doc(db, 'courses', lastCourse, 'lessons', userLastLesson);

      const unsubscribe = onSnapshot(lessonDocRef, (lessonDocSnap) => {
        if (lessonDocSnap.exists()) {
          const lessonData = lessonDocSnap.data();

          const lessonName = lessonData.title;
          const lessonDescription = lessonData.description;

          setLastLessonName(lessonName);
          setLastLessonDescription(lessonDescription);
        }
      });
      return () => {
        unsubscribe();
      };
    }
    }
  }, [userLastLesson, userId, lastCourse]);


  return (
    <div className='bg-gradient-to-t from-[#181818] border border-[#3030307a] to-50% p-4 rounded-2xl md:w-[500px] h-[200px] flex flex-col cursor-pointer transition-all active:scale-105 md:hover:scale-105'>
      <h1 className='text-2xl md:text-3xl font-medium text-start'>Continue where u left off</h1>
      <div className="justify-end md:w-[500px] h-[200px] flex flex-col ">
        <h1 className='text-2xl md:text-3xl font-medium text-start'>{lastLessonName ? lastLessonName : null}</h1>
        <p className='text-[#8c8c8c]'>{lastLessonDescription ? lastLessonDescription : null}</p> 
      </div>
    </div>
  )
}
