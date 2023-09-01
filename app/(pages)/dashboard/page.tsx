"use client"

import { UserDataFetcher } from "@/utils/userDataFetcher";
import { BsStars } from 'react-icons/bs'

import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import Search from "@/components/Search/page";

export default function Dashboard() {
  const { userName, user } = UserDataFetcher();
  const [modalOpen, setModalOpen] = useState(false);

  const ShowModal = () => {
    setModalOpen(true)
  }
  const HideModal = () => {
    setModalOpen(false)
  }

  return (
    // <div className='h-screen flex flex-col ml-[16rem] m-4'>
    //   <div>
    //     <h1 className='text-2xl font-bold'>Dashboard</h1>
    //   </div>
    //   <div className="flex flex-col">
    //     <p>Welcome, {userName ? userName : 'loading...'}</p>
    //     <p>Your email address: {userName ? user?.email : "loading..."}</p>
    //   </div>
    // </div>
    
    <div>
      {/* Modal */}
      {modalOpen && (
        <div className="bg-black/40 fixed inset-0 flex justify-center items-center" onClick={HideModal}>
          
          
        </div>
      )}

      {/* Navbar */}
      <div className=" px-10 py-6 flex justify-between items-center gap-6">
        <div className="w-full">
          <p className="text-xl">Hi, {userName ? userName : '...'}</p>
        </div>

        {/* <div className="w-full">
          
        </div> */}
        <div className="flex justify-end items-center gap-4 w-full">
          {/* <button className="bg-white text-black flex justify-center items-center gap-2 py-2 px-3 rounded-xl font-medium">
            <BsStars />
            Ask AI
          </button> */}
          <Search />
          <div className="bg-[#171717] transition-all hover:bg-white/5 p-2 rounded-full cursor-pointer">
            <AiOutlineMenu size={20} />
          </div>
        </div>
      </div>
    </div>

  );
}
