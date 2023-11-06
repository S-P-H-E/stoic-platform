'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import UserImage from './UserImage';

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents SSR issues if react-lottie or dependencies are null

  return (
    <div className="flex justify-between md:hidden px-6 py-4">
      <Sheet>
        <SheetTrigger>
          <button className="bg-[--bg] border-[--border] border rounded-lg p-3 hover:bg-white hover:text-black transition duration-200">
            <Menu/>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-[--bg]">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Link href={'/settings'} className="rounded-full transition duration-200 w-[50px] h-[50px] cursor-pointer hover:ring-4 hover:ring-offset-4 ring-[--border] ring-offset-[--bg]">
        <UserImage />
      </Link>
    </div>
  );
};

export default MobileSidebar;