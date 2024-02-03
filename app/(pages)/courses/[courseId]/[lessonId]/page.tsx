import { Metadata } from "next";
import LessonComponent from "@/app/(pages)/courses/[courseId]/[lessonId]/Lesson";

interface LessonIdPageProps {
  params: {
    lessonId: string;
    courseId: string;
  }
  searchParams: {
    page: number;
  }
}

export const metadata: Metadata = {
  title: 'Lesson - STOIC',
  description: 'Lesson page of Stoic platform',
}

export default function LessonId({
  params: {lessonId, courseId},
  searchParams: {page}
}: LessonIdPageProps) {
  return (
    <LessonComponent page={page} courseId={courseId} lessonId={lessonId}/>
  )
}

