"use client"
import Image from "next/image";
import Link from "next/link";
import { FiHome } from 'react-icons/fi'
import { MdOutlineSchool } from 'react-icons/md'
import { BsPerson } from 'react-icons/bs'
import clsx from "clsx";
import { usePathname } from 'next/navigation'

export default function Sidebar(){
    const pathname = usePathname()
    
    const items = [
        {
            id: 1,
            icon: <FiHome />,
            name: 'Dashboard',
            route: '/'
        },
        {
            id: 2,
            icon: <MdOutlineSchool />,
            name: 'Classes',
            route: '/classes'
        },
        {
            id: 3,
            icon: <BsPerson />,
            name: 'Students',
            route: '/students'
        },
    ]
    return(
        <div className="fixed left-0 flex flex-col justify-between border-r border-[#E6E3E9] w-fit h-screen p-10">
            <div>
                <Image src={'/images/logo.png'} alt="logo" width={50} height={50} className="pb-10"/>
                <div className="flex flex-col gap-6">
                    {items.map((items) => (
                        <Link href={items.route} key={items.id}>
                            <div className={clsx("flex items-center gap-2 text-xl w-[200px] text-black font-medium px-3 py-2 rounded-lg bg-white hover:bg-[#F4F4F4]", pathname === items.route ? '!bg-[#000000] !text-white !hover:bg-[#000000]' : '')}>
                                {items.icon}
                                {items.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 cursor-pointer hover:bg-[#F4F4F4] p-2 rounded-xl">
                <Image src={'/images/profile.png'} alt="profile" width={50} height={0} className="h-[50px] w-[50px] rounded-full object-cover"/>
                <div>
                    <h1 className="text-xl">Emily Johnson</h1>
                    <p className="text-[#808080]">Administrator</p>
                </div>
            </div>

        </div>
    )
}