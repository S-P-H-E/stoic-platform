import { Metadata } from "next";
import CourseComponent from "@/app/(pages)/courses/[courseId]/Course";


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
    <CourseComponent courseId={courseId}/>
  )
}