"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { ButtonShad } from '@/components/ui/buttonshad';
import {motion, AnimatePresence} from 'framer-motion';
import { fetchSingleCourse } from '@/utils/getFirestore';
import { Course } from '@/types/types';
import unlockedCourseAnimation from '@/public/lottie/eye.json'
import LockedCourseAnimation from '@/public/lottie/vault.json'
import { Lock, PencilRuler, Unlock } from 'lucide-react';
import CourseCreateCard from '@/components/Create/CourseCreateCard';
import CourseCreateName from '@/components/Create/CourseCreateName';
import ConfettiComponent from '@/components/Confetti';
import CoursePreview from './../../../../components/Create/CoursePreview';
import Link from 'next/link';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";
import Unauthorized from "@/components/Unauthorized";
import PageLoader from "@/components/PageLoader";

interface CreateCoursePageProps {
  courseId: string | undefined;
  imageSrc: string | undefined;
  type: "locked" | "public";
  title: string | undefined;
  description: string | undefined;
  final: boolean | undefined;
}

export default function CreateCourseComponent({
  imageSrc,
  type,
  title,
  description,
  courseId,
  final
}: CreateCoursePageProps) {

  const { userStatus, userId } = UserDataFetcher();

  const allowedToFetch = isUserAllowedToFetch(userStatus)
  const isAdmin = userStatus === 'admin'

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  if (!isAdmin && userStatus) {
    router.push('/');
  }

  useEffect(() => {
    if (!isAdmin && !courseId && userStatus) {
      setCourse(null)
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

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if(isAdmin && userStatus) {
    return (
        <div className="h-full flex lg:py-10 lg:px-16 p-6 w-full relative">
          {courseId && type && title && final &&
              <div className="overflow-hidden absolute inset-0 p-4 w-full h-screen">
                <ConfettiComponent/>
              </div>
          }
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
            <div className="flex flex-col gap-2 items-start">
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-3xl">Create {type && capitalizeFirstLetter(type)} Course</h1>
                <p className="text-sm text-highlight">Add a new course to the platform.</p>
              </div>
              <ButtonShad onClick={() => router.back()} className="gap-2 z-10 mb-4 text-primary-foreground active:scale-90 transition" variant="link">
                <FaArrowLeft />
                Go back
              </ButtonShad>
            </div>

            <div className="relative flex flex-col gap-4">

              <AnimatePresence>
                {!type &&
                    <motion.div className="absolute inset-0 w-full h-full flex flex-col gap-8 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
                      <h1 className="text-center text-2xl md:text-3xl font-medium">Select the type of course you want to add</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                        <CourseCreateCard invert loop src={unlockedCourseAnimation} type="public" icon={<Unlock size={60}/>} title="Public Course" description="Create a new public course that everyone will be able to see right away"/>
                        <CourseCreateCard src={LockedCourseAnimation} type="locked" icon={<Lock size={60}/>} title="Locked Course" description="Create a new locked course that only admins will be able to see and edit"/>
                      </div>
                    </motion.div>
                }
              </AnimatePresence>

              <AnimatePresence>
                {type && !final &&
                    <motion.div className="absolute inset-0 w-full h-80 flex flex-col gap-8 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
                      <h1 className="text-center text-2xl md:text-3xl font-medium">{`Name your ${type} course`}</h1>
                      <div className="w-full h-full">
                        <CourseCreateName course={course} courseId={courseId} imageSrc={imageSrc} description={description} title={title} isAdmin={isAdmin} type={type}/>
                      </div>
                    </motion.div>
                }
              </AnimatePresence>

              <AnimatePresence>
                {courseId && imageSrc && type && title && final &&
                    <motion.div className="absolute inset-0 w-full h-80 flex flex-col gap-12 justify-center items-center py-4" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{ x: -100, opacity: 0}}>
                      <h1 className="text-center text-2xl md:text-3xl font-medium">{`Your ${type} course ${title} is now created`}</h1>
                      <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                        <CoursePreview courseId={courseId} title={title} description={description} imageSrc={imageSrc} type={type}/>

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
  } else if (userStatus && allowedToFetch) {
    return <Unauthorized/>
  } else {
    return <PageLoader/>
  }

}
