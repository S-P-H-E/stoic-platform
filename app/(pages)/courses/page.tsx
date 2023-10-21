import Courses from './../../../components/Course/Courses';

export default function CoursesPage() {

  return (
    <div className='h-full flex flex-col gap-10 p-8 md:px-16'>
      <h1 className='text-3xl font-semibold'>Courses</h1>
        <Courses/>
    </div>
  );
}
