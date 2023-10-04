'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useEffect, useState } from 'react';
import Button from './UI Elements/Button';
import Sidebar from './Sidebar';
import { BsChevronRight } from 'react-icons/bs';

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents SSR issues if react-lottie or dependencies are null

  return (
    <div className="flex justify-between md:hidden px-5 py-3">
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
    </div>
  );
};

export default MobileSidebar;