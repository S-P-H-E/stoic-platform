import Continue from "@/components/Continue";
import CourseLogic from "@/components/Course/logic";
import CreateCourse from "@/components/Course/CreateCourse/page";
import Navbar from "@/components/Navbar";
import { BiSolidBookAlt } from 'react-icons/bi'
import { IoMdSettings } from 'react-icons/io'
import { IoVideocam } from 'react-icons/io5'
import Link from "next/link";

export default function Dashboard(){
  const navs = [
    {
      id: 1,
      icon: <BiSolidBookAlt size={30}/>,
      name: 'Library',
      link: '/library',
    },
    {
      id: 2,
      icon: <IoVideocam size={30}/>,
      name: 'Converters',
      link: '/converters/ytmp4',
      target: '_blank'
    },
    {
      id: 3,
      icon: <IoMdSettings size={30}/>,
      name: 'Settings',
      link: '/settings',
    },
  ]

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {/* Navbar */}
        <Navbar />
        
        {/* Courses */}
        <div className=" p-5 md:px-10 flex flex-col gap-8 w-full md:w-[1000px]">
            <div className="grid md:hidden w-full">
              <CreateCourse />
            </div>
            <div className=" w-full flex flex-col md:flex-row justify-between gap-3">
          {navs.map((nav) => (
            <Link key={nav.id} href={nav.link} target={nav.target}>
              <div className="bg-[#0e0e0e] border border-[#3030307a] p-3 text-white rounded-2xl flex items-center gap-4 md:w-fit cursor-pointer duration-300 transition-all hover:invert">
                {nav.icon}
                <h1 className="text-xl font-medium">{nav.name}</h1>
              </div>
            </Link>
          ))}
        </div>
          <Continue/>
          <CourseLogic courses={[]} />
        </div>
      </div>
    </>
  );
}
