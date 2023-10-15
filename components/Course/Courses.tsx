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
    
    export default function Courses() {
      const { userId, userStatus } = UserDataFetcher();
      const isPremium = userStatus === 'user' || userStatus === 'admin';
    
      const [loading, isLoading] = useState(true);
    
      const [courses, setCourses] = useState<Array<any>>([]);
    
      function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
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
        <div className='flex sm:flex-row flex-col gap-8 sm:items-start items-center w-full'>
          {!loading ? (
            <>
              {courses.map((course) => {
                const lastLessonId = course.userCourseData ? course.userCourseData.lastLessonId : null;
    
                const href = lastLessonId
                  ? `/${course.id}/${lastLessonId}`
                  : `/${course.id}/${course.firstLesson.id}`;
    
                return (
                  <Course image={course.image} key={course.name} href={href} name={course.name} description={course.description}/>
                );
              })}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
    }