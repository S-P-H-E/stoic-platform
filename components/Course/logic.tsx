"use client"

import { FC, useEffect, useState } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Course from './page';
import { UserDataFetcher } from '@/utils/userDataFetcher';

// Define the DashboardProps interface
interface CourseLogicProps {
  courses: Array<any>; // Ensure that courses is always an array
}
interface CourseData {
  id: string;
}

// Define the Dashboard functional component
const CourseLogic: FC<CourseLogicProps> = () => {
  // State to store the fetched courses
  const [courses, setCourses] = useState<Array<any>>([]);
  const [LessonToGo, setLessonToGo] = useState<any>(null)
  const {userId, userLastCourse, userLastLesson} = UserDataFetcher();
  console.log("The last lesson of the user is:" + userLastLesson)
  console.log("The last course of the user is:" + userLastCourse)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


        // Fetch lessons for each course
        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            const lessonsRef = collection(coursesRef, course.id, 'lessons'); // Adjust the path to your lessons collection
            console.log(course.id)
            const lessonsSnapshot = await getDocs(lessonsRef);
            const lessonsData = lessonsSnapshot.docs.map((lessonDoc) => ({
              id: lessonDoc.id,
              ...lessonDoc.data(),
            }));
            
            let lessonToGo
            // check if the user has last lesson here in future
            if (userLastCourse && userLastLesson) {
              lessonToGo = userLastLesson
              setLessonToGo(lessonToGo);


              console.log('last lesson' + lessonToGo);
              console.log('initial lesson' + lessonsData[0]);
            } else {
              if (course.id == '0E5D3rrDvLtdJfPHqFUB') {
                lessonToGo = '57ALYHAF74nRUw4sKuEG'
                setLessonToGo(lessonToGo);
              } else if (course.id == 'hypnDNVZXujeVT8pwkL6') {
                lessonToGo = '2KLESohi8Qpvz9uKEc08'
                setLessonToGo('2KLESohi8Qpvz9uKEc08')
              }
              setLessonToGo(lessonToGo)
            }

            return { ...course, lessons: lessonsData, lessonToGo };
          })
        );

        setCourses(coursesWithLessons);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userLastCourse, userLastLesson]);

  useEffect(() => {
    console.log('state last lesson:' + LessonToGo);
  }, [LessonToGo]);

  return (
    <div className='flex flex-col md:flex-row gap-5'>
      {courses.map((course) => (
        <Course key={course.id} course={course} lesson={LessonToGo} />
      ))}
    </div>
  );
};

export default CourseLogic;
