import { Metadata } from "next";
import EditCourseGuard from "./EditCourseGuard";

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
    <EditCourseGuard courseId={courseId}/>
  )
}