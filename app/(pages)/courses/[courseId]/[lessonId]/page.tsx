import { Metadata } from "next";
import LessonGuard from "./LessonGuard";

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
    <LessonGuard page={page} courseId={courseId} lessonId={lessonId}/>
  )
}

