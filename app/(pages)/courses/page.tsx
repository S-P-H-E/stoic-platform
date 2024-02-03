import { Metadata } from "next";
import CoursesComponent from "@/app/(pages)/courses/Courses";

export const metadata: Metadata = {
  title: 'Courses - STOIC',
  description: 'Courses page of Stoic platform',
}

export default function CoursesPage() {
  return (
    <CoursesComponent/>
  )
}
