// Import necessary modules and components
import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import Greeting from "@/components/Greeting";
import Search from "@/components/Search/page";

// Define the Dashboard functional component
export default function Dashboard(){

  return (
    <div>
      {/* Navbar */}
      <div className="p-10 flex justify-between items-center gap-6">
        <Greeting/>
        <Search />
      </div>
      {/* Courses */}
      <div className="p-10 flex flex-col gap-8">
        <Continue/>
        <CourseLogic courses={[]} />
      </div>
    </div>
  );
}
