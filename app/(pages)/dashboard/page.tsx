// Import necessary modules and components
import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import CreateCourse from "@/components/CreateCourse/page";
import Greeting from "@/components/Greeting";
import Search from "@/components/Search/page";
import UserImage from "@/components/UserImage";
import Link from "next/link";

// Define the Dashboard functional component
export default function Dashboard(){

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Navbar */}
      <div className="p-10 flex justify-between items-center gap-6 w-[1000px]">
        <Greeting/>
        <div className="flex justify-center items-center gap-3">
          <CreateCourse />
          <Search />
          <Link href={'/settings'} className="w-[50px] h-[50px] cursor-pointer">
            <UserImage />
          </Link>
        </div>
      </div>
      {/* Courses */}
      <div className="p-10 flex flex-col gap-8 w-[1000px]">
        <Continue/>
        <CourseLogic courses={[]} />
      </div>
    </div>
  );
}
