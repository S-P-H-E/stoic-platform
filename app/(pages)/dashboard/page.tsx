import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import CreateCourse from "@/components/CreateCourse/page";

export default function Dashboard(){

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {/* Navbar */}

        {/* Courses */}
        <div className=" p-5 md:p-10 flex flex-col gap-8 w-full md:w-[1000px]">
            <div className="grid md:hidden w-full">
              <CreateCourse />
            </div>
          <Continue/>
          <CourseLogic courses={[]} />
        </div>
      </div>
    </>
  );
}
