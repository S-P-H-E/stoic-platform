"use client"

import { auth, db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import React, { useState } from 'react'
import Input from './Input';
import Button from './Button';
import {CgClose} from 'react-icons/cg'
import { doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';

interface PasswordModalProps {
  onClose: () => void;
}

export default function PasswordModal({ onClose }: PasswordModalProps) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
  
    const handleSubmit = async () => {
      try {
        if (auth.currentUser) {
          const email: string | null = auth.currentUser.email;
          
          //@ts-ignore
            const credential = EmailAuthProvider.credential(email, currentPassword);
  
          // reauthenticates the user with their password & email
          await reauthenticateWithCredential(auth.currentUser, credential);  
          // updates the password
          await updatePassword(auth.currentUser, newPassword);


          let updated = false; 
          if (userId && !updated) {
            const userDocRef = doc(db, 'users', userId);
            const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
              if (snapshot.exists()) {
                // The user document exists, and we haven't updated the count yet
                if (!updated) {
                  // Increment the 'passwordUpdateCount' field by 1
                  const currentCount = snapshot.data().passwordUpdateCount || 0;
                  updateDoc(userDocRef, {
                    passwordUpdateCount: currentCount + 1,
                  });
                  
                  updated = true;
                  unsubscribe();
                }
              } else {
                console.error('User document does not exist.');
              }
            });
          }

          console.log("Password updated successfully!");
          onClose();

        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error updating password:", (error as Error).message);
      }
    };

  
    const { userName, user, userId } = UserDataFetcher();
    return (
  
        <div className="relative flex flex-col border border-[--border] rounded-lg p-8 bg-black">
          <button className='absolute top-4 right-4 text-[--highlight] hover:text-white transition cursor-pointer'>
            <CgClose onClick={() => onClose()} size="20"/>
          </button>
          
          <h1 className='text-2xl font-bold mb-4 pt-2 text-center'>Change Password</h1>
            <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 mb-4">
            <Input eye={true} type="password" placeholder="Type your old password" onChange={(event: any) => setCurrentPassword(event.target.value)}/>
            <Input eye={true} type="password" placeholder="Type your new password" onChange={(event: any) => setNewPassword(event.target.value)}/>
            </div>
            <Button onClick={handleSubmit}>Set your password</Button>
        </div>
        </div>
    );
  }
