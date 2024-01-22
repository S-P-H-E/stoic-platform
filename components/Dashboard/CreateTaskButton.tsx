'use client';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { ButtonShad } from '@/components/ui/buttonshad';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '../ui/dialog';
import { DashboardSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import NewInput from '../UI Elements/NewInput';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { message } from 'antd';
import { BiLoader } from 'react-icons/bi';
import { createNewTask } from '@/utils/updateFirestore';
import { isUserAllowedToFetch } from '@/utils/utils';
import clsx from 'clsx'
import NewTextArea from '../UI Elements/NewTextArea';

export default function CreateTaskButton({
  userId,
  userStatus,
  mobile
}: {
  userId: string | null | undefined;
  userStatus: string | undefined;
  mobile?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const isAllowed = isUserAllowedToFetch(userStatus)

  const form = useForm<z.infer<typeof DashboardSchema>>({
    resolver: zodResolver(DashboardSchema),
  });

  const onSubmit = async (values: z.infer<typeof DashboardSchema>) => {
    if(isAllowed) {
      try {
        setLoading(true);
  
        const createdAt = new Date().toLocaleString();
        const completed = false
  
        const valuesWithExtraInfo = {
          ...values,
          createdAt,
          completed
        };
  
        await createNewTask(userStatus, userId, valuesWithExtraInfo)
        message.success('Succesfully created new task!');
        setSuccess('Successfully created new task!');
        setError(undefined)

        form.reset();

        setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      } catch {
        setError('Failed to create the task, please try again later.');
        message.error('There was an issue with your request. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('You are not allowed to take this action.')
    }
  };

  const placeholderMessages = [
    'Analysed the competition',
    'Completed the first lesson',
    'Edit 2 short-form videos',
    'Daily upload done',
    'Workout done',
    'Finished the new edit',
  ];

  const placeholderDescriptions = [
    'Conduct in-depth analysis of the competition and get some new ideas flowing.',
    'Completed the first lesson of the online course on After Effects editing.',
    'Edit 2 short-form videos for the affiliate program.',
    'Successfully uploaded the daily short on the YouTube channel.',
    'Completed a rigorous workout routine to stay fit and healthy.',
    'Finished the new edit for the upcoming promotion video.',
  ];

  const getRandomPlaceholder = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];

  return (
    // ! CHECK NEW WHITE VARIANT ON BUTTON AND CONTINUE
    <Dialog>
      <DialogTrigger>
        <ButtonShad
          size="icon"
          className={clsx("gap-2 text-lg w-12 h-12 active:scale-95 transition", mobile ? 'hidden' : 'md:hidden')}
        >
          <FaPlus size={28} />
        </ButtonShad>

        <ButtonShad
          variant="outline"
          size="lg"
          className={clsx("gap-2 text-lg active:scale-95 transition", !mobile && 'hidden md:flex')}
        >
          <FaPlus />
          <p>Create Task</p>
        </ButtonShad>
      </DialogTrigger>
      <DialogContent>
        <div className="p-8 flex flex-col gap-4">
          <h1 className="font-medium text-2xl">Create a new task</h1>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Name</FormLabel>
                    <FormControl>
                      <NewInput
                        disabled={loading}
                        id="name"
                        label={'Task name'}
                        placeholder={getRandomPlaceholder(placeholderMessages)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex gap-1 items-center">
                      Description
                      <p className="text-sm font-light text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <NewTextArea
                        disabled={loading}
                        id="description"
                        label={'Task description (optional)'}
                        placeholder={getRandomPlaceholder(
                          placeholderDescriptions
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />
              <FormSuccess message={success} />
              
              <div className="flex gap-2">
              <ButtonShad
                variant="secondary"
                disabled={loading}
                className="border-white border disabled:cursor-not-allowed active:scale-90 transition"
                type="submit"
              >
                {loading ? <div className="flex gap-1 items-center"><BiLoader className="animate-spin" /> <p>Loading</p></div> : 'Create'}
              </ButtonShad>

              
              <DialogClose asChild>
                <ButtonShad
                  disabled={loading}
                  className="disabled:cursor-not-allowed active:scale-90 transition"
                >
                  Close
                </ButtonShad>
              </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
