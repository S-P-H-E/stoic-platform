import CreateCourse from '@/components/Course/CreateCourse/page';
import Courses from './../../../components/Course/Courses';

export default function CoursesPage() {

  return (
    <div className='h-full flex p-10 md:p-16 justify-between items-start w-full'>
      <div className='flex flex-col gap-4 md:gap-10 w-full'>
        <h1 className='text-3xl font-semibold'>Courses</h1>
        <CreateCourse className='md:hidden'/>
        <Courses/>
      </div>
      <CreateCourse className='md:block hidden'/>
    </div>
  );
}
