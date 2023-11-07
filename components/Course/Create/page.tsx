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

interface Props {
  className?: string
}

export default function CreateContent({className}: Props) {
  const { userStatus } = UserDataFetcher();

  return (
    <Dialog>
      <DialogTrigger>
        {userStatus === 'admin' ? (
          <>
            <button className={clsx(className, 'hover:bg-[--highlight] transition hidden md:flex justify-center items-center px-2 py-1 border border-[--highlight] gap-1 rounded-xl cursor-pointer')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </button>

            <div className={clsx(className, 'border border-dashed border-[#444444] w-full h-[70px] rounded-xl flex justify-center items-center gap-1 md:hidden')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </div>
          </>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <div className="pt-3">
        <Switch
          initialTab="first"
          firstComponent={<CreateLesson />}
          secondComponent={<CreateCourse />}
        />
        </div>
      </DialogContent>
    </Dialog>
  );
}
