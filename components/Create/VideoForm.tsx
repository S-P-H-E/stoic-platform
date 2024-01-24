import { LessonSchemaVideo } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { BiLoader } from 'react-icons/bi';
import * as z from 'zod'
import { ButtonShad } from '../ui/buttonshad';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import NewInput from '../UI Elements/NewInput';
import NewTextArea from '../UI Elements/NewTextArea';
import { message } from 'antd';
import { createNewLesson } from '@/utils/updateFirestore';
import { Course } from '@/types/types';
import { useRouter } from 'next/navigation'
import { Checkbox } from '../ui/checkbox';

export default function VideoForm({courseOrder, isAdmin, courseId, type, title, description, final, course}: {course: Course, courseOrder: number, isAdmin: boolean, courseId: string, type: "text" | "video", title: string, description: string | undefined, final: boolean}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const [checked, setChecked] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof LessonSchemaVideo>>({
      resolver: zodResolver(LessonSchemaVideo),
      defaultValues: {
        order: courseOrder
      },
    });

    useEffect(() => {
      if (courseOrder) {
        form.reset({
          order: courseOrder || 1,
        });
      }
    }, [courseOrder, form]);

    // pass the stuff and save to db 
    const onSubmit = async (values: z.infer<typeof LessonSchemaVideo>) => {
        if (isAdmin) {
          try {
            setLoading(true);

            createNewLesson(type, final, isAdmin, description, title, courseId, course, checked, values)

            message.success('Successfully created new video lesson!');
            setSuccess('Successfully created new video lesson!');
            setError(undefined);

            setTimeout(() => {
              setSuccess(undefined);
            }, 3000);
          } catch {
            setError('Failed to create video lesson, please try again later.');
            message.error('There was an issue with your request. Please try again.');
          } finally {
            setLoading(false);
            router.push(description ? `/create/lesson?courseId=${courseId}&type=${type}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&final=true&end=true` : `/create/lesson?courseId=${courseId}&type=${type}&title=${encodeURIComponent(title)}&final=true&end=true`)
          }
        } else {
          message.error('You are not allowed to take this action.');
        }
      };

    return (
    <Form {...form}>
      <form className="space-y-4 pb-8" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormLabel className="text-lg flex gap-1 items-center">
                End Screen
                <p className="text-sm font-light text-muted-foreground">
                  (optional)
                </p>
              </FormLabel>
              <FormControl>
                <NewInput
                  black
                  disabled={loading}
                  id="endText"
                  label={'Lesson end text (optional)'}
                  placeholder={'Enter the message shown to user at the end of your lesson'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">
                Video Link
              </FormLabel>
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


      <div className="flex gap-2 items-center">
        <FormLabel className="text-lg">
          Locked
        </FormLabel>
        <Checkbox
          checked={checked}
          onCheckedChange={() => setChecked(!checked)}
          className="active:scale-90 hover:scale-105"
        />
      </div>

        <div className="flex gap-3 items-center">
          {title && (
              <ButtonShad
                variant="secondary"
                disabled={loading}
                type='submit'
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
          )}

          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      </form>
    </Form>
  )
}
