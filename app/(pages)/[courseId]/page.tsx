"use client"
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { BsChevronLeft } from 'react-icons/bs'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, where, addDoc } from 'firebase/firestore';
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
  id: string;
};

export default function CourseLessons() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const { user, userId } = UserDataFetcher();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

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

        console.log("LessonId: ", lessonsCollectionRef)

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

        // Set isLoading to false once data is fetched
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', userId);
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

    // Ensure that the user is logged in
    if (user) {
      const userEmail = user.email; // Get the user's email

      if (userEmail) {
        try {
          const userDocRef = doc(db, 'users', userEmail); // Use the user's email as the document ID
          const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessons[index].id);

          console.log('lessonDocRef:', lessonDocRef); // Add this log to check the lessonDocRef
          console.log('Selected Lesson ID:', lessons[index].id); // Log the selected lesson's ID

          const lessonDocSnap = await getDoc(lessonDocRef);

          console.log('lessonDocSnap.exists():', lessonDocSnap.exists()); // Add this log to check if the lesson document exists

          if (lessonDocSnap.exists()) {
            const lastLessonId = lessonDocSnap.id;
            console.log('Last Lesson ID:', lastLessonId);

            await setDoc(userDocRef, { lastlesson: lastLessonId }, { merge: true });
            // Use setDoc with merge:true to update or create the document if it doesn't exist.
          } else {
            console.error('Lesson document not found');
          }
        } catch (error) {
          console.error('Error updating lastlesson field:', error);
        }
      } else {
        console.error('User email is undefined'); // Handle the case where user email is undefined.
      }
    } else {
      console.error('User not logged in'); // Handle the case where the user is not logged in.
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="px-10 pt-10 flex justify-between items-center gap-6 w-full">
        <button onClick={() => router.back()} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
          <BsChevronLeft />
          <h3 className="text-lg">Go back</h3>
        </button>
        <Search />
      </div>

      <div className="flex p-10">
        <div>
          {isLoading ? (
            <>
              <div className='w-[1024px] h-[576px] bg-[#323232] mr-3 animate-pulse rounded-2xl'>
                {/* Loading skeleton for the video */}
              </div>

              <div className='py-5'>
                <h1 className='text-3xl font-medium bg-gray-300 animate-pulse'>
                  {/* Loading skeleton for title */}
                </h1>
                <p className='bg-gray-300 animate-pulse rounded-xl p-4 mt-3'>
                  {/* Loading skeleton for description */}
                </p>
              </div>

              {/* Loading skeleton for comments */}
              <Comments courseId={courseId as string} />
            </>
          ) : (
            <>
              <div className='w-[1024px] h-[576px]'>
                <iframe
                  src={lessons[currentLessonIndex].url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', borderRadius: '20px' }}
                  title="AE - Episode 1"
                />
              </div>

              <div className='py-5'>
                <h1 className='text-3xl font-medium'>
                  {lessons[currentLessonIndex].title}
                </h1>
                <p className='bg-[#181718] rounded-xl p-4 mt-3'>
                  {lessons[currentLessonIndex].description}
                </p>
              </div>

              <Comments courseId={courseId as string} />
            </>
          )}
        </div>

        <div>
          <div className='flex flex-col gap-5'>
            {isLoading ? (
              // Loading skeleton for lesson list
              <div className='w-[300px] h-[300px] bg-gray-300 animate-pulse rounded-2xl' />
            ) : (
              lessons.map((lesson, index) => (
                <div
                  key={index}
                  onClick={() => handleLessonClick(index)}
                >
                  <div
                    className={`mx-5 px-3 py-3 rounded-xl transition-all bg-[#181718] hover:bg-[#1E1D1E] cursor-pointer flex justify-start items-center gap-2 ${
                      index === currentLessonIndex ? 'bg-[#1E1D1E]' : ''
                    }`}
                  >
                    <p className='bg-[#2F2E30] rounded-full p-2 px-4'>
                      {lesson.order as unknown as string}
                    </p>
                    <h1 className='text-xl font-medium'>
                      {lesson.title}
                    </h1>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
