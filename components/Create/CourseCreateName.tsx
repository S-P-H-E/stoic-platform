import React, { useEffect, useState } from 'react';
import NewTextArea from '../UI Elements/NewTextArea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseSchema } from '@/schemas';
import NewInput from '../UI Elements/NewInput';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { ButtonShad } from '../ui/buttonshad';
import { BiLoader } from 'react-icons/bi';
import * as z from 'zod';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sanitizeString } from '@/utils/utils';
import ImageUpload from '../UI Elements/PhotoUploader';
import { Course } from '@/types/types';
import { createNewCourse } from '@/utils/updateFirestore';

export default function CourseCreateName({
  isAdmin,
  type,
  courseId,
  description,
  title,
  imageSrc,
  course,
}: {
  isAdmin: boolean;
  type: "public" | "locked";
  courseId: string | undefined;
  title: string | undefined;
  description: string | undefined;
  imageSrc: string | undefined;
  course: Course | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [image, setImageUrl] = useState<string>();

  const router = useRouter();

  const form = useForm<z.infer<typeof CourseSchema>>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  const { title: formTitle, description: formDescription } = form.watch();

  const onSubmit = async (values: z.infer<typeof CourseSchema>) => {
    if (isAdmin) {
      try {
        setLoading(true);

        message.success('Successfully saved the title and description!');
        setSuccess('Successfully saved the title and description!');
        setError(undefined);

        const encodedTitle = encodeURIComponent(values.title || '');
        const encodedDescription = encodeURIComponent(values.description || '');

        if (encodedTitle && image || imageSrc) {
          const url = `/create/course?courseId=${sanitizeString(values.title)}&type=${type}&title=${encodedTitle}&imageSrc=${ image ? encodeURIComponent(image) : imageSrc}`;

          if (encodedDescription) {
            router.push(`${url}&description=${encodedDescription}`);
          } else {
            router.push(url);
          }
        }

        setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      } catch {
        setError('Failed to save the name or description, please try again later.');
        message.error('There was an issue with your request. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('You are not allowed to take this action.');
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setImageUrl(imageUrl)
  }

  return (
    <Form {...form}>
      <form className="space-y-4 pb-8" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormLabel className="text-lg flex gap-1 items-center">
                Description
                <p className="text-sm font-light text-muted-foreground">
                  (optional)
                </p>
              </FormLabel>
              <FormControl>
                <NewTextArea
                  black
                  customHeight={'h-48'}
                  disabled={loading}
                  id="description"
                  label={'Course description (optional)'}
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
          <ImageUpload predefinedImage={imageSrc} create customPath={'/courses'} onComplete={handleImageUpload}/>
        </div>

        <div className="flex gap-3 items-center">
          {title && course && image || imageSrc && (
            <Link
              href={
                !description
                  ? `/create/course?&type=${type}&courseId=${sanitizeString(title!)}&title=${encodeURIComponent(title!)}&imageSrc=${encodeURIComponent(image!)}&final=true`
                  : `/create/course?&type=${type}&courseId=${sanitizeString(title!)}&title=${encodeURIComponent(title!)}&imageSrc=${encodeURIComponent(image!)}&description=${encodeURIComponent(description)}&final=true`
              }
            >
              <ButtonShad
                variant="secondary"
                onClick={() => createNewCourse(type, isAdmin, description, title!, sanitizeString(title!), course!, imageSrc!)}
                disabled={loading || !title && title === formTitle && !image || !imageSrc}
                className="order-first border-white border disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 transition"
              >
                  Continue
              </ButtonShad>
            </Link>
          )}

        {title && title === formTitle && (!description || description === formDescription) ? null :
          <ButtonShad
            variant='secondary'
            disabled={loading || (!imageSrc && !image)}
            className="border-white border disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 transition"
            type="submit"
          >
            {loading ? (
              <div className="flex gap-1 items-center">
                <BiLoader className="animate-spin" /> <p>Loading</p>
              </div>
            ) : (
              'Save'
            )}
          </ButtonShad>
        }

          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      </form>
    </Form>
  );
}
