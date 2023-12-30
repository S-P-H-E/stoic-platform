import { Metadata } from "next";
import CourseComponent from "./Course";

export const metadata: Metadata = {
  title: 'Course - STOIC',
  description: 'Course page of Stoic platform',
}

export default function Dashboard() {
  return (
    <CourseComponent/>
  )
}