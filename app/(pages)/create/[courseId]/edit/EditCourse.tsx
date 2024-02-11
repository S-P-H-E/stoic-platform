"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/types';
import {
  fetchSingleCourse,
} from '@/utils/getFirestore';
import { ButtonShad } from '@/components/ui/buttonshad';
import { FaArrowLeft } from 'react-icons/fa6';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { EditCourseSchema } from '@/schemas';
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
import ImageUpload from '@/components/UI Elements/PhotoUploader';
import { updateCourse } from '@/utils/updateFirestore';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";
import PageLoader from "@/components/PageLoader";
import Unauthorized from "@/components/Unauthorized";

interface EditCourseComponentProps {
  courseId: string;
}

export default function EditCourseComponent({
  courseId,
}: EditCourseComponentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [course, setCourse] = useState<Course | null>()
  const [checked, setChecked] = useState(course?.locked || false);
  const [image, setImageUrl] = useState<string>();

  const router = useRouter();

  const { userStatus, userId } = UserDataFetcher();

  const isPremium = isUserAllowedToFetch(userStatus)
  const isAdmin = userStatus === 'admin'

  if (!isAdmin && userStatus) {
    router.push('/');
  }
  
  const handleImageUpload = (imageUrl: string) => {
    setImageUrl(imageUrl)
  }


  const form = useForm<z.infer<typeof EditCourseSchema>>({
    resolver: zodResolver(EditCourseSchema),
    defaultValues: {
      /*       title: lessonWithCourse.lesson.title,
      description: lessonWithCourse.lesson?.description, */
    },
  });

  useEffect(() => {
    if (course) {
      setChecked(course.locked || false);
      setImageUrl(course.image || '')
      form.reset({
        title: course.name,
        description: course.description,
      });
    }
  }, [course, form]);

  useEffect(() => {
    if (!isAdmin && !courseId) {
      setCourse(null);
    } else if (courseId && userStatus && isAdmin) {
      try {
        setLoading(true);

        const onUpdate = (updatedCourse: Course | null) => {
          setCourse(updatedCourse);
        };

        const unsubscribe = fetchSingleCourse(userStatus, courseId, onUpdate);
        return () => {
          unsubscribe();
        };
      } catch (error) {
        /*console.log(error);*/
      } finally {
        setLoading(false);
      }
    }
  }, [userStatus, courseId, isAdmin]);


  const onSubmit = async (values: z.infer<typeof EditCourseSchema>) => {
    if (isAdmin) {
      try {
        setLoading(true);

        setSuccess('Successfully updated the course!');
        setError(undefined);

        await updateCourse(isAdmin, courseId, checked, image, values);

        setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      } catch (error) {
        setError('Failed to update the course, please try again later.');
        message.error(
          'There was an issue with your request. Please try again.'
        );
        /*console.log(error )*/
      } finally {
        setLoading(false);
        // router push here
      }
    } else {
      message.error('You are not allowed to take this action.');
    }
  };

  if (isAdmin && userStatus) {
    return (
        <div className="h-full flex flex-col w-full relative mx-auto max-w-7xl lg:py-10 gap-4 lg:px-16 md:p-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">{`Editing ${course?.name} for ${course?.name}`}</h1>
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

                <div className="flex flex-col gap-2 w-full">
                  <FormLabel className="text-lg">Image</FormLabel>
                  <ImageUpload predefinedImage={course?.image} create customPath={'/courses'} onComplete={handleImageUpload}/>
                </div>

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
                        'Continue'
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
  } else if (isPremium && userStatus) {
    return <Unauthorized/>
  } else {
    return <PageLoader/>
  }
}
