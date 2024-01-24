import { Metadata } from "next";
import CreateLessonGuard from "./CreateLessonGuard";

interface CreateLessonPageProps {
  searchParams: {
    courseId: string;
    type: string;
    description: string;
    title: string;
    final: boolean;
    end: boolean;
  }
}

export const metadata: Metadata = {
  title: 'Create lesson - STOIC',
  description: 'Create lesson page of Stoic platform',
}

export default function CreateLessonPage({
  searchParams: {end, courseId, type, title, description, final}
}: CreateLessonPageProps
) {
  return (
    <CreateLessonGuard end={end} courseId={courseId} type={type} title={title} final={final} description={description}/>
  )
}