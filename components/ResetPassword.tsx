"use client"

import { auth } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import React, { useState } from 'react'
import Input from './Input';
import Button from './Button';

export default function ResetPassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
  
    const handleSubmit = async () => {
      try {
        if (auth.currentUser) {
          const email = auth.currentUser.email;
          
            const credential = EmailAuthProvider.credential(email, currentPassword);
  
          // reauthenticates the user with their password & email
          await reauthenticateWithCredential(auth.currentUser, credential);
  
          // updates the password
          await updatePassword(auth.currentUser, newPassword);
          
          console.log("Password updated successfully!");
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error updating password:", (error as Error).message);
      }
    };
  
    const { userName, user, loading, userId } = UserDataFetcher();
    return (
  
        <div className="flex flex-col border border-[--border] rounded-lg p-8">
          <h1 className='text-2xl font-bold mb-4 text-center'>Change Password</h1>
            <div className="flex flex-col gap-2">
            <Input eye={true} type="password" placeholder="Type your old password" onChange={(event: any) => setCurrentPassword(event.target.value)}/>
            <Input eye={true} type="password" placeholder="Type your new password" onChange={(event: any) => setNewPassword(event.target.value)}/>
            <Button onClick={handleSubmit}>Set your password</Button>
        </div>
        </div>
    );
  }
