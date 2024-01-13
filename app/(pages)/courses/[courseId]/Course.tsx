"use client"
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { useParams, useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { BiLoader } from 'react-icons/bi';

type Course = {
  name: string;
  description: string;
};

type Lesson = {
  description: string;
  order: number;
  thumbnail: string;
  title: string;
  url: string;
  id: string;
}

export default function CourseComponent() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonToGo, setLessonToGo] = useState<string | undefined>(undefined);
  const { user, userId, userStatus } = UserDataFetcher();

  const router = useRouter()

/*   if(lessons) {
    console.log(lessons)
  } */

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseDocSnap = await getDoc(courseDocRef);
        
        if (courseDocSnap.exists() && userId && (userStatus == 'admin' || userStatus == 'premium')) {
          const courseData = courseDocSnap.data() as Course;
          setCourse(courseData);

          const lessonsCollectionRef = collection(db, 'courses', courseId, 'lessons');
          const orderedLessonsQuery = query(lessonsCollectionRef, orderBy('order'));
          const lessonsQuerySnapshot = await getDocs(orderedLessonsQuery);

          const lessonData: Lesson[] = [];
          lessonsQuerySnapshot.forEach((lessonDoc) => {
            if (lessonDoc.exists()) {
              const lesson = { id: lessonDoc.id, ...lessonDoc.data() } as Lesson;
              lessonData.push(lesson);
            }
          });

          setLessons(lessonData);

          const userLastLessonRef = doc(db, 'users', userId, 'courses', courseId);
          const userLastLessonSnapshot = await getDoc(userLastLessonRef);

          if (userLastLessonSnapshot.exists()) {
            const userLastLessonData = userLastLessonSnapshot.data();
            /* console.log('User\'s last lesson:', userLastLessonData.lastLessonId); */

            setLessonToGo(userLastLessonData.lastLessonId)
            router.push(`/courses/${courseId}/${lessonToGo}`)
          } else {
            const firstLesson = lessonData.length > 0 ? lessonData.sort((a, b) => a.order - b.order)[0].id : undefined;
            setLessonToGo(firstLesson);
            router.push(`${courseId}/${firstLesson}`);
          }

        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

/*     const fetchLessonsData = async () => {
      try {
        const lessonsCollectionRef = collection(db, 'courses', courseId, 'lessons');
        const orderedLessonsQuery = query(lessonsCollectionRef, orderBy('order'));
        const lessonsQuerySnapshot = await getDocs(orderedLessonsQuery);

        console.log("Lesson Collection: ", lessonsCollectionRef)

        const lessonData: Lesson[] = [];

        lessonsQuerySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const lesson = doc.data() as Lesson;
            lessonData.push(lesson);
          }
        });

        setLessons(lessonData);

      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    }; */

    if (courseId && userId && userStatus == 'premium' || (userStatus == 'admin')) {
      try {
        fetchCourseData();
      } catch (error) {
        console.log(error)
      /* fetchLessonsData(); */
    }}

  }, [lessonToGo, courseId, user, userId, userStatus, router]);

/*   if(lessonToGo && courseId) {
    router.push(`/${lessonToGo}`)
  } */

  return (
    <div className='h-screen flex flex-col justify-center items-center text-2xl'>
      <h3>Loading...</h3>
      <div className='text-lg flex gap-2 items-center justify-center text-highlight'>
      <p>Loading {course?.name ? course.name : 'Course'}</p>
        <BiLoader className="animate-spin" />
      </div>
    </div>
  );
}