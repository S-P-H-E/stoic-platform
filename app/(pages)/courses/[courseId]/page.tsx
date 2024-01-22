import { Metadata } from "next";
import CourseGuard from "./CourseGuard";


interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

export const metadata: Metadata = {
  title: 'Course - STOIC',
  description: 'Course page of Stoic platform',
}

export default function CourseId({
  params: {courseId}
}: CourseIdPageProps) {
  return (
    <CourseGuard courseId={courseId}/>
  )
}