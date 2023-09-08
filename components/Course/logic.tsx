"use client"

import { FC, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Course from './page';
import { UserDataFetcher } from '@/utils/userDataFetcher';

// Define the DashboardProps interface
interface CourseLogicProps {
  courses: Array<any>; // Ensure that courses is always an array
}

// Define the Dashboard functional component
const CourseLogic: FC<CourseLogicProps> = () => {
  // State to store the fetched courses
  const [courses, setCourses] = useState<Array<any>>([]);
  const [LessonToGo, setLessonToGo] = useState<any>(null)
  
  const [aeLesson, setAeLesson] = useState<string>('')
  const [shortFormLesson, setShortFormLesson] = useState<string>('')

  const {userId, userLastCourse, userLastLesson} = UserDataFetcher();


  //CHECK USER ID SOON !VER Y IM PO R TANT 4HWFIJHEFKJ
  useEffect(() => {
    // Check if userId is available before fetching courses
    if (userId) {
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

              // check if the user has last lesson here in future
              if (userLastCourse && userLastLesson) {
              

              } else {
                const AeFirstLesson = '57ALYHAF74nRUw4sKuEG';
                const ShortFormFirstLesson = '2KLESohi8Qpvz9uKEc08';

                setAeLesson(AeFirstLesson);
                setShortFormLesson(ShortFormFirstLesson);
              }

              return { ...course, lessons: lessonsData };
            })
          );

          setCourses(coursesWithLessons);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };

      fetchCourses();
    }
  }, [userId, userLastCourse, userLastLesson, aeLesson, shortFormLesson]);

  return (
    <div className='flex flex-col md:flex-row gap-5'>
      {courses.map((course) => (
        <Course key={course.id} course={course} lesson={LessonToGo} aeLesson={aeLesson} shortFormLesson={shortFormLesson} />
      ))}
    </div>
  );
};

export default CourseLogic;
