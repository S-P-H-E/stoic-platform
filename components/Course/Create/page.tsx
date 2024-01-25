"use client"
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from 'clsx';
import CreateLesson from './Lesson';
import Switch from '@/components/Switch';
import CreateCourse from './Course';
import Link from 'next/link';

interface Props {
  userStatus?: string | undefined; 
  className?: string;
}

export default function CreateContent({userStatus, className}: Props) {
  return (
    <Link href="create">
        {userStatus === 'admin' && (
          <>
            <button className={clsx(className, 'active:scale-90 hover:bg-highlight transition hidden md:flex justify-center items-center px-2 py-1 border border-highlight gap-1 rounded-xl cursor-pointer')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </button>

            <div className={clsx(className, 'transition active:scale-95 border border-dashed border-border w-full h-[70px] rounded-xl flex justify-center items-center gap-1 md:hidden')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </div>
          </>
        )}
    </Link>
  );
}
