import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Lesson } from '@/types/types';
import { fetchSingleCourse } from '@/utils/getFirestore';
import Image from 'next/image';
import { RingLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { ButtonShad } from '@/components/ui/buttonshad';
import { FaArrowLeft, FaPen } from 'react-icons/fa6';
import LessonCardView from '@/components/Create/LessonCardView';
import Link from 'next/link';

interface CreateCourseIdComponentProps {
  userStatus: string | undefined;
  userId: string | null;
  courseId: string | undefined;
  isAdmin: boolean;
  isPremium: boolean;
}

export default function CreateCourseIdComponent({
  userStatus,
  userId,
  courseId,
  isAdmin,
  isPremium,
}: CreateCourseIdComponentProps) {
  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  if (!isAdmin) {
    router.push('/');
  }

  useEffect(() => {
    if (!isAdmin && !courseId) {
      setCourse(null);
    } else if (courseId) {
      try {
        setLoading(true);

        const onUpdate = (updatedCourse: Course | null) => {
          setCourse(updatedCourse);
        };

        const unsubscribe = fetchSingleCourse(userStatus, courseId, onUpdate);
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [userStatus, courseId, isAdmin]);

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * index,
      },
    }),
  };
  
  return (
  <div className="h-full flex flex-col w-full relative mx-auto max-w-7xl lg:py-10 gap-4 lg:px-16 md:p-6">
    <ButtonShad onClick={() => router.back()} className="w-fit justify-start items-center gap-2 z-10 mb-4 text-primary-foreground active:scale-90 transition" variant="link">
      <FaArrowLeft />
      Go back
    </ButtonShad>
    <div className="shadow-2xl shadow-white/10 md:rounded-xl h-[40svh] md:h-[48svh] min-h-[12rem] overflow-hidden max-h-[40rem] relative">
      {course && course.image && !loading &&
      <>
        <div className='absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-bg/70 to-bg z-30'/>
        <Image src={course.image } quality={99} priority fill alt='Course Image' className='z-10 object-cover'/>
      </>
      }
      <div className="p-3 flex md:flex-row flex-col z-30 absolute bottom-0 w-full items-center justify-center md:justify-between text-center md:text-start">
        <div className="flex flex-col p-4">
          <h1 className="font-medium text-3xl md:text-4xl">{course?.name ? course.name : 'Loading...'}</h1>
          <p className="text-base md:text-xl opacity-70 md:opacity-60">{course?.description ? course.description : 'Loading...'}</p>
        </div>
        <Link href={`/create/${course?.id}/edit`} className="order-first md:order-last pr-4">
          <ButtonShad variant="secondary" className="text-black gap-2 active:scale-90 transition">
            <FaPen/>
            Edit
        </ButtonShad>
        </Link>
      </div>
      <div className="w-full h-full bg-border animate-pulse"/>
    </div>
    <div className="w-full p-4 flex flex-col gap-4 h-full justify-center">
      <div className="flex gap-4 items-center justify-between py-2 w-full">
        <h1 className='text-3xl font-medium'>Current Lessons</h1>
        <Link href={`/create/lesson?courseId=${course?.id}`}>
          <ButtonShad className="active:scale-90 transition" variant="secondary">Create Lesson</ButtonShad>
        </Link>
      </div>
      {course && course.lessons && !loading ?
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {course.lessons.map((lesson, index) => (
            <motion.div
            key={index}
            custom={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true
            }}
            >
              <LessonCardView isAdmin={isAdmin} lesson={lesson} course={course}/>
            </motion.div>
          ))}
        </div>
      :
        <div className="w-full h-80 flex flex-col gap-4 justify-center items-center">
          <RingLoader color="#fff" size={128}/>
          <p className="animate-pulse opacity-60 text-lg">Please wait while we fetch the lessons...</p>
        </div>
      }
    </div>
  </div>
  )
}
