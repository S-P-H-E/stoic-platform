import Search from "@/components/Search/page";
import UserImage from "@/components/UserImage";
import Link from "next/link";
import Greeting from "@/components/Greeting";
import CreateCourse from "@/components/Course/CreateCourse/page";

export default function Navbar() {
  return (
    <div className="hidden md:flex px-[12%] mx-auto justify-between items-center gap-6 w-full lg:w-full py-3">
      <Greeting/>
      <div className="flex justify-center items-center gap-3">
        <div className="hidden md:flex">
          <CreateCourse />
          </div>
          {/* <Search /> */}
          <Link href={'/settings'} className="rounded-full transition duration-200 w-[50px] h-[50px] cursor-pointer hover:ring-4 hover:ring-offset-4 ring-[--border] ring-offset-[--bg]">
            <UserImage />
          </Link>
        </div>
      </div>
  )
}
