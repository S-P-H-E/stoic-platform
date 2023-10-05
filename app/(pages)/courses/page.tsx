"use client"
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function Courses() {
    const router = useRouter()
    const { userId, userStatus } = UserDataFetcher()
    const isPremium = userStatus === 'user' || userStatus === 'admin'

    const [courses, setCourses] = useState<Array<any>>([]);
    const [userCourses, setUserCourses] = useState<Array<any>>([]);

    function truncateText(text: string, maxLength: number) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }
    
    const fetchLastLessonId = useCallback(async (userId: string | null) => {
      try {
        const userCoursesRef = collection(db, 'users', String(userId), 'courses');
        const userCoursesSnapshot = await getDocs(userCoursesRef);
  
        const userCoursesData = userCoursesSnapshot.docs.map((userCourseDoc) => ({
          id: userCourseDoc.id,
          ...userCourseDoc.data(),
        }));
  
        setUserCourses(userCoursesData);
  
        console.log('User Courses:', userCoursesData);
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    }, []);


    const fetchCourses = useCallback(async () => {
      if (userId && isPremium) {
        try {
          const coursesRef = collection(db, 'courses');
    
          const unsubscribe = onSnapshot(coursesRef, async (snapshot) => {
            const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
            const coursesWithLessons = await Promise.all(
              coursesData.map(async (course) => {
                const lessonsRef = collection(db, 'courses', course.id, 'lessons');
                const lessonsSnapshot = await getDocs(query(lessonsRef, orderBy('order')));
    
                // Get the first lesson by sorting based on the "order" field
                const firstLesson = lessonsSnapshot.docs[0];
    
                return {
                  ...course,
                  firstLesson: firstLesson ? { id: firstLesson.id, ...firstLesson.data() } : null,
                };
              })
            );
    
            setCourses(coursesWithLessons);
            console.log(coursesWithLessons); // Log the fetched data
          });
    
          return () => {
            unsubscribe();
          };
        } catch (err) {
          console.log(err);
        }
      }
    }, [userId, isPremium]);
    
    useEffect(() => {
      fetchCourses();
      fetchLastLessonId(userId)
    }, [fetchCourses, fetchLastLessonId, userId]);

    return (
        <div className='h-screen flex flex-col gap-4 p-8 md:px-16'>
            <h1 className='text-3xl font-semibold'>Courses</h1>


            <div className='flex flex-col gap-4'>
              {courses.map((course) => (
                <Link href={`/${course.id}/${course.firstLesson.id}`} key={course.id} className="flex flex-col w-fit bg-white text-black rounded-xl p-4">
                  <p>{truncateText(course.name, 35)}</p>
                  <p>{truncateText(course.description, 40)}</p>
                </Link>
              ))}
            </div>
        </div>
    );
}
