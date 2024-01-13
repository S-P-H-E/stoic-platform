import UserImage from "@/components/UserImage";
import Link from "next/link";
import Greeting from "@/components/Dashboard/Greeting";
import CreateCourse from "@/components/Course/Create/page";

export default function Navbar() {
  return (
    <div className="hidden md:flex px-[1%] xl:px-none mx-auto justify-between items-center gap-6 w-full lg:w-full py-3 max-w-[1600px]">
      <Greeting/>
      <div className="flex justify-center items-center gap-3">
        <div className="hidden md:flex">
          <CreateCourse />
          </div>
          <Link href={'/settings'} className="rounded-full transition duration-200 w-[50px] h-[50px] cursor-pointer hover:ring-4 hover:ring-offset-4 ring-border ring-offset-[--bg]">
            <UserImage />
          </Link>
        </div>
      </div>
  )
}
