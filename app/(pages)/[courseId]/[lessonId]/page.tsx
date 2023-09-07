"use client"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { BsChevronLeft } from 'react-icons/bs'
import Link from 'next/link';
import Search from '@/components/Search/page';
import Script from 'next/script';
import Comments from '@/components/Comments';

interface LessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<any | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  let currentLessonIndex = -1;
  
  const pathname = usePathname();

  console.log('Current pathname: ' + pathname)

  useEffect(() => {

    const fetchLessonData = async () => {
      try {
        if (courseId && lessonId) {
          const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonId as string);
          const lessonDocSnap = await getDoc(lessonDocRef);

          if (lessonDocSnap.exists()) {
            const lessonData = lessonDocSnap.data();
            setLesson(lessonData);
          } else {
            console.error('Lesson not found');
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:' + error);
      }
    };

    const fetchLessonsForCourse = async () => {
      try {
        if (courseId) {
          const lessonsRef = collection(db, 'courses', courseId as string, 'lessons');
          const q = query(lessonsRef);
          const querySnapshot = await getDocs(q);

          const lessonsData: LessonItem[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            order: doc.data().order,
          }));
          lessonsData.sort((a, b) => a.order - b.order);
          
          setLessons(lessonsData);
        } else {
          console.log('Course Id not found')
        }
      } catch (error) {
        console.error('Error fetching lessons:' + error);
      }
    };

    fetchLessonData();
    fetchLessonsForCourse();
  }, [courseId, lessonId]);

  if (!lesson || !lessons) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="px-10 pt-10 flex justify-between items-center gap-6 w-full">
        <Link href={'/dashboard'} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
            <BsChevronLeft/>
            <h1 className="text-lg">Go back</h1>
        </Link>
        <Search />
      </div>

      <div className="flex p-10">
        <div>
            <>
              <div className='w-[1024px] h-[576px] rounded-3xl shadow-2xl shadow-white/10'>
                <iframe
                  src={lesson.url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', borderRadius: '20px' }}
                  /* title="AE - Episode 1" */
                />
              </div>
              <Script src="https://player.vimeo.com/api/player.js" />

              <div className='my-5 mb-20 border border-[#1E1E1E] rounded-2xl p-5'>
                <h1 className='text-3xl font-medium'>{lesson.title}</h1>
                <p className='rounded-xl mt-3'>{lesson.description}</p>
              </div>
              <Comments courseId={courseId as string} />
            </>
        </div>

        <div>
          <div className='flex flex-col gap-5'>
          {lessons.map((lessonItem, index) => (
            <Link href={`/${courseId}/${lessonItem.id}`} key={index} className='cursor-pointer'>
                <div className={`mx-5 px-3 py-3 rounded-2xl transition-all border border-[#1E1E1E] hover:scale-105 cursor-pointer flex justify-start items-center gap-2 ${index === currentLessonIndex ? 'bg-[#1E1D1E]' : ''}`}>
                    <p className='text-3xl font-mono rounded-full p-2 px-4'>{lessonItem.order as unknown as string}</p>
                    <h1 className='text-xl font-medium'>{lessonItem.title}</h1>
                </div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
