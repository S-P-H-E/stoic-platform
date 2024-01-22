import { Metadata } from "next";
import LessonGuard from "./LessonGuard";

interface LessonIdPageProps {
  params: {
    lessonId: string;
    courseId: string;
  }
}

export const metadata: Metadata = {
  title: 'Lesson - STOIC',
  description: 'Lesson page of Stoic platform',
}

export default function LessonId({
  params: {lessonId, courseId}
}: LessonIdPageProps) {
  return (
    <LessonGuard courseId={courseId} lessonId={lessonId}/>
  )
}

