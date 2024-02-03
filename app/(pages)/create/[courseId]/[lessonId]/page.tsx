import { Metadata } from "next";
import CreateLessonIdComponent from "@/app/(pages)/create/[courseId]/[lessonId]/CreateLessonId";

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
    <CreateLessonIdComponent lessonId={lessonId} courseId={courseId}/>
  )
}