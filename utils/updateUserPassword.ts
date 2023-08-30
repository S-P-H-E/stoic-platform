import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


export const updateUserDisplayName = async (userId : string, newPassword : string) => {
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, { password: newPassword });
    console.log('Password updated successfully!');
  } catch (error) {
    console.error('Error updating password:', error);
    console.log('User ID:', userId);
    console.log('New Password:', newPassword);
  }
};