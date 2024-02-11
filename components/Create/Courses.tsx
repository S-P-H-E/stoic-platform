import { Course } from '@/types/types';
import { fetchCourses } from '@/utils/getFirestore';
import React, { useEffect, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';

export default function Courses({
  userStatus,
  title,
  creationMode,
  predefinedCourses
}: {
  userStatus: string | undefined;
  title?: boolean;
  creationMode?: boolean;
  predefinedCourses?: Course[] | undefined | null;
}) {
  const [courses, setCourses] = useState<Array<Course> | null>(null);
  const [loading, setLoading] = useState(true);

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.055 * index,
      },
    }),
  };

  useEffect(() => {
    try {
      if(!predefinedCourses) {
        setLoading(true);

        const onUpdate = (updatedCourses: Array<Course>) => {
          setCourses(updatedCourses);
        };
  
        const unsubscribe = fetchCourses(userStatus, onUpdate);
        return () => {
          unsubscribe();
        };
      } else {
        setCourses(predefinedCourses);
      }
    } catch (error) {
      /*console.log(error);*/
    } finally {
      setLoading(false);
    }
  }, [userStatus, predefinedCourses]);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {title && <h1 className="text-2xl font-medium">Manage Courses</h1>}
      {loading || !courses ? (
        <div className="w-full h-80 justify-center items-center flex">
          <ScaleLoader color="#fff" width={10} height={75} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {courses.map((course, index) => (
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
              <CourseCard creationMode={creationMode ? creationMode : false} course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
