    "use client"

    import { db } from '@/utils/firebase';
    import { UserDataFetcher } from '@/utils/userDataFetcher';
    import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
    import Link from 'next/link';
    import React, { useCallback, useEffect, useState } from 'react'

    export default function Courses() {

        const { userId, userStatus } = UserDataFetcher()
        const isPremium = userStatus === 'user' || userStatus === 'admin'
        
        const [loadig, isLoading] = useState(true)

        const [courses, setCourses] = useState<Array<any>>([]);
        const [userCourses, setUserCourses] = useState<Array<any>>([]); // User's watched courses

    function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
    }

    const fetchSavedLessons = useCallback(() => {
    if (userId && isPremium) {
        try {
        const userCoursesRef = collection(db, 'users', userId, 'courses');

        const unsubscribe = onSnapshot(userCoursesRef, (querySnapshot) => {
            const userCoursesData = querySnapshot.docs.map((doc) => doc.data());
            setUserCourses(userCoursesData); // this has the last lesson id. example log-> {lastLessonId: 'z98rYuZUfbLmdmn3kSIP'}, {lastLessonId: 'rquTYIENgUjixFrMSNX5'} each for courses
        });
        return () => {
            unsubscribe();
        };
        } catch (err) {
        console.error(err);
        }
    }
    }, [userId, isPremium]);

    const fetchCourses = useCallback(async () => {
    if (userId && isPremium) {
        try {
        const coursesRef = collection(db, 'courses');

        const unsubscribe = onSnapshot(coursesRef, async (snapshot) => {
            const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const coursesWithLessons = await Promise.all(
            coursesData.map(async (course) => {
                const lessonsRef = collection(db, 'courses', course.id, 'lessons');
                const lessonsSnapshot = await getDocs(query(lessonsRef, orderBy('order')));

                const lessonIds = lessonsSnapshot.docs.map((lessonDoc) => lessonDoc.id);
                const firstLesson = lessonsSnapshot.docs[0];

                let userCourseData = userCourses.find((data) => data.courseId === course.id);
            
                if (!userCourseData) {
                const userCourseRef = doc(db, 'users', userId, 'courses', course.id);
                const userCourseSnapshot = await getDoc(userCourseRef);

                if (userCourseSnapshot.exists()) {
                    userCourseData = userCourseSnapshot.data();
                }
                }

                return {
                ...course,
                firstLesson: firstLesson ? { id: firstLesson.id, ...firstLesson.data() } : null,
                lessonIds: lessonIds,
                userCourseData: userCourseData || null,
                };
            })
            );

            setCourses(coursesWithLessons);
        });

        return () => {
            unsubscribe();
        };
        } catch (err) {
        console.log(err);
        }
    }
    }, [userId, isPremium, userCourses]);

    useEffect(() => {
    fetchCourses();
    fetchSavedLessons();
    }, [fetchCourses, fetchSavedLessons, userId]);

    return (
        <div className='flex flex-col gap-4'>
        {courses.map((course) => {
        const lastLessonId = course.userCourseData ? course.userCourseData.lastLessonId : null;

        const href = lastLessonId
            ? `/${course.id}/${lastLessonId}`
            : `/${course.id}/`;

        return (
            <Link href={href} key={course.id} passHref className="flex flex-col w-fit bg-white text-black rounded-xl p-4">
            <p>{truncateText(course.name, 35)}</p>
            <p>{truncateText(course.description, 40)}</p>
            </Link>
        );
        })}
    </div>
    )
    }
