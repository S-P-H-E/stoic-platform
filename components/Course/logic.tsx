"use client"

import { FC, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Course from './page';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { message } from 'antd';

// Define the DashboardProps interface
interface CourseLogicProps {
  courses: Array<any>; // Ensure that courses is always an array
}

// Define the Dashboard functional component
const CourseLogic: FC<CourseLogicProps> = () => {
  // State to store the fetched courses
  const [courses, setCourses] = useState<Array<any>>([]);
  const [LessonToGo, setLessonToGo] = useState<any>(null)
  
  const [aeLesson, setAeLesson] = useState<string>('57ALYHAF74nRUw4sKuEG')
  const [shortFormLesson, setShortFormLesson] = useState<string>('2KLESohi8Qpvz9uKEc08')

  const [AeLastLesson, setAeLastLesson] = useState<string | null>(null);
  const [shortformLastLesson, setShortformLastLesson] = useState<string | null>(null);

  const { userId, userStatus } = UserDataFetcher()
  const isPremium = userStatus === 'user' || userStatus === 'admin'

  const fetchLastLessonId = async (userId: string, courseId: string) => {
    try {
      const userCourseRef = doc(db, 'users', String(userId), 'courses', String(courseId));
      const userCourseSnapshot = await getDoc(userCourseRef);
  
      if (userCourseSnapshot.exists()) {

        console.log("test " + courseId)
        const lastLessonId = userCourseSnapshot.data().lastLessonId;
        /* console.log(`User ${userId} last watched lesson for course ${courseId}: ${lastLessonId}`); */
  
        if (courseId === '0E5D3rrDvLtdJfPHqFUB') {
          setAeLesson(lastLessonId);
        } else if (courseId === 'hypnDNVZXujeVT8pwkL6') {
          setShortFormLesson(lastLessonId);
        } // add more else ifs in future
        
      } else {
        /* console.log(`User ${userId} has no record for course ${courseId}`); */
        return null;
      }
    } catch (error) {
      console.error('Error fetching lastLessonId:', error);
      return null;
    }
  };
  

  useEffect(() => {
    if (userId && isPremium) {
      const fetchCourses = async () => {
        try {
          const coursesRef = collection(db, 'courses');
          const snapshot = await getDocs(coursesRef);
          const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          // Fetch lessons for each course
          const coursesWithLessons = await Promise.all(
            coursesData.map(async (course) => {
              const lessonsRef = collection(coursesRef, course.id, 'lessons');
              const lessonsSnapshot = await getDocs(lessonsRef);
              const lessonsData = lessonsSnapshot.docs.map((lessonDoc) => ({
                id: lessonDoc.id,
                ...lessonDoc.data(),
              }));

              if (userId && isPremium ) {
                const AeLastLessonId = await fetchLastLessonId(userId, '0E5D3rrDvLtdJfPHqFUB');
                const ShortFormlastLessonId = await fetchLastLessonId(userId, 'hypnDNVZXujeVT8pwkL6');
              }

              return { ...course, lessons: lessonsData };
            })
          );

          setCourses(coursesWithLessons);
        } catch (error: any) {
          message.error('Error fetching courses:', error);
        }
      };

      fetchCourses();
    }
  }, [userId, AeLastLesson, shortformLastLesson, isPremium]);
  


  return (
    <div className='flex flex-col md:flex-row gap-5'>
      {courses.map((course) => (
        <Course key={course.id} course={course} aeLesson={aeLesson} shortFormLesson={shortFormLesson} />
      ))}
    </div>
  );
};

export default CourseLogic;
