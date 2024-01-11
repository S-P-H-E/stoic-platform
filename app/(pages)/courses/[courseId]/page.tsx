import { Metadata } from "next";
import CourseGuard from "./CourseGuard";

export const metadata: Metadata = {
  title: 'Course - STOIC',
  description: 'Course page of Stoic platform',
}

export default function Dashboard() {
  return (
    <CourseGuard/>
  )
}