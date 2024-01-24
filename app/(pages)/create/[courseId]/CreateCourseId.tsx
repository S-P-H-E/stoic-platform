import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Lesson } from '@/types/types';
import { fetchSingleCourse } from '@/utils/getFirestore';
import Image from 'next/image';
import { RingLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { ButtonShad } from '@/components/ui/buttonshad';
import { FaArrowLeft, FaPen, FaTrash } from 'react-icons/fa6';
import LessonCardView from '@/components/Create/LessonCardView';
import Link from 'next/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MdCancel } from 'react-icons/md';
import { deleteCourse } from '@/utils/updateFirestore';
import { message } from 'antd';
import { deleteDoc } from 'firebase/firestore';

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

  const handleCourseDelete = async () => {
    try {
      if (courseId) {
        await deleteCourse(userStatus, courseId);
        message.warning('The course has been permanently deleted.')
        router.push('/create')
      } else {
        message.error("The course either doesn't exist or has been already deleted.")
      }

    } catch (error: any) {
      console.error('Error deleting course:', error.message);
    }
  }

  return (
    <div className="h-full flex flex-col w-full relative mx-auto max-w-7xl lg:py-10 gap-4 lg:px-16 md:p-6">
      <ButtonShad
        onClick={() => router.back()}
        className="w-fit justify-start items-center gap-2 z-10 mb-4 text-primary-foreground active:scale-90 transition"
        variant="link"
      >
        <FaArrowLeft />
        Go back
      </ButtonShad>
      <div className="shadow-2xl shadow-white/10 md:rounded-xl h-[40svh] md:h-[48svh] min-h-[12rem] overflow-hidden max-h-[40rem] relative">
        {course && course.image && !loading && (
          <>
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-bg/70 to-bg z-30" />
            <Image
              src={course.image}
              quality={99}
              priority
              fill
              alt="Course Image"
              className="z-10 object-cover"
            />
          </>
        )}
        <div className="p-3 flex lg:flex-row flex-col z-30 absolute bottom-0 w-full items-center justify-center md:justify-between text-center md:text-start">
          <div className="flex flex-col p-4">
            <h1 className="font-medium text-3xl md:text-4xl">
              {course?.name ? course.name : 'Loading...'}
            </h1>
            <p className="text-base md:text-xl opacity-70 md:opacity-60">
              {course?.description ? course.description : 'Loading...'}
            </p>
          </div>
          <div className="flex gap-3 items-center pr-4">
            <Link href={`/create/${course?.id}/edit`}>
              <ButtonShad
                variant="secondary"
                className="text-black gap-2 active:scale-90 transition"
              >
                <FaPen />
                Edit
              </ButtonShad>
            </Link>
            <Dialog>
              <DialogTrigger>
                <ButtonShad
                  variant="destructive"
                  className="text-white gap-2 active:scale-90 transition"
                >
                  <FaTrash />
                  Delete
                </ButtonShad>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col gap-4 p-8">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">
                      Are you sure you want to delete this course?
                    </h1>
                    <p className="text-highlight">
                      This action is irreversible. Are you sure you want to
                      delete this course?
                    </p>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <Dialog>
                      <DialogTrigger>
                        <ButtonShad
                          variant="destructive"
                          className="text-white gap-2 active:scale-90 transition"
                        >
                          <FaTrash />
                          Delete
                        </ButtonShad>
                      </DialogTrigger>
                      <DialogContent className="bg-red-950/90 max-w-xl">
                        <div className="flex flex-col gap-3 p-6">
                          <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold">
                              Are you <span className="underline">ACTUALLY</span> sure you want to delete the course?
                            </h1>
                            <p className="opacity-60">
                              Once you press delete, you will no longer be able to recover the data of {course?.name}, be careful.
                            </p>
                          </div>
                          <div className="flex gap-2 mt-5">
                            <DialogClose className="w-[74%]">
                              <ButtonShad
                                variant="secondary"
                                className="w-full text-black active:scale-90 transition"
                              >
                                Cancel
                              </ButtonShad>
                            </DialogClose>
                            <DialogClose>
                              <ButtonShad
                                variant="destructive"
                                onClick={handleCourseDelete}
                                className="hover:shadow-[0_0px_50px_rgba(2,_12,_24,_0.8)] text-white gap-2 active:scale-90 hover:bg-red-800 transition duration-300"
                              >
                                <FaTrash />
                                Yes, delete
                              </ButtonShad>
                            </DialogClose>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DialogClose>
                      <ButtonShad
                        variant="secondary"
                        className="text-black active:scale-90 transition"
                      >
                        Cancel
                      </ButtonShad>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full h-full bg-border animate-pulse" />
      </div>
      <div className="w-full p-4 flex flex-col gap-4 h-full justify-center">
        <div className="flex gap-4 items-center justify-between py-2 w-full">
          <h1 className="text-3xl font-medium">Current Lessons</h1>
          <Link href={`/create/lesson?courseId=${course?.id}`}>
            <ButtonShad
              className="active:scale-90 transition"
              variant="secondary"
            >
              Create Lesson
            </ButtonShad>
          </Link>
        </div>
        {course && course.lessons && !loading ? (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {course.lessons.map((lesson, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
              >
                <LessonCardView
                  isAdmin={isAdmin}
                  lesson={lesson}
                  course={course}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full h-80 flex flex-col gap-4 justify-center items-center">
            <RingLoader color="#fff" size={128} />
            <p className="animate-pulse opacity-60 text-lg">
              Please wait while we fetch the lessons...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
