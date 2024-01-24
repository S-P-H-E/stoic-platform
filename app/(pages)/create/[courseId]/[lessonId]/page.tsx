import { Metadata } from "next";
import CreateLessonIdGuard from "./CreateLessonIdGuard";

interface CreateLessonIdPageProps {
  params: {
    courseId: string;
    lessonId: string;
  }
}

export const metadata: Metadata = {
  title: 'View course - STOIC',
  description: 'View lesson page of Stoic platform',
}

export default function CreateCourseIdPage({
  params: {courseId, lessonId}
}: CreateLessonIdPageProps
) {
  return (
    <CreateLessonIdGuard lessonId={lessonId} courseId={courseId}/>
  )
}