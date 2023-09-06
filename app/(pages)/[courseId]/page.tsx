"use client"

import { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, getDocs, Firestore, query, orderBy, where } from 'firebase/firestore'; // Import necessary functions
import Image from 'next/image';
import Script from 'next/script';
import { BsArrowLeftShort } from 'react-icons/bs';
import Lesson from '@/components/Lesson';
import Head from 'next/head';
import Comments from '@/components/Comments';
import { UserDataFetcher } from '@/utils/userDataFetcher';

// Define a type for the course data
type Course = {
  name: string;
  description: string; // You can add other fields here as needed
};

// Define a type for the lesson data
type Lesson = {
  title: string;
  description: string;
  active: boolean; // Add the "active" field
  url: string;
};

export default function CourseLessons({ }) {
  const { courseId } = useParams(); // Destructure courseId directly
  const [course, setCourse] = useState<Course | null>(null); // Initialize course as null
  const [lessons, setLessons] = useState<Lesson[]>([]); // Initialize lessons as an empty array
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null); // Initialize currentLesson as null

  useEffect(() => {
    // Function to fetch and set course data
    const fetchCourseData = async () => {
      try {
        const firestore = db; // Initialize Firestore instance (use your own initialization)
        const courseDocRef = doc(firestore, 'courses', courseId); // Replace 'your-collection-name' with the actual collection name
        const courseDocSnap = await getDoc(courseDocRef);
        
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data() as Course; // Type assertion
          setCourse(courseData);
        } else {
          // Handle the case where the course document doesn't exist
          console.error('Course not found');
        }
      } catch (error) {
        // Handle any errors that occur during fetching
        console.error('Error fetching course:', error);
      }
    };

    // Function to fetch and set lessons data
    const fetchLessonsData = async () => {
      try {
        const firestore = db; // Initialize Firestore instance (use your own initialization)
        const lessonsCollectionRef = collection(firestore, 'courses', courseId, 'lessons'); // Specify the correct path

        // Add an orderBy clause to order lessons by the "order" field
        const orderedLessonsQuery = query(lessonsCollectionRef, orderBy('order'));

        const lessonsQuerySnapshot = await getDocs(orderedLessonsQuery);

        const lessonData: Lesson[] = [];

        lessonsQuerySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const lesson = doc.data() as Lesson; // Type assertion
            lessonData.push(lesson);
          }
        });

        setLessons(lessonData);

        // Find the active lesson
        const activeLesson = lessonData.find((lesson) => lesson.active);

        if (activeLesson) {
          setCurrentLesson(activeLesson);
        }

      } catch (error) {
        // Handle any errors that occur during fetching
        console.error('Error fetching lessons:', error);
      }
    };

    // Call both functions to fetch course and lessons data when courseId changes
    if (courseId) {
      fetchCourseData();
      fetchLessonsData();
    }
  }, [courseId]);

  return (
    <>
      <div className="flex p-10">
        {/* <h1>{course?.name}</h1>
        <h1>{course?.description}</h1> */}
        <div>
          {currentLesson ? (
            <>
              <div className='w-[1024px] h-[576px]'>
                <iframe
                  src={currentLesson.url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%' }}
                  title="AE - Episode 1"
                />
              </div>
              <Script src="https://player.vimeo.com/api/player.js" />

              <div className='py-5'>
                <h1 className='text-3xl font-medium'>{currentLesson.title}</h1>
                <p>{currentLesson.description}</p>
              </div>
              <Comments courseId={courseId as string} />
            </>
          ) : (
            <p>No active lessons found</p>
          )}
          </div>

          <div>
          <div className='flex flex-col gap-5'>
            {lessons.map((lesson, index) => (
              <div key={index}>
                <div className='px-5'>
                  <h1 className='text-xl font-medium'>{lesson.title}</h1>
                  <p>{lesson.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </>
  );
}
