import Continue from "@/components/Continue";
import Navbar from "@/components/Navbar";
import DateTime from "@/components/Date";
import Tools from "@/components/Tools";
import AllCourses from "@/components/AllCourses";

export default function Dashboard(){

  return (
    <div className="flex flex-col h-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center">
        {/* TOP BAR HERE */}
        <Navbar/>
        <div className="md:flex-row flex-col flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[40rem] md:w-[37%] gap-4">
            <Continue/>
            <DateTime/>
          </div>
          <div className="flex flex-col w-full md:w-6/12 gap-4">
            <Tools/>
            <AllCourses/>
          </div>
      </div>
    </div>
  );
}
