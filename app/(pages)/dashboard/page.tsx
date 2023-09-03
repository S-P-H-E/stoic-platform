"use client"

// Import necessary modules and components
import { UserDataFetcher } from "@/utils/userDataFetcher";
import Search from "@/components/Search/page";
import CourseLogic from "@/components/Course/logic";

// Define the Dashboard functional component
export default function Dashboard(){
  const { userName } = UserDataFetcher();

  return (
    <div>
      {/* Navbar */}
      <div className="p-10 flex justify-between items-center gap-6">
        <p className="text-xl">Hi, {userName ? userName : '...'}</p>
        <Search />
      </div>

      {/* Courses */}
      <div>
        <CourseLogic courses={[]} />
      </div>
    </div>
  );
}
