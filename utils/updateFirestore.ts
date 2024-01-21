import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isUserAllowedToFetch, sanitizeString } from './utils';
import {message} from 'antd'

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