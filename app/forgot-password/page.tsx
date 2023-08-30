"use client"

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function PasswordReset() {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    try {
      const authInstance = getAuth(); 
      await sendPasswordResetEmail(authInstance, email ,{
        url: 'http://localhost:3000/'
      });
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
    <div className='h-screen flex flex-col ml-[16rem] m-4'>
      <div>
        <h1 className='text-2xl font-bold'>Password Reset</h1>
        <p>{message}</p>
        {user ? (
          <div>
            <p>Hi,  {user?.email ? user?.email : "loading..."}</p>
            <button
              onClick={() => auth.signOut()}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-2 rounded'
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <Input type='email' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder='Enter your email' value={email} />    
            <Button onClick={handlePasswordReset}>Reset Password</Button>
          </div>
        )}
      </div>
    </div>
  );
}
