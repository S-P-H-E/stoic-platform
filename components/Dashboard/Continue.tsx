'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Link from 'next/link';
import clsx from 'clsx';
import { ButtonShad } from '../ui/buttonshad';
import { FaEye } from 'react-icons/fa';
import Image from 'next/image';
import WavePattern from '@/public/wave.webp';
import { Play } from 'lucide-react';
import { RingLoader } from 'react-spinners';

interface ContinueProp {
  user: User;
  allowedToFetch: boolean;
}

export default function Continue({ user, allowedToFetch }: ContinueProp) {
  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);

      if (user.generalLastLesson && user.generalLastCourse && allowedToFetch) {
        const lessonDocRef = doc(
          db,
          'courses',
          user.generalLastCourse,
          'lessons',
          user.generalLastLesson
        );
        const courseDocRef = doc(db, 'courses', user.generalLastCourse);

        const lessonUnsubscribe = onSnapshot(lessonDocRef, (lessonDocSnap) => {
          if (lessonDocSnap.exists()) {
            const lessonData = lessonDocSnap.data();
            setLessonData(lessonData);
          }
        });

        const courseUnsubscribe = onSnapshot(courseDocRef, (courseDocSnap) => {
          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            setCourseData(courseData);
          }
        });

        return () => {
          lessonUnsubscribe();
          courseUnsubscribe();
        };
      }
    } catch {
      console.error('Error while fetching last course');
    } finally {
      setLoading(false);
    }
  }, [allowedToFetch, user.generalLastLesson, user.generalLastCourse]);

  // ! CHECK NEW WHITE VARIANT ON BUTTON AND CONTINUE
  return (
    <>
      <div
        className={clsx(
          'bg-darkgray relative group justify-between border overflow-hidden border-border hover:border-highlight w-full h-60 rounded-lg flex gap-4 hover:bg-border transition',
          loading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-col gap-4 justify-center p-8 z-30">
          {user.generalLastCourse && user.generalLastLesson ? (
            !loading && courseData && lessonData ? (
              <>
                <div className="flex flex-col ">
                  <p className="text-sm md:text-base">
                    {courseData.name ? courseData.name : 'Loading...'}
                  </p>
                  <h1 className="text-5xl font-semibold">
                    {lessonData.title ? lessonData.title : 'Loading...'}
                  </h1>
                </div>

                <Link
                  href={`courses/${user.generalLastCourse}/${user.generalLastLesson}`}
                  className="w-fit z-30"
                >
                  <ButtonShad
                    variant="secondary"
                    className="gap-2 font-semibold text-black hover:scale-105 border border-white active:scale-95 transition duration-300"
                  >
                    <FaEye />
                    Continue watching
                  </ButtonShad>
                </Link>
              </>
            ) : (
              <RingLoader color="#fff" size={80}/>
            )
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="line-clamp-1 text-xl">
                  Hello, {user.name ? user.name : 'Loading...'}
                </p>
                <h1 className="text-2xl font-semibold">
                  You havent watched any lessons yet.
                </h1>
              </div>
            
            <Link
              href={"courses"}
              className="w-fit z-30"
              >
                <ButtonShad
                  variant="secondary"
                  className="gap-2 font-semibold text-black hover:scale-105 border border-white active:scale-95 transition duration-300"
                >
                <Play size={16} />
                  Start learning
              </ButtonShad>
            </Link>
          </div>
          )}
        </div>

        <div className="relative hidden lg:flex w-1/2 h-full z-20">
          <div className="h-full w-full bg-gradient-to-r from-black to-transparent absolute inset-0 z-20" />
          {user.generalLastCourse && user.generalLastLesson ? (
            courseData &&
            courseData.image && !loading && (
               <Image
                alt="Course Image"
                className="object-cover grayscale group-hover:grayscale-0 brightness-105 group-hover:brightness-125 transition duration-500 z-10"
                fill
                quality={95}
                src={courseData.image}
              />
            )
          ) : (
            <div className="w-full h-full flex justify-center items-center absolute inset-0 bg-black z-10">
              <p>You havent watched any courses</p>
            </div>
          )}
          <div className='w-full h-full bg-border animate-pulse absolute inset-0'/>
        </div>

        <div className="h-full w-full hidden lg:flex bg-gradient-to-l from-black via-black to-transparent absolute inset-0 z-10" />

        <div className="h-full w-full absolute inset-0">
          <Image
            alt="Wave pattern"
            src={WavePattern}
            fill
            className="brightness-[.3] group-hover:brightness-[.65] transition duration-500 object-cover"
            placeholder="blur"
          />
        </div>

        <div className="w-full h-1/2 mt-auto absolute inset-0 z-20 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>
    </>
  );
}
