"use client"

import { auth, db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import React, { useState } from 'react'
import Input from './Input';
import Button from './Button';
import {CgClose} from 'react-icons/cg'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { validatePassword } from '@/utils/validation'
import { message } from 'antd';
import InputResponse from './InputResponse';

type FirebaseError = {
  code: string;
  message: string;
};

interface PasswordModalProps {
  onClose: () => void;
}

export default function PasswordModal({ onClose }: PasswordModalProps) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [wrongPasswordErrorUI, setWrongPasswordErrorUI] = useState(false);
    const [passwordErrorUI, setPasswordErrorUI] = useState(false);

    const firebaseErrorMessages: Record<string, string> = {
      "auth/wrong-password": "Old password is incorrect.",
      "auth/missing-password": "The password is missing.",
      "auth/weak-password": "Password cannot be shorter than 8 digits",
      "auth/user-not-found": "The email address is not associated with an existing account.", 
      "auth/too-many-requests": "Too many tries, please try again later",
    }
  
    const handleSubmit = async () => {
      try {
        const validationErrors = [];
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          validationErrors.push("Password must follow the security rules");
          setPasswordErrorUI(true)
        }
        if (validationErrors.length > 0) {
          // Display all validation errors
          validationErrors.forEach((error) => {
            message.error(error);
          });
          // Optionally, set state variables like setEmailErrorUI and setPasswordErrorUI to true here if needed.
          return;
        }

        if (auth.currentUser) {
          const email: string | null = auth.currentUser.email;
          
          if (email) {
            const credential = EmailAuthProvider.credential(email, currentPassword);
  
            // reauthenticates the user with their password & email
            await reauthenticateWithCredential(auth.currentUser, credential);  
            // updates the password
            await updatePassword(auth.currentUser, newPassword);
          }
    
          let updated = false; 
          if (userId && !updated) {


            const userDocRef = doc(db, 'users', userId);
            

            const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
              if (snapshot.exists()) {
                // The user document exists, and we haven't updated the count yet
                if (!updated) {
                  const userData = snapshot.data();
                    updateDoc(userDocRef, {
                      password: newPassword
                    });
            
                  updated = true;
                  unsubscribe();
                  message.success("Password updated succesfully")
                }
              } else {
                console.error('User document does not exist.');
              }
            });
          }
          onClose();

        } else {
          console.log("User not found");
        }
      } catch (error) {
        const firebaseError = error as FirebaseError;
        const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
        const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";
        if (errorMessage === 'auth/wrong-password') {
          setWrongPasswordErrorUI(true)
        }
        message.error(errorMessage);
        console.log(error)
      }
    };

  
    const { user, userId } = UserDataFetcher();
    return (
  
        <div className="relative flex flex-col border border-[--border] rounded-lg p-8 bg-black">
          <button className='absolute top-4 right-4 text-[--highlight] hover:text-white transition cursor-pointer'>
            <CgClose onClick={() => onClose()} size="20"/>
          </button>
          
          <h1 className='text-2xl font-bold mb-4 pt-2 text-center'>Change Password</h1>
            <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 mb-4">
            <Input eye={true} type="password" placeholder="Type your old password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(event.target.value)}/>
            <Input eye={true} type="password" placeholder="Type your new password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}/>
            {passwordErrorUI &&
            <InputResponse>Invalid password format</InputResponse>
            }
            {wrongPasswordErrorUI &&
            <InputResponse>Old password isnt right</InputResponse>
            }
            </div>
            <Button onClick={handleSubmit}>Set your password</Button>
        </div>
        </div>
    );
  }