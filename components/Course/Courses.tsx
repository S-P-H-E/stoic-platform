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
    import Course from './Course';
    import { motion } from 'framer-motion';
    import CourseLoading from './CourseLoading';

    export default function Courses({isPremium, userId}: {isPremium: boolean, userId: string | null}) {

      const [loading, isLoading] = useState(true);
    
      const [courses, setCourses] = useState<Array<any>>([]);

      const fadeInAnimationVariants = { // for framer motion  
        initial: {
            opacity: 0,
            y: 100,
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
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 gap-4 mx-auto items-center justify-center w-full '>
          {!loading ? (
            <>
              {courses.map((course, index) => {
                const lastLessonId = course.userCourseData ? course.userCourseData.lastLessonId : null;
    
                const href = lastLessonId
                ? `/courses/${course.id}/${lastLessonId}`
                : course.firstLesson // Check if course.firstLesson is not null
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
                    <Course image={course.image} href={href} name={course.name} description={course.description}/>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <>
              <CourseLoading/>
              <CourseLoading/>
            </>
          )}
        </div>
      );
    }