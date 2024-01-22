import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import clsx from 'clsx';
import { Task } from '@/types/types';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { message } from 'antd';
import { ButtonShad } from '../ui/buttonshad';
import { BiTrash } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Task({ task, userId }: { userId: string | null | undefined, task: Task }) {
  const [checked, setChecked] = useState(false);
  const [remainingTimer, setRemainingTimer] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);

  const stringLength = task.name.length;
  const widthPercentage = calculateWidthPercentage(stringLength);

  const handleChecked = () => {
    setChecked(!checked);

    if (!checked && userId) {
      const taskRef = doc(db, 'users', userId, 'tasks', task.id);
      startDeleteTimer(taskRef);
      message.loading('Task completed, deleting soon...', 5)
    } else {
      resetTimer();
    }
  };
  
  const startDeleteTimer = (taskRef: any) => {
    setRemainingTimer(5);
    const id = setInterval(() => {
      setRemainingTimer((prev) => {
        if (prev !== null && prev > 0) {
          if (prev === 1) {
            deleteTask(taskRef);
            resetTimer();
          }
          return prev - 1;
        }
        return null;
      });
    }, 1000);
    setTimerId(id);
  };

  const resetTimer = () => {
    setRemainingTimer(null);
    if (timerId !== null) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };
  
  const deleteTask = async (taskRef: any) => {
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setChecked(false)
    }
  };

  const handleDeleteClick = async() => {
    try {
      setLoading(true)
      if (userId && task && !remainingTimer) {
        const taskRef = doc(db, 'users', userId, 'tasks', task.id);
        await deleteTask(taskRef)
        message.success('Succesfully deleted the task.')
      }
    } catch {
      message.error('Error deleting the task, please try again later.')
    } finally {
      setLoading(false)
    }

  }

  function calculateWidthPercentage(strLength: number): number {

    // ! Bomboclat reference points
    const points = [
      { length: 13, percentage: 85 },
      { length: 18, percentage: 90 },
      { length: 38, percentage: 94 }
    ];
  
    let lowerPoint = points[0];
    let upperPoint = points[points.length - 1];
  
    for (let i = 0; i < points.length - 1; i++) {
      if (strLength > points[i].length && strLength <= points[i + 1].length) {
        lowerPoint = points[i];
        upperPoint = points[i + 1];
        break;
      }
    }
  
    const percentage = lowerPoint.percentage + 
      ((upperPoint.percentage - lowerPoint.percentage) / (upperPoint.length - lowerPoint.length)) * 
      (strLength - lowerPoint.length);
  
    return percentage;
  }
  //! if  no description, do cursor-default

  return (
    <div className="relative">
      <Checkbox
        checked={checked}
        onCheckedChange={handleChecked}
        className="active:scale-90 hover:scale-105 absolute left-4 top-[15px] z-20"
      />
      <ButtonShad disabled={!!remainingTimer || loading} onClick={handleDeleteClick} size="icon" variant="destructive" className="disabled:cursor-not-allowed transition p-0 w-8 h-8 top-[11px] active:scale-90 hover:scale-105 absolute z-20 right-4">
        {remainingTimer ?
          <p>{remainingTimer}</p>
        :
          <BiTrash size={16}/>
        }
      </ButtonShad>
      <Accordion type="single" collapsible>
        <AccordionItem value="task-1">
          <AccordionTrigger>
            <div
              className={clsx(
                'w-full group px-4 py-3 bg-darkgray transition border border-border rounded-lg flex justify-between items-center gap-3',
                task.description ? 'hover:border-highlight' : 'cursor-default'
              )}
            >
              <div className="relative flex gap-3 items-center z-10 pl-8">
                <AnimatePresence>
                  {checked &&
                    <motion.div
                      className="shadow-xl absolute left-7 w-0 h-1 bg-primary-foreground rounded-xl"
                      animate={{ width: `${widthPercentage}%` }}
                      exit={{ width: 1}}
                    />
                  }
                </AnimatePresence>
                <h1 className={clsx("font-medium text-lg transition duration-300", checked && 'opacity-50')}>
                  {task.name ? task.name : 'Loading...'}
                </h1>
              </div>
              <p className="text-sm font-light text-muted-foreground pr-12">
                {task.createdAt ? task.createdAt : 'Loading...'}
              </p>
            </div>
          </AccordionTrigger>
          {task.description && (
            <AccordionContent className="p-4 whitespace-pre-wrap bg-darkgray border-b border-l border-r rounded-b-lg border-border">
              {task.description}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
