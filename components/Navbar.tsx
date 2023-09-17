import React from 'react'
import Search from "@/components/Search/page";
import UserImage from "@/components/UserImage";
import Link from "next/link";
import Greeting from "@/components/Greeting";
import CreateCourse from "@/components/CreateCourse/page";

export default function Navbar() {
  return (
    <div className="fixed px-8 pt-7 pb-3 md:p-10 md:px-36 flex justify-between items-center gap-6 w-full lg:w-full">
      <Greeting/>
      <div className="flex justify-center items-center gap-3">
        <div className="hidden md:flex">
          <CreateCourse />
          </div>
          <Search />
          <Link href={'/settings'} className="w-[50px] h-[50px] cursor-pointer">
            <UserImage />
          </Link>
        </div>
      </div>
  )
}
