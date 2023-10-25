import CreateCourse from '@/components/Course/CreateCourse/page';
import Courses from './../../../components/Course/Courses';

export default function CoursesPage() {

  return (
    <div className='h-full flex p-10 md:p-16 justify-between items-start'>
      <div className='flex flex-col gap-10'>
        <h1 className='text-3xl font-semibold'>Courses</h1>
          <Courses/>
      </div>
        <CreateCourse/>
    </div>
  );
}
