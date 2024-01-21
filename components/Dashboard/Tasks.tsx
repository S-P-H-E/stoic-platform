'use client';

import React, { useEffect, useState } from 'react';
import Task from './Task';
import { FaFilter } from 'react-icons/fa6';
import { ButtonShad } from '@/components/ui/buttonshad';
import { motion } from 'framer-motion';
import {
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isUserAllowedToFetch } from '@/utils/utils';
import { Task as TypeTask } from '@/types/types';
import { fetchUserTasks } from '@/utils/getFirestore';
import { message } from 'antd';
import CreateTaskButton from './CreateTaskButton';

export default function Tasks({
  userId,
  userStatus,
}: {
  userId: string | null | undefined;
  userStatus: string | undefined;
}) {
  const isAllowed = isUserAllowedToFetch(userStatus);

  const [tasks, setTasks] = useState<Array<TypeTask> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);

      const onUpdate = (updatedTasks: Array<TypeTask>) => {
        setTasks(updatedTasks);
      };

      const unsubscribe = fetchUserTasks(userStatus, userId, onUpdate);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [userId, userStatus, isAllowed]);

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
      },
    }),
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-medium">Active Tasks</h1>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <p className="text-xs font-light">Order by:</p>
            <h4 className="text-end text-sm">Name</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonShad size="icon">
                <FaFilter />
              </ButtonShad>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-darkgray rounded-lg border border-border">
              <DropdownMenuLabel>Order by:</DropdownMenuLabel>
              <DropdownMenuItem>Name</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative w-full">
        {tasks && tasks.length > 6 && (
          <div className="absolute top-0 w-full h-5 bg-gradient-to-b from-bg  to-transparent" />
        )}
        <div className="max-h-[25rem] overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600">
          {loading ? (
            <p>Loading...</p>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true
                }}
              >
                <Task userId={userId} task={task} />
              </motion.div>
            ))
          ) : (
            <motion.div initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}}
            className='w-full h-80 flex flex-col gap-4 justify-center items-center border-border border bg-darkgray rounded-lg'>
              <div className="flex flex-col gap-1 items-center">
                <h1 className='text-2xl font-semibold'>No tasks found</h1>
                <p className="text-sm font-light text-muted-foreground">You haven&apos;t created any tasks yet, click the button below to create one.</p>
              </div>
              <CreateTaskButton userId={userId} userStatus={userStatus}/>
            </motion.div>
          )}
        </div>
        {tasks && tasks.length > 6 && (
          <div className="absolute bottom-0 w-full h-5 bg-gradient-to-t from-bg to-transparent" />
        )}
      </div>
    </div>
  );
}
