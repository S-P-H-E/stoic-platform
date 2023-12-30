import { Metadata } from "next";
import LessonGuard from "./LessonGuard";

export const metadata: Metadata = {
  title: 'Lesson - STOIC',
  description: 'Lesson page of Stoic platform',
}

export default function Dashboard() {
  return (
    <LessonGuard/>
  )
}

