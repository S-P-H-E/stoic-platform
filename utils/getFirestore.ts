import { message } from "antd";
import { db } from "./firebase";
import { isUserAllowedToFetch } from "./utils";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Task } from "@/types/types";

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