"use client"

//Firebase
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { AiOutlineGoogle } from 'react-icons/ai'
import { auth, db } from '@/utils/firebase'
import { message } from 'antd';
import { useRouter } from "next/navigation";
import { validateEmail, validateNameLength, validatePassword } from '@/utils/validation'
import InputError from './InputError';

export default function Login() {
  const router = useRouter()
  const [user, loading] = useAuthState(auth);


  type FirebaseError = {
    code: string;
    message: string;
    // Other properties you might expect in a Firebase error
  };

  const firebaseErrorMessages: Record<string, string> = {
    "auth/invalid-email": "The email address is not valid.",
    "auth/missing-email": "The email address is missing.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/missing-password": "The password is missing.",
    "auth/email-already-in-use": "The email address is already in use by another account.",
    "auth/user-not-found": "The email address is not associated with an existing account.", 
  }

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
      try {
        // Google Auth
        const res = await signInWithPopup(auth, googleProvider);
        message.success("Signed in successfully");

        //Router
        router.push('/dashboard');

        // User
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", res.user.email));
        const querySnapshot = await getDocs(q);

        // Firestore
        if (querySnapshot.empty) {
          const docRef = await addDoc(userRef, {
            name: res.user.displayName,
            email: res.user.email,
            status: 'user',
          });
          console.log("Document written with ID:", docRef.id);
        } else {
          console.log("User exists");
        }
      } catch (err) {
        message.error("Error signing in");
        alert(err); // for debug
      }
    };

    // Email Auth

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")

    const [registerName, setRegisterName] = useState("")

    const [isLoginMode, setIsLoginMode] = useState(false); // Add this state

    const [passwordErrorUI, setPasswordErrorUI] = useState(false)

    const register = async () => {
      const nameError = validateNameLength(registerName);

      if (nameError) {
        message.error("Name cannot be longer than 21 characters.")
        return;
      }

      const emailError = validateEmail(registerEmail);

      if (emailError) {
        message.error("Email format is not valid.")
        return;
      }

      const passwordError = validatePassword(registerPassword);

      if (passwordError) {
        message.error("Password must follow the security rules");
        setPasswordErrorUI(true)
        return;
      }

        try {
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)

            const userEmail = user.user.email;
            const userName = registerName;

            const userRef = collection(db, "users");
            await addDoc(userRef, {
                name: userName,
                email: userEmail,
                password: registerPassword,
                passwordUpdateCount: 0,
                status: 'user',
            });


            router.push('/dashboard');
            message.success("Signed up successfully");
          } catch (error) {
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";
            message.error(errorMessage);
            console.log(error)
        }
    }

    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, registerEmail, registerPassword)
            message.success("Signed in successfully");
            router.push('/dashboard');
          } catch (error) {
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";
            message.error(errorMessage);
          }
    }

    // switches between login and register
    const changeForm = () => {
        setIsLoginMode(!isLoginMode);
    }

  return (
    <>
    <div className='mx-2 flex flex-col gap-6 w-[22rem] sm:w-[27rem] border border-[--border] shadow-xl p-7 rounded-xl pb-8'>
    {isLoginMode ? (
    <>
        <div>
            <h1 className='text-2xl font-medium'>Sign in to your account</h1>
            <p className='text-[--highlight]'>Enter your email below to login your account</p>
        </div>

        <div className='flex flex-col justify-start items-center w-full'>
        <Button onClick={handleLogin}>
              <AiOutlineGoogle />
              Google
            </Button>
            <div className="inline-flex items-center justify-center w-full pt-2">
                <hr className="h-px my-5 border-0 bg-[--border] w-full" />
                <span className="absolute px-3 font-medium -translate-x-1/2 bg-[--bg] text-[--highlight] left-1/2 ">OR CONTINUE WITH</span>
            </div>
        </div>

        <div>
            <h1 className='text-lg font-medium'>Email</h1>
            <Input value={registerEmail} type='email' placeholder="Enter your email here" eye={false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRegisterEmail(event.target.value)}/>
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input value={registerPassword} type='password' placeholder="Enter your password here" eye={true} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRegisterPassword(event.target.value)}/>
        </div>
        <Button onClick={login}>Sign In</Button>
        <p className='text-sm text-stone-400 gap-1 flex'>Dont have an account?<button className='text-sm text-stone-400 underline hover:text-stone-100 transition' onClick={changeForm}>Register</button></p>
    </>
    ) : (
    <>
        <div>
            <h1 className='text-2xl font-medium'>Create an account</h1>
            <p className='text-[--highlight]'>Enter your email below to create your account</p>
        </div>

        <div className='flex flex-col justify-start items-center w-full'>
        <Button onClick={handleLogin}>
              <AiOutlineGoogle />
              Google
            </Button>
            <div className="inline-flex items-center justify-center w-full pt-2">
                <hr className="h-px my-5 border-0 bg-[--border] w-full" />
                <span className="absolute px-3 font-medium -translate-x-1/2 bg-[--bg] text-[--highlight] left-1/2 ">OR CONTINUE WITH</span>
            </div>
        </div>

        <div>
            <h1 className='text-lg font-medium'>Username</h1>
            <Input value={registerName} type='text' placeholder="Enter your username here" eye={false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRegisterName(event.target.value)}/>
            {registerName.length > 21 && (
              <InputError>Username cannot be longer than 21 digits</InputError>
            )}
        </div>
        <div>
            <h1 className='text-lg font-medium'>Email</h1>
            <Input value={registerEmail} type='email' placeholder="Enter your email here" eye={false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRegisterEmail(event.target.value)}/>
            {registerEmail.length > 80 && (
                <InputError>Invalid email format</InputError>
            )}
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input value={registerPassword} type='password' placeholder="Enter your password here" eye={true} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRegisterPassword(event.target.value)}/>
            {passwordErrorUI &&
            <InputError>Password must contain at least 8 digits, a number and uppercase</InputError>
            }
        </div>
        <Button onClick={register}>Sign Up</Button>
        <p className='text-sm text-stone-400 gap-1 flex'>Already have an account?<button className='hover:text-stone-100 transition text-sm text-stone-400 underline' onClick={changeForm}>Login</button></p>
    </>
    )}
    </div>
    </>
  )
}