import { Metadata } from "next";
import CreateCourseGuard from "./CreateCourseGuard";

interface CreateCoursePageProps {
  searchParams: {
    imageSrc: string;
    type: "public" | "locked";
    description: string;
    title: string;
    final: boolean;
    courseId: string;
  }
}

export const metadata: Metadata = {
  title: 'Create course - STOIC',
  description: 'Create course page of Stoic platform',
}

export default function CreateCoursePage({
  searchParams: {courseId, imageSrc, type, title, description, final}
}: CreateCoursePageProps
) {
  return (
    <CreateCourseGuard courseId={courseId} imageSrc={imageSrc} type={type} title={title} final={final} description={description}/>
  )
}