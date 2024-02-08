import {auth, db} from '@/utils/firebase';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import React, {useState, useTransition} from 'react'
import {useAuthState} from 'react-firebase-hooks/auth';
import Input from '@/components/UI Elements/Input';
import Button from '@/components/UI Elements/Button';
import {message} from 'antd';
import clsx from 'clsx';
import {collection, getDocs, query, where} from "firebase/firestore";

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

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setUIMessage('Please enter a valid email address.');
                return;
            }

            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(usersRef, where('email', '==', email), where('custom', '==', true)));

            if (querySnapshot.empty) {
                setUIMessage("Sorry, we couldn't find an account with this email.");
                return
            }

            const userData = querySnapshot.docs[0].data();

            if (!userData.hasOwnProperty('password')) {
                setUIMessage('Looks like you signed up with Google or Twitter, use those to log in.');
                return;
            }

            const authInstance = getAuth();
            await sendPasswordResetEmail(authInstance, email, {
                url: process.env.NEXT_PUBLIC_APP_DOMAIN!
            });

            setUIMessage('Password reset email sent. Check your inbox.');
            message.success("Password reset email sent successfully")
        } catch (error) {
            console.log(error)
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "Something went wrong, please ensure your email is correct";
            message.error(errorMessage);
            setUIMessage(errorMessage);
        } finally {
            setIsLoading(false)
        }
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            await handlePasswordReset();
        }
    };

    return (
        <div className='p-8 flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold mb-1'>Reset your password</h1>
            <p className="font-light text-sm text-stone-400">Enter your account&apos;s email below to reset your password.</p>
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
                    <Input onKeyDown={handleKeyPress} type='email' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder='Enter your email' value={email}/>
                    <Button onClick={handlePasswordReset} disabled={isLoading} className={clsx({'text-highlight': isLoading})}>{isLoading ? 'Proceeding...' : 'Send email'}</Button>
                </div>
            )}
            <p className="text-highlight font-light mt-2 text-center">{uiMessage}</p>
        </div>
    );
}
