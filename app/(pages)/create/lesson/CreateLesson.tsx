import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { ButtonShad } from '@/components/ui/buttonshad';
import Courses from './../../../../components/Create/Courses';
import {motion, AnimatePresence} from 'framer-motion';
import { fetchSingleCourse } from '@/utils/getFirestore';
import { Course } from '@/types/types';
import LessonCard from '@/components/Create/LessonCard';
import TextLessonAnimation from '@/public/lottie/textLesson.json'
import VideoLessonAnimation from '@/public/lottie/videoLesson.json'
import { PencilRuler, Play, Type } from 'lucide-react';
import LessonCreateName from '@/components/Create/LessonCreateName';
import VideoForm from '@/components/Create/VideoForm';
import TextForm from '@/components/Create/TextForm';
import ConfettiComponent from './../../../../components/Confetti';
import LessonPreview from '@/components/Create/LessonPreview';
import Link from 'next/link';

interface CreateLessonPageProps {
  userStatus: string | undefined;
  userId: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  courseId: string | undefined;
  type: string | undefined;
  title: string | undefined;
  description: string | undefined;
  final: boolean | undefined;
  end: boolean | undefined;
}

export default function CreateLessonComponent({
  userStatus,
  userId,
  isAdmin,
  isPremium,
  courseId,
  type,
  end,
  title,
  description,
  final
}: CreateLessonPageProps) {

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastLessonOrder, setLastLessonOrder] = useState<number>(0);

  const router = useRouter();

  if (!isAdmin) {
    router.push('/');
  }

  useEffect(() => {
    if (!courseId || !isAdmin) {
      setCourse(null)
    } else {
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

  useEffect(() => {
    if (isAdmin && course && course.lessons) {
      const lastOrder = findLastLessonOrder(course);
      setLastLessonOrder(lastOrder);
    }
  }, [course, isAdmin]);

  function findLastLessonOrder(course: Course) {
    if (!course || !course.lessons || !Array.isArray(course.lessons) || course.lessons.length === 0) {
      return 0;
    }
  
    const maxOrder = course.lessons.reduce((max, lesson) => {
      const lessonOrder = typeof lesson.order === 'number' ? lesson.order + 1 : 0;
  
      return Math.max(max, lessonOrder);
    }, 0);
  
    return maxOrder;
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  return (
    <div className="h-full flex lg:py-10 lg:px-16 p-6 w-full relative">
      {courseId && type && title && course !== null && final && end &&
      <div className="overflow-hidden absolute inset-0 p-4 w-full h-screen">
        <ConfettiComponent/>
      </div>
      }
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-3xl">Create {type && capitalizeFirstLetter(type)} Lesson
            {courseId ?
            course && !loading ?  ` for ${course.name}`
            : ' for loading...' : null}
            </h1>
            <p className="text-sm text-highlight">Add a new lesson to a course.</p>
          </div>
          <ButtonShad onClick={() => router.back()} className="gap-2 z-10 mb-4 text-primary-foreground active:scale-90 transition" variant="link">
            <FaArrowLeft />
            Go back
          </ButtonShad>
        </div>

        <div className="relative flex flex-col gap-4">

        <AnimatePresence>
          {!courseId && !end &&
            <motion.div exit={{ x: -100, opacity: 0 }} className="absolute inset-0 w-full flex flex-col gap-8 justify-center items-center py-4">
              <h1 className="text-center text-2xl md:text-3xl font-medium">Select where you want to add the lesson to</h1>
              <Courses creationMode userStatus={userStatus}/>
            </motion.div>
          }
        </AnimatePresence>

        <AnimatePresence>
          {courseId && !type && !end && course !== null &&
            <motion.div className="absolute inset-0 w-full h-full flex flex-col gap-8 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
              <h1 className="text-center text-2xl md:text-3xl font-medium">Select the type of lesson you want to add</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                <LessonCard src={TextLessonAnimation} type="text" icon={<Type size={60}/>} title="Text Lesson" description="Create a new text lesson with the new text editor and ship it to the users in real-time" courseId={courseId}/>
                <LessonCard src={VideoLessonAnimation} type="video" icon={<Play size={60}/>} title="Video Lesson" description="Create a new video lesson using vimeo and ship it to the users in real-time" courseId={courseId}/>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <AnimatePresence>
          {courseId && type && course !== null && !end && !final &&
            <motion.div className="absolute inset-0 w-full h-80 flex flex-col gap-8 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
              <h1 className="text-center text-2xl md:text-3xl font-medium">{`Name your ${type} lesson`}</h1>
              <div className="w-full h-full">
                <LessonCreateName description={description} title={title} isAdmin={isAdmin} courseId={courseId} type={type}/>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <AnimatePresence>
          {courseId && type && title && course !== null && final && !end &&
            <motion.div className="absolute inset-0 w-full h-80 flex flex-col gap-8 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
              <h1 className="text-center text-2xl md:text-3xl font-medium">{`Configure your ${type} lesson`}</h1>
              <div className="w-full h-full">
                {type === 'text' &&
                  <TextForm course={course} courseOrder={lastLessonOrder} isAdmin={isAdmin} courseId={courseId} type={type} title={title} description={description} final={final}/>
                } 
                {type == 'video' &&
                  <VideoForm course={course} courseOrder={lastLessonOrder} isAdmin={isAdmin} courseId={courseId} type={type} title={title} description={description} final={final}/>
                }
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <AnimatePresence>
          {courseId && type && title && course !== null && final && end &&
            <motion.div className="absolute inset-0 w-full h-80 flex flex-col gap-12 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
              <h1 className="text-center text-2xl md:text-3xl font-medium">{`Your ${type} lesson ${title} is now live!`}</h1>
              <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                <LessonPreview courseId={courseId} title={title} description={description} type={type}/>

                <Link
                  href="/create"
                  className='text-base group active:scale-95 relative group flex p-3 w-48 duration-300 justify-start font-medium cursor-pointer hover:text-white rounded-lg transition'
                >
                  <div className="flex items-center flex-1 z-10">
                    <PencilRuler className='h-5 w-5 mr-3'/>
                    <h2>Return to Create</h2>
                  </div>
                  <div className="rounded-lg shadow-[0_0px_50px_rgba(8,_112,_184,_0.6)] duration-300 transition bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400 via-fuchsia-600 to-orange-600 absolute w-full h-full inset-0 opacity-100 group-hover:opacity-90"/>
                </Link>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
