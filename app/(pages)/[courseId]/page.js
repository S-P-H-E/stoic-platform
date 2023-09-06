"use client"

import { useEffect } from 'react';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { BsArrowLeftShort } from 'react-icons/bs';
import Lesson from '@/components/Lesson';
import Head from 'next/head';
import Comments from '@/components/Comments';

/* interface Course {
  id: string;
  name: string;
  description: string;
}

interface LessonData {
  id: string;
  name: string;
  message: string;
  link: string;
}


interface CourseLessonsProps {
  course: Course | null;
  lessons: LessonData[];
} */

export default function CourseLessons({ course, lessons }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const { courseId } = router.query;

  return (
    <>
      <Head>
        {course && (
          <title>{course.name}</title>
        )}
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-start items-center">
        <div className="w-full md:w-[1200px] p-10">
          <div className='flex justify-between items-center'>
            <div className='bg-[#252525] w-fit rounded-full p-1 cursor-pointer' onClick={() => { window.location.href = '/dashboard'; }}>
              <BsArrowLeftShort size={30}/>
            </div>
          </div>
          <div className='py-10 flex flex-col gap-6'>
            {course ? (
              <>
                <h1 className='text-5xl md:text-8xl'>{course.name}</h1>
                <p className='md:text-xl text-[var(--gray1)]'>{course.description}</p>
              </>
            ) : (
              <>
                <div className='skeleton-heading'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-description'></div>
              </>
            )}
            <div className='flex flex-col gap-4'>
              {lessons ? (
                lessons.map((lesson, index) => (
                  <Lesson
                    key={lesson.id}
                    name={lesson.name}
                    message={lesson.message} // THIS IS SO GAY
                    link={lesson.link}
                    index={index}
                    courseId={courseId}
                    lessonId={lesson.id}
                  />
                ))
              ) : (
                <>
                  <div className='skeleton-row-lesson'></div>
                  <div className='skeleton-row-lesson'></div>
                </>
              )}
            </div>
            <Comments courseId={courseId} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { courseId } = context.params;
    const courseDocRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseDocRef);
    const course = courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;

    const lessonsRef = collection(db, 'courses', courseId, 'lessons');
    const snapshot = await getDocs(lessonsRef);
    const lessonsData = snapshot.docs.map((doc) => doc.data());

    return {
      props: {
        course,
        lessons: lessonsData,
      },
    };
  } catch (error) {
    console.error('Error fetching course data:', error);
    return {
      props: {
        course: null,
        lessons: [],
      },
    };
  }
}
