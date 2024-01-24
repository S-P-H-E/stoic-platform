import { Metadata } from "next";
import CreateCourseIdGuard from "./CreateCourseIdGuard";

interface CreateCourseIdPageProps {
  params: {
    courseId: string;
  }
}

export const metadata: Metadata = {
  title: 'View course - STOIC',
  description: 'View course page of Stoic platform',
}

export default function CreateCourseIdPage({
  params: {courseId}
}: CreateCourseIdPageProps
) {
  return (
    <CreateCourseIdGuard courseId={courseId}/>
  )
}