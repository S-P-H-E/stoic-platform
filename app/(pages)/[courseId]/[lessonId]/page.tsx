"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<any | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        if (courseId && lessonId) {
          const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonId as string);
          const lessonDocSnap = await getDoc(lessonDocRef);

          if (lessonDocSnap.exists()) {
            const lessonData = lessonDocSnap.data();
            setLesson(lessonData);
          } else {
            console.error('Lesson not found');
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId]);

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      {/* Additional content for the lesson */}
    </div>
  );
}
