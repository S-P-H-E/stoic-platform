"use client"
import { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { BsChevronLeft } from 'react-icons/bs'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, getDocs, setDoc, Firestore, query, orderBy, where } from 'firebase/firestore';
import Image from 'next/image';
import Script from 'next/script';
import { BsArrowLeftShort } from 'react-icons/bs';
import Lesson from '@/components/Lesson';
import Comments from '@/components/Comments';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Search from "@/components/Search/page";

type Course = {
  name: string;
  description: string;
};

type Lesson = {
  title: string;
  description: string;
  url: string;
  order: number;
};

export default function CourseLessons() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const { userName } = UserDataFetcher();
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseDocSnap = await getDoc(courseDocRef);
        
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data() as Course;
          setCourse(courseData);
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    const fetchLessonsData = async () => {
      try {
        const lessonsCollectionRef = collection(db, 'courses', courseId, 'lessons');
        const orderedLessonsQuery = query(lessonsCollectionRef, orderBy('order'));
        const lessonsQuerySnapshot = await getDocs(orderedLessonsQuery);

        const lessonData: Lesson[] = [];

        lessonsQuerySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const lesson = doc.data() as Lesson;
            lessonData.push(lesson);
          }
        });

        setLessons(lessonData);

        // Default to opening the first lesson
        if (lessonData.length > 0) {
          setCurrentLessonIndex(0);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (courseId) {
      fetchCourseData();
      fetchLessonsData();
      fetchUserData();
    }
  }, [courseId]);

  const handleLessonClick = async (index: number) => {
    setCurrentLessonIndex(index);

    // Update the "lastlesson" field in the user's collection
    if (userData) {
      try {
        const userDocRef = doc(db, 'users', );
        await setDoc(userDocRef, { lastlesson: lessons[index].id }, { merge: true });
        // Note: You'll need to make sure your Lesson documents have an "id" field or modify this part accordingly.
      } catch (error) {
        console.error('Error updating lastlesson field:', error);
      }
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="p-10 flex justify-between items-center gap-6 w-full">
        <button onClick={() => router.back()} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
        <BsChevronLeft/>
            <h3 className="text-lg">Go back</h3>
        </button>
        <Search />
      </div>

      <div className="flex p-10">
        <div>
          {currentLessonIndex !== null && lessons.length > 0 ? (
            <>
              <div className='w-[1024px] h-[576px]'>
                <iframe
                  src={lessons[currentLessonIndex].url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', borderRadius: '20px' }}
                  title="AE - Episode 1"
                />
              </div>
              <Script src="https://player.vimeo.com/api/player.js" />

              <div className='py-5'>
                <h1 className='text-3xl font-medium'>{lessons[currentLessonIndex].title}</h1>
                <p className='bg-[#181718] rounded-xl p-4 mt-3'>{lessons[currentLessonIndex].description}</p>
              </div>
              <Comments courseId={courseId as string} /> {/* Pass courseId to the Comments component */}
            </>
          ) : (
            <p>No active lessons found</p>
          )}
        </div>

        <div>
          <div className='flex flex-col gap-5'>
            {lessons.map((lesson, index) => (
              <div key={index} onClick={() => handleLessonClick(index)}>
                <div className={`mx-5 px-3 py-3 rounded-xl transition-all bg-[#181718] hover:bg-[#1E1D1E] cursor-pointer flex justify-start items-center gap-2 ${index === currentLessonIndex ? 'bg-[#1E1D1E]' : ''}`}>
                  <p className='bg-[#2F2E30] rounded-full p-2 px-4'>{lesson.order as unknown as string}</p>
                  <h1 className='text-xl font-medium'>{lesson.title}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}