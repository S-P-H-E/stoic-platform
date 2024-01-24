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
import { LessonSchemaPart1 } from '@/schemas';
import NewInput from '../UI Elements/NewInput';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { ButtonShad } from '../ui/buttonshad';
import { BiLoader } from 'react-icons/bi';
import * as z from 'zod';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LessonCreateName({
  isAdmin,
  type,
  courseId,
  description,
  title,
}: {
  isAdmin: boolean;
  type: string;
  courseId: string;
  title: string | undefined;
  description: string | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const router = useRouter();

  const form = useForm<z.infer<typeof LessonSchemaPart1>>({
    resolver: zodResolver(LessonSchemaPart1),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  const { title: formTitle, description: formDescription } = form.watch();

  const onSubmit = async (values: z.infer<typeof LessonSchemaPart1>) => {
    if (isAdmin) {
      try {
        setLoading(true);

        message.success('Successfully saved the title and description!');
        setSuccess('Successfully saved the title and description!');
        setError(undefined);

        const encodedTitle = encodeURIComponent(values.title || '');
        const encodedDescription = encodeURIComponent(values.description || '');

        if (encodedTitle) {
          const url = `/create/lesson?courseId=${courseId}&type=${type}&title=${encodedTitle}`;

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

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  label={'Lesson title'}
                  placeholder={'Enter the title of your lesson'}
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
                  label={'Lesson description (optional)'}
                  placeholder={
                    'Enter a informative description of your lesson'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 items-center">
          {title && title === formTitle && (!description || description === formDescription) && (
            <Link
              href={
                !description
                  ? `/create/lesson?courseId=${courseId}&type=${type}&title=${encodeURIComponent(title)}&final=true`
                  : `/create/lesson?courseId=${courseId}&type=${type}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&final=true`
              }
            >
              <ButtonShad
                variant="secondary"
                disabled={loading || !title && title === formTitle}
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
            </Link>
          )}


        {title && title === formTitle && (!description || description === formDescription) ? null :
          <ButtonShad
            variant='secondary'
            disabled={loading}
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
