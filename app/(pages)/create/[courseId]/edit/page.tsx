import { Metadata } from "next";
import EditCourseComponent from "@/app/(pages)/create/[courseId]/edit/EditCourse";

interface EditCoursePageProps {
  params: {
    courseId: string;
  }
}

export const metadata: Metadata = {
  title: 'Edit course - STOIC',
  description: 'Edit course page of Stoic platform',
}

export default function EditCoursePageProps({
  params: {courseId}
}: EditCoursePageProps
) {
  return (
    <EditCourseComponent courseId={courseId}/>
  )
}