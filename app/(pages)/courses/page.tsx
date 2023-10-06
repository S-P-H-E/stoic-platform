import Courses from './../../../components/Course/Courses';

export default function CoursesPage() {

  return (
    <div className='h-screen flex flex-col gap-4 p-8 md:px-16'>
      <h1 className='text-3xl font-semibold'>Courses</h1>
        <Courses/>
    </div>
  );
}
