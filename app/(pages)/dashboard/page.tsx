import Continue from "@/components/Dashboard/Continue";
import Navbar from "@/components/Navbar";
import DateTime from "@/components/Dashboard/Date";
import Tools from "@/components/Dashboard/Tools";
import AllCourses from "@/components/Dashboard/AllCourses";

export default function Dashboard(){

  return (
    <div className="flex flex-col h-full w-full md:py-8 py-2 px-8 gap-4 overflow-hidden justify-center max-w-[1700px] mx-auto">
        {/* TOP BAR HERE */}
        <Navbar/>
        <div className="md:flex-row flex-col flex gap-4 justify-center">
          <div className="flex flex-col w-full max-w-[40rem] md:w-[37%] gap-4">
            <Continue/>
            <DateTime/>
          </div>
          <div className="flex flex-col w-full md:w-6/12 gap-4 justify-center">
            <Tools/>
            <AllCourses/>
          </div>
      </div>
    </div>
  );
}
