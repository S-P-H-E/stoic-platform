"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCourse from './DashboardCourse';

export default function DashboardCourses() {
  const { userId, userStatus } = UserDataFetcher();
  const isPremium = userStatus === 'premium' || userStatus === 'admin';

  const [loading, isLoading] = useState(true);

  const [courses, setCourses] = useState<Array<any>>([]);

  const fadeInAnimationVariants = {
    initial: {
        opacity: 0,
        y: 50,
    },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.05 * index,
        }
    })
}

  const fetchCourses = useCallback(async () => {
    if (userId && isPremium) {
      try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            const lessonsRef = collection(db, 'courses', course.id, 'lessons');
            const lessonsSnapshot = await getDocs(query(lessonsRef, orderBy('order')));

            const lessonIds = lessonsSnapshot.docs.map((lessonDoc) => lessonDoc.id);
            const firstLesson = lessonsSnapshot.docs[0];

            let userCourseData

            if (!userCourseData) {
              const userCourseRef = doc(db, 'users', userId, 'courses', course.id);
              const userCourseSnapshot = await getDoc(userCourseRef);

              if (userCourseSnapshot.exists()) {
                userCourseData = userCourseSnapshot.data();
              }
            }
            return {
              ...course,
              firstLesson: firstLesson ? { id: firstLesson.id, ...firstLesson.data() } : null,
              lessonIds: lessonIds,
              userCourseData: userCourseData || null,
            };
          })
        );

        setCourses(coursesWithLessons);
        isLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [userId, isPremium]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, userId]);

  return (
    <div className='w-full h-full grid grid-cols-1 md:grid-cols-2 pb-4 gap-4'>
      {!loading ? (
        <>
          {courses.map((course, index) => { 
            const lastLessonId = course.userCourseData ? course.userCourseData.lastLessonId : null;

            const href = lastLessonId
            ? `/courses/${course.id}/${lastLessonId}`
            : course.firstLesson
            ? `/courses/${course.id}/${course.firstLesson.id}`
            : `/courses/${course.id}/404`;

            return (
              <motion.div 
                key={course.name}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
              >
                <DashboardCourse image={course.image} href={href} name={course.name} description={course.description}/>
              </motion.div>
            );
          })}
        </>
      ) : (
        <>
        <div className='flex flex-col w-full h-full items-center justify-center text-center bg-[--border] animate-pulse rounded-xl'/>
        <div className='flex flex-col w-full h-full items-center justify-center text-center bg-[--border] animate-pulse rounded-xl'/>
        </>
      )}
    </div>
  );
}