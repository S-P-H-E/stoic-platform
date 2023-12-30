import { Metadata } from "next";
import CoursesGuard from "./CoursesGuard";

export const metadata: Metadata = {
  title: 'Courses - STOIC',
  description: 'Courses page of Stoic platform',
}

export default function CoursesPage() {
  return (
    <CoursesGuard/>
  )
}
