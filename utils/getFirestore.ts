import { message } from "antd";
import { db } from "./firebase";
import { isUserAllowedToFetch } from "./utils";
import { collection, doc, onSnapshot, orderBy, query, getDocs } from "firebase/firestore";
import { Course, Task, Lesson } from "@/types/types";

export const fetchUserTasks = (
  userStatus: string | undefined,
  userId: string | null | undefined,
  onUpdate: (tasks: Array<Task>) => void
): (() => void) => {
  const isAllowed = isUserAllowedToFetch(userStatus);

  if (isAllowed && userId) {
    const userTasksRef = collection(db, 'users', userId, 'tasks');
    const orderedQuery = query(
      userTasksRef,
      /* where('completed', '==', false), */
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
      const userTasks: Array<Task> = querySnapshot.docs.map((doc) => {
        const taskData = doc.data();
        return {
          id: doc.id,
          name: taskData.name,
          description: taskData.description,
          createdAt: taskData.createdAt,
          completed: taskData.completed
        };
      });

      onUpdate(userTasks);
    });

    return unsubscribe;
  } else {
    message.error('You are not allowed to take this action');
    return () => {};
  }
};

export const fetchCourses = (
  userStatus: string | undefined,
  onUpdate: (courses: Array<Course>) => void
): (() => void) => {
  const isAllowed = isUserAllowedToFetch(userStatus);

  if (isAllowed && userStatus !== undefined) {
    const coursesRef = collection(db, 'courses');
    const unsubscribe = onSnapshot(coursesRef, async (querySnapshot) => {
      const courses: Array<Course> = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const courseData = doc.data();
          const lessonsQuery = query(collection(doc.ref, 'lessons'), orderBy('order'));
          const lessonsSnapshot = await getDocs(lessonsQuery);

          const lessons: Array<Lesson> = lessonsSnapshot.docs.map((lessonDoc) => {
            const lessonData = lessonDoc.data();
            return {
              description: lessonData.description,
              order: lessonData.order,
              thumbnail: lessonData.thumbnail,
              title: lessonData.title,
              url: lessonData.url || '',
              content: lessonData.content || '',
              endText: lessonData.endText || '',
              id: lessonDoc.id,
              createdAt: lessonData.createdAt || '',
              type: lessonData.type || "video",
              locked: lessonData.locked || false
            };
          });

          return {
            id: doc.id,
            name: courseData.name,
            image: courseData.image,
            description: courseData.description,
            locked: courseData.locked || false,
            lessons: lessons,
          };
        })
      );
      onUpdate(courses);
    });

    return unsubscribe;
  } else {
    message.error('You are not allowed to take this action');
    return () => {};
  }
};

export const fetchSingleCourse = (
  userStatus: string | undefined,
  courseId: string | undefined,
  onUpdate: (course: Course | null) => void
): (() => void) => {
  const isAllowed = isUserAllowedToFetch(userStatus);

  if (isAllowed && courseId) {
    const courseRef = doc(db, 'courses', courseId);
    const unsubscribe = onSnapshot(courseRef, async (courseDoc) => {
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        const lessonsQuery = query(collection(courseRef, 'lessons'), orderBy('order'));
        const lessonsSnapshot = await getDocs(lessonsQuery);

        const lessons: Array<Lesson> = lessonsSnapshot.docs.map((lessonDoc) => {
          const lessonData = lessonDoc.data();
          const lessonId = lessonDoc.id;
          return {
            description: lessonData.description,
            order: lessonData.order,
            thumbnail: lessonData.thumbnail,
            title: lessonData.title,
            url: lessonData.url || '',
            content: lessonData.content || '',
            endText: lessonData.endText || '',
            id: lessonId,
            createdAt: lessonData.createdAt || '',
            type: lessonData.type || "video",
            locked: lessonData.locked || false
          };
        });

        const course: Course = {
          id: courseDoc.id,
          name: courseData.name,
          image: courseData.image,
          description: courseData.description,
          lessons: lessons,
          locked: courseData.locked || false
        };

        onUpdate(course);
      } else {
        onUpdate(null);
      }
    });

    return unsubscribe;
  } else {
    message.error('You are not allowed to take this action');
    return () => {};
  }
};

export const fetchSingleLessonWithCourse = (
  userStatus: string | undefined,
  courseId: string | undefined,
  lessonId: string | undefined,
  onUpdate: (lessonWithCourse: { lesson: Lesson | null, course: Course | null }) => void
): (() => void) => {
  const isAllowed = isUserAllowedToFetch(userStatus);

  if (isAllowed && courseId && lessonId) {
    const courseRef = doc(db, 'courses', courseId);
    const lessonRef = doc(courseRef, 'lessons', lessonId);

    const unsubscribeLesson = onSnapshot(lessonRef, (lessonDoc) => {
      if (lessonDoc.exists()) {
        const lessonData = lessonDoc.data();

        const lesson: Lesson = {
          id: lessonDoc.id,
          description: lessonData.description,
          order: lessonData.order,
          thumbnail: lessonData.thumbnail,
          title: lessonData.title,
          url: lessonData.url || '',
          content: lessonData.content || '',
          endText: lessonData.endText || '',
          createdAt: lessonData.createdAt || '',
          type: lessonData.type || "video",
          locked: lessonData.locked || false
        };

        // Fetch course details
        const unsubscribeCourse = onSnapshot(courseRef, (courseDoc) => {
          if (courseDoc.exists()) {
            const courseData = courseDoc.data();

            const course: Course = {
              id: courseDoc.id,
              name: courseData.name,
              image: courseData.image,
              description: courseData.description,
              locked: courseData.locked || false,
              lessons: [],  // You can leave this empty as lessons were already fetched separately
            };

            onUpdate({ lesson, course });
          } else {
            onUpdate({ lesson: null, course: null });
          }
        });

        return () => {
          unsubscribeCourse();
        };
      } else {
        onUpdate({ lesson: null, course: null });
      }
    });

    return () => {
      unsubscribeLesson();
    };
  } else {
    message.error('You are not allowed to take this action');
    return () => {};
  }
};