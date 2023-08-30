import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


export const updateUserDisplayName = async (userId : any, newName : any) => {
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, { name: newName });
    console.log('Name updated successfully!');
  } catch (error) {
    console.error('Error updating name:', error);
    console.log('User ID:', userId);
    console.log('New Name:', newName);
  }
};