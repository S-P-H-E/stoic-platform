import { doc, updateDoc, setDoc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isUserAllowedToFetch, sanitizeString } from './utils';
import {message} from 'antd'
import { Course, Lesson } from '@/types/types';

export const updateUserDetails = async (
  userStatus: string | undefined,
  userId: string,
  details: Record<string, any>
): Promise<void> => {
  try {
    const isAllowed = isUserAllowedToFetch(userStatus)

    if (isAllowed) {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, details);
    }
    else {
      message.error('You are not allowed to take this action')
    }
  } catch (error: any) {
    /* console.error('Error updating user details:', error.message); */
    throw error;
  }
};

export const createNewTask = async (
  userStatus: string | undefined,
  userId: string | null | undefined,
  details: Record<string, any>
): Promise<void> => {
  try {
    const isAllowed = isUserAllowedToFetch(userStatus)
    if (isAllowed && userId) {
      const newName = sanitizeString(details.name)
      const taskDocRef = doc(db, 'users', userId, 'tasks', newName);

      const updatedDetails = details.description
      ? { ...details }
      : { ...details, description: '' };
      
      await setDoc(taskDocRef, updatedDetails);
    } else {
      message.error('You are not allowed to take this action')
    }
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

export const createNewLesson = async (
  type: "text" | "video",
  final: boolean,
  isAdmin: boolean,
  description: string | undefined,
  title: string,
  courseId: string,
  course: Course,
  locked: boolean,
  details: Record<string, any>
): Promise<void> => {
  try {
    if (!course) {
      message.error('This course does not exist!')
      return
    }

    if (final && isAdmin && title && details) {
      const lessonOrder = details.order || 1;
      const lessonName = sanitizeString(title);

      if (type === "video") {
        const lesson: Lesson = {
          description: description || '',
          order: lessonOrder,
          title: title,
          thumbnail: '',
          url: details.url || '',
          endText: details.endText || '',
          locked: locked || false,
          type: 'video',
          createdAt: new Date()
        };

        const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessonName);

        await setDoc(lessonDocRef, lesson);
      }

      //!  change ! ! ! 
      if (type === "text") {
        const lesson: Lesson = {
          description: description || '',
          order: lessonOrder,
          title: title,
          thumbnail: '',
          createdAt: new Date(),
          /* content: content, */
          endText: details.endText,
          type: 'text',
        };

        const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessonName);

        await setDoc(lessonDocRef, lesson);
      }

    } else {
      console.error('User is not allowed to take this action');
    }
  } catch (error: any) {
    console.error('Error creating new lesson:', error.message);
    throw error;
  }
}

export const createNewCourse = async (
  type: "public" | "locked",
  isAdmin: boolean,
  description: string | undefined,
  title: string,
  courseId: string,
  course: Course,
  imageSrc: string,
): Promise<void> => {
  try {
    if (course) {
      message.error('This course already exists!')
      return
    }

    if ( isAdmin && title && imageSrc) {

      if (type === "public") {
        const course: Course = {
          description: description || '',
          name: title,
          image: imageSrc || '',
        };

        const courseDocRef = doc(db, 'courses', courseId);

        await setDoc(courseDocRef, course);
      }

      //!  change ! ! ! 
      if (type === "locked") {
        const course: Course = {
          description: description || '',
          name: title,
          image: imageSrc || '',
          locked: true
        };

        const courseDocRef = doc(db, 'courses', courseId);

        await setDoc(courseDocRef, course);
      }

    } else {
      console.error('User is not allowed to take this action');
    }
  } 
  catch (error: any) {
    console.error('Error creating new lesson:', error.message);
    throw error
  }
}

export const updateExistingLesson = async (
  type: "text" | "video",
  isAdmin: boolean,
  courseId: string,
  lessonId: string,
  locked: boolean,
  details: Record<string, any>
): Promise<void> => {
  try {
    if (!isAdmin) {
      message.error('You are not allowed to take this action');
      return;
    }

    const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessonId);

    const existingLessonSnapshot = await getDoc(lessonDocRef);

    if (!existingLessonSnapshot.exists()) {
      message.error('This lesson does not exist!');
      return;
    }

    const existingLessonData = existingLessonSnapshot.data();

    if (type === "video") {
      const updatedLesson: Record<string, any> = {
        description: details.description || existingLessonData.description || '',
        order: details.order || existingLessonData.order || '',
        title: details.title || existingLessonData.title || '',
        url: details.url || existingLessonData.url || '',
        endText: details.endText || existingLessonData.endText || '',
        locked: locked,
        type: 'video',
        thumbnail: existingLessonData.thumbnail || '',
        createdAt: existingLessonData.createdAt || new Date() || '',
      };

      await updateDoc(lessonDocRef, updatedLesson);
    }

    if (type === "text") {
      const updatedLesson: Record<string, any> = {
        description: details.description || existingLessonData.description || '',
        order: details.order || existingLessonData.order || '',
        title: details.title || existingLessonData.title || '',
        thumbnail: existingLessonData.thumbnail || '',
        content: details.content || existingLessonData.content || '',
        createdAt: existingLessonData.createdAt || new Date() || '',
        locked: locked,
        endText: details.endText || existingLessonData.endText || '',
        type: 'text',
      };

      await updateDoc(lessonDocRef, updatedLesson);
    }
    
    message.success('Lesson updated successfully!');
  } catch (error: any) {
    console.error('Error updating lesson:', error.message);
    throw error;
  }
};

export const updateCourse = async (
  isAdmin: boolean,
  courseId: string,
  locked: boolean,
  imageSrc: string | undefined,
  details: Record<string, any>
): Promise<void> => {
  try {
    if (!isAdmin) {
      message.error('You are not allowed to take this action');
      return;
    }

    const courseDocRef = doc(db, 'courses', courseId);

    const existingCourseSnapshot = await getDoc(courseDocRef);

    if (!existingCourseSnapshot.exists()) {
      message.error('This course does not exist!');
      return;
    }

    const existingCourseData = existingCourseSnapshot.data();

    const updatedCourse: Record<string, any> = {
      description: details.description || existingCourseData.description || '',
      name: details.title || existingCourseData.name || '',
      image: imageSrc || existingCourseData.image || '',
      locked: locked || false,
    };

    await updateDoc(courseDocRef, updatedCourse);

    message.success('Course updated successfully!');
  } catch (error: any) {
    console.error('Error updating course:', error.message);
    throw error;
  }
};

export const deleteCourse = async (
  userStatus: string | undefined,
  courseId: string
): Promise<void> => {
  try {
    const isAllowed = userStatus === 'admin'

    if (!isAllowed) {
      message.error('You are not allowed to take this action');
      return;
    }

    const courseDocRef = doc(db, 'courses', courseId);

    const courseSnapshot = await getDocs(collection(courseDocRef, 'lessons'));
    const lessonDeletionPromises: Promise<void>[] = [];

    courseSnapshot.forEach((lessonDoc) => {
      const lessonDocRef = doc(courseDocRef, 'lessons', lessonDoc.id);
      const lessonDeletionPromise = deleteDoc(lessonDocRef);
      lessonDeletionPromises.push(lessonDeletionPromise);
    });

    await Promise.all(lessonDeletionPromises);

    // Delete the course itself
    await deleteDoc(courseDocRef);
  } catch (error: any) {
    console.error('Error deleting course:', error.message);
    throw error;
  }
};