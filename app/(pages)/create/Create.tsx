import React, { useEffect, useState } from 'react'
import {useRouter} from 'next/navigation'
import AdminCard from '@/components/Create/AdminCard';
import Courses from '@/components/Create/Courses';
import { FaBook } from 'react-icons/fa';
import { LibraryIcon } from 'lucide-react';
import { fetchCourses } from '@/utils/getFirestore';
import { Course, Lesson } from '@/types/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import LessonCardView from '@/components/Create/LessonCardView';

interface CreatePageProps {
  userStatus: string | undefined;
  userId: string | null;
  isAdmin: boolean;
  isPremium: boolean;
}

export default function CreateComponent({userStatus, userId, isAdmin, isPremium}: CreatePageProps) {

  const router = useRouter()

  const [loading, isLoading] = useState(true);
    
  const [courses, setCourses] = useState<Array<Course> | null>(null);

  if (!isAdmin) {
    router.push('/')
  }

  useEffect(() => {
    try {
        isLoading(true);

        const onUpdate = (updatedCourses: Array<Course>) => {
          setCourses(updatedCourses);
        };
  
        const unsubscribe = fetchCourses(userStatus, onUpdate);
        return () => {
          unsubscribe();
        };
    } catch (error) {
      console.log(error);
    } finally {
      isLoading(false);
    }
  }, [userStatus]);

  const allLessons: Lesson[] = courses?.flatMap((course) =>
  course.lessons
    ? course.lessons.map((lesson) => ({ ...lesson, courseId: course.id }))
    : []
) || [];

  return (
    <div className='h-full flex lg:py-10 lg:px-16 p-6 w-full relative'>
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        <h1 className="text-3xl font-semibold">Create</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <AdminCard icon={
          <div className='border-2 border-white rounded'>
            <LibraryIcon />
          </div>
          } gradient2 href="/create/course" title="Create Course" description="Create a new course and and customize it's settings to tailor it to your specific requirements."/>
          <AdminCard icon={<FaBook size={32} />} href="/create/lesson" title="Create Lesson" description="Craft a new lesson and seamlessly integrate it into the existing course structure."/>
        </div>
        <Courses title predefinedCourses={courses} userStatus={userStatus}/>
{/*         <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">Other Utilities</h1>
          <div className="grid grid-cols-2">
            Work in progress...
          </div>
        </div> */}
      <div className='flex flex-col gap-3 w-full px-10 xl:p-4'>
          <h1 className="text-2xl font-medium">Manage Lessons</h1>
          <Carousel>
            <CarouselContent>
              {allLessons && allLessons.map((lesson, index) => (
                <CarouselItem key={index} className="lg:basis-1/2 xl:basis-1/3">
                  <LessonCardView courseIdProp={lesson.courseId} isAdmin={isAdmin} lesson={lesson}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  )
}
