"use client"

//Firebase
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { auth, db } from "@/utils/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
//
import React from 'react'
import Input from './Input'
import Button from './Button'
import { AiOutlineGoogle } from 'react-icons/ai'
import { message } from 'antd';
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter()
    const [user, loading] = useAuthState(auth);

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
            });
            console.log("Document written with ID:", docRef.id);
          } else {
            console.log("User exists");
          }
        } catch (err) {
          message.error("Error signing in");
          console.error(err);
        }
      };

    return (
    <div className='flex flex-col gap-6 border border-[--border] shadow-xl p-7 rounded-xl pb-8'>
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
            <h1 className='text-lg font-medium'>Email</h1>
            <Input type='email' placeholder="Enter your email here" eye={false}/>
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input type='password' placeholder="Enter your password here" eye={true}/>
        </div>
        <Button className='bg-white text-black'>
            Create account
        </Button>
    </div>
  )
}