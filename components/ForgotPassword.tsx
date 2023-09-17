import { auth } from '@/utils/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { message } from 'antd';
import clsx from 'clsx';

export default function ForgotPassword() {

  type FirebaseError = {
    code: string;
    message: string;
  };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [uiMessage, setUIMessage] = useState('');

    const firebaseErrorMessages: Record<string, string> = {
      "auth/invalid-email": "The email address is not valid.",
      "auth/missing-email": "The email address is missing.",
      "auth/wrong-password": "The password is incorrect.",
      "auth/missing-password": "The password is missing.",
      "auth/email-already-in-use": "The email address is already in use by another account.",
      "auth/user-not-found": "The email address is not associated with an existing account.", 
    }
  
    const handlePasswordReset = async () => {
      try {
        setIsLoading(true)
        const authInstance = getAuth(); 
        await sendPasswordResetEmail(authInstance, email ,{
          url: 'http://localhost:3000/'
        });
        setUIMessage('Password reset email sent. Check your inbox.');
        message.success("Password reset email sent sucessfully")
      } catch (error) {
        console.log(error)
        const firebaseError = error as FirebaseError;
        const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
        const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";
        message.error(errorMessage);
        setUIMessage(errorMessage);
      } finally {
        setIsLoading(false)
      }
    };
  
    return (
      <div className='p-8 flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold mb-1'>Reset your password</h1>
          <p className="font-light text-sm text-stone-400">Enter your account&apos;s email below to reset its password.</p>
          {user ? (
            <div>
              <button
                onClick={() => auth.signOut()}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-2 rounded'
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="w-full gap-3 flex flex-col mt-2">
              <Input type='email' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder='Enter your email' value={email} />    
              <Button onClick={handlePasswordReset} disabled={isLoading} className={clsx({'text-[--highlight]': isLoading })}>{isLoading  ? 'Proceeding...' : 'Send email'}</Button>
            </div>
          )}
          <p className="text-stone-400 font-light mt-2 text-center">{uiMessage}</p>
      </div>
    );
}
