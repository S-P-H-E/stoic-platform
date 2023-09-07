"use client"
import { useParams, usePathname } from "next/navigation";
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react'; // Import useState and useEffect
import { db } from '@/utils/firebase';

interface LessonData {
    title: string;
    description: string;
}

export default function LessonId({ params }: { params: { slug: string } }) {
    const { lessonId } = useParams();
    const pathname = usePathname();

    // Split the URL into separate objects
    const objects = pathname.split('/').filter(Boolean);

    if (objects.length < 2) {
    return <div>Invalid URL format</div>;
    }

    const courseId = objects[0];
    // const lessonId = objects[1];

    console.log('LessonID: ', lessonId)

    const [lessonData, setLessonData] = useState<LessonData | null>(null);

    useEffect(() => {
        const getLessonData = async () => {
            if (lessonId && courseId) {
                try {
                    const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
                    const lessonDoc: DocumentSnapshot<LessonData> = await getDoc(lessonRef);

                    if (lessonDoc.exists()) {
                        const lessonData = lessonDoc.data();
                        setLessonData(lessonData);
                    } else {
                        console.log("Lesson not found.");
                    }
                } catch (error) {
                    console.error("Error fetching lesson:", error);
                    console.log("LessonId:", lessonId);
                }
            } else {
                console.error('error');
              }
        };

        // Call the function to fetch lesson data
        getLessonData();
    }, [lessonId]); // Make sure to include lessonId as a dependency for useEffect

    return (
        <div>
            
            {lessonData ? (
                <div>
                    <h1>Title: {lessonData.title}</h1>
                    <p>Description: {lessonData.description}</p>
                    {/* Render other fields as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}