"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Lesson } from '@/types/types';
import { fetchSingleLessonWithCourse } from '@/utils/getFirestore';
import { ButtonShad } from '@/components/ui/buttonshad';
import { FaArrowLeft } from 'react-icons/fa6';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { LessonSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import NewInput from '@/components/UI Elements/NewInput';
import NewTextArea from '@/components/UI Elements/NewTextArea';
import { BiLoader } from 'react-icons/bi';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { Checkbox } from '@/components/ui/checkbox';
import { message } from 'antd';
import TipTap from '@/components/Create/TipTap';
import { updateExistingLesson } from '@/utils/updateFirestore';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";
import Unauthorized from "@/components/Unauthorized";
import PageLoader from "@/components/PageLoader";

interface CreateLessonIdComponentProps {
  courseId: string;
  lessonId: string;
}

export default function CreateLessonIdComponent({
  courseId,
  lessonId,
}: CreateLessonIdComponentProps) {
  const [lessonWithCourse, setLessonWithCourse] = useState<{
    lesson: Lesson | null;
    course: Course | null;
  }>({ lesson: null, course: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [contentsInitialized, setContentsInitialized] = useState(false);
  const [checked, setChecked] = useState(
    lessonWithCourse.lesson?.locked || false
  );

  const [contents, setContents] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState(0);
  const [HTMLContent, setHTMLContent] = useState('');

  const { userStatus, userId } = UserDataFetcher();

  const isPremium = isUserAllowedToFetch(userStatus)
  const isAdmin = userStatus === 'admin'

  const handlePageChange = (newPage: number, updatedHTMLContent?: string) => {
    if (updatedHTMLContent !== undefined) {
      setHTMLContent(updatedHTMLContent);
      setContents((prevContents) => {
        const newContents = [...prevContents];
        newContents[currentPage] = updatedHTMLContent;
        return newContents;
      });
    }
    setCurrentPage(newPage);

    setContents((prevContents) => {
      const newContents = [...prevContents];
      newContents[currentPage] = updatedHTMLContent || '';
      return newContents;
    });
  };


  const router = useRouter();

  if (!isAdmin && userStatus) {
    router.push('/');
  }

  const form = useForm<z.infer<typeof LessonSchema>>({
    resolver: zodResolver(LessonSchema),
    mode: 'onChange',
    defaultValues: {
      /*       title: lessonWithCourse.lesson.title,
      description: lessonWithCourse.lesson?.description, */
    },
  });

  useEffect(() => {
    if (lessonWithCourse && lessonWithCourse.lesson) {
      if (!contentsInitialized) {
        setContents(lessonWithCourse.lesson.content || ['']);
        setContentsInitialized(true);
      }
      setHTMLContent(
        (lessonWithCourse.lesson.content?.[currentPage] as string) ?? ''
      );
      form.reset({
        title: lessonWithCourse.lesson.title,
        description: lessonWithCourse.lesson.description,
        order: lessonWithCourse.lesson.order,
        endText: lessonWithCourse.lesson.endText || '',
        url: lessonWithCourse.lesson.url || '',
        content: lessonWithCourse.lesson.content || [''],
      });
    }
  }, [lessonWithCourse, form, currentPage, contentsInitialized]);

  useEffect(() => {
    if (!isAdmin && (!courseId || !lessonId)) {
      setLessonWithCourse({ lesson: null, course: null });
    } else if (courseId && lessonId && isAdmin && userStatus) {
      try {
        setLoading(true);

        const onUpdate = ({
          lesson,
          course,
        }: {
          lesson: Lesson | null;
          course: Course | null;
        }) => {
          setLessonWithCourse({ lesson, course });
        };

        const unsubscribe = fetchSingleLessonWithCourse(
          userStatus,
          courseId,
          lessonId,
          onUpdate
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [userStatus, courseId, lessonId, isAdmin]);

  const onSubmit = async (values: z.infer<typeof LessonSchema>) => {
    if (isAdmin && userStatus) {
      try {
        setLoading(true);

        message.success('Successfully updated the lesson!');
        setSuccess('Successfully updated the lesson!');
        setError(undefined);

        const type = lessonWithCourse?.lesson?.type || 'text';
        const courseId = lessonWithCourse?.course?.id || '';
        const lessonId = lessonWithCourse?.lesson?.id || '';

        await updateExistingLesson(
          type,
          isAdmin,
          courseId,
          lessonId,
          checked,
          values,
          contents
        );

        setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      } catch {
        setError('Failed to update lesson, please try again later.');
        message.error(
          'There was an issue with your request. Please try again.'
        );
      } finally {
        setLoading(false);
        // router push here
      }
    } else {
      message.error('You are not allowed to take this action.');
    }
  };

  if (isAdmin && userId) {
    return (
        <div className="h-full flex flex-col w-full relative mx-auto max-w-7xl lg:py-10 gap-4 lg:px-16 md:p-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">{`Editing ${lessonWithCourse.lesson?.title} for ${lessonWithCourse.course?.name}`}</h1>
          </div>
          <ButtonShad
              onClick={() => router.back()}
              className="w-fit justify-start items-center gap-2 z-10 mb-4 text-primary-foreground active:scale-90 transition"
              variant="link"
          >
            <FaArrowLeft />
            Go back
          </ButtonShad>
          <div className="w-full flex flex-col gap-4 h-full justify-center">
            <Form {...form}>
              <form
                  className="space-y-4 pb-8"
                  onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Title</FormLabel>
                          <FormControl>
                            <NewInput
                                black
                                disabled={loading}
                                id="title"
                                label={'Course title'}
                                placeholder={'Enter the title of your course'}
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
                          <FormLabel className="text-lg">Description</FormLabel>
                          <FormControl>
                            <NewTextArea
                                black
                                customHeight={'h-48'}
                                disabled={loading}
                                id="description"
                                label={'Course description'}
                                placeholder={
                                  'Enter a informative description of your course'
                                }
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                {lessonWithCourse?.lesson?.type === 'video' && (
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Video Link</FormLabel>
                              <FormControl>
                                <NewTextArea
                                    black
                                    disabled={loading}
                                    id="link"
                                    label={'Lesson link'}
                                    placeholder={
                                      'Enter the video url of your lesson (embed src on vimeo)'
                                    }
                                    {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {lessonWithCourse?.lesson?.type === 'text' && (
                    <FormItem>
                      <FormLabel className="text-lg">Lesson Content</FormLabel>
                      <TipTap
                          predefinedHTMLContent={HTMLContent}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                          contents={contents}
                      />
                    </FormItem>
                )}

                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Order</FormLabel>
                          <FormControl>
                            <NewInput
                                black
                                disabled={loading}
                                id="order"
                                label={'Lesson order'}
                                placeholder={'Enter the desired order of your lesson'}
                                {...field}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const newValue = inputValue !== '' ? parseInt(inputValue, 10) : undefined; // Keep it as an empty string if it's not a valid number
                                  field.onChange(newValue);
                                }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endText"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">End Screen</FormLabel>
                          <FormControl>
                            <NewInput
                                black
                                disabled={loading}
                                id="endText"
                                label={'Lesson end text'}
                                placeholder={
                                  'Enter the message shown to user at the end of your lesson'
                                }
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 items-center">
                  <FormLabel className="text-lg">Locked</FormLabel>
                  <Checkbox
                      checked={checked}
                      onCheckedChange={() => setChecked(!checked)}
                      className="active:scale-90 hover:scale-105"
                  />
                </div>

                <div className="flex gap-3 items-center">
                  <ButtonShad
                      variant="secondary"
                      disabled={loading}
                      type="submit"
                      className="order-first border-white border disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 transition"
                  >
                    {loading ? (
                        <div className="flex gap-1 items-center">
                          <BiLoader className="animate-spin" /> <p>Loading</p>
                        </div>
                    ) : (
                        'Save'
                    )}
                  </ButtonShad>

                  <FormError message={error} />
                  <FormSuccess message={success} />
                </div>
              </form>
            </Form>
          </div>
        </div>
    );
  } else if (isPremium && userId) {
    return <Unauthorized/>
  } else {
    return <PageLoader/>
  }
}
