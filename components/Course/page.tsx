import { BsArrowRightShort } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface CourseProps {
    course?: any
    lesson?: any
  }

const Course: FC<CourseProps> = ({ course, lesson }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${course.id}/${lesson.id}`);
  };

  return (
    <div className='bg-gradient-to-t from-[#181818] border border-[#3030307a] to-50% p-4 rounded-2xl md:w-[500px] h-[200px] flex flex-col justify-end cursor-pointer transition-all active:scale-105 md:hover:scale-105' onClick={handleClick}>
      <h1 className='text-2xl md:text-3xl font-medium text-start'>{course.name}</h1>
      <p className='text-[#8c8c8c]'>{course.description}</p>
    </div>
  );
}

export default Course
