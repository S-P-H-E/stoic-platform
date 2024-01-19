import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const updateUserDetails = async (userId: string, details: Record<string, any>): Promise<void> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, details);
      console.log('User details updated successfully');
    } catch (error: any) {
      console.error('Error updating user details:', error.message);
      throw error;
    }
  };