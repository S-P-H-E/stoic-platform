"use client"

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { AiOutlineGoogle } from 'react-icons/ai'
import { auth } from '@/utils/firebase'


export default function Login() {

    const [user, setUser] = useState({})

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [isLoginMode, setIsLoginMode] = useState(false); // Add this state


    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        } catch (error) {
            alert((error as Error).message);
        }
    }

    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginEmail)
        } catch (error) {
            alert((error as Error).message);
        }
    }

    const logout = async () => {
        await signOut(auth)
    }

    const changeForm = () => {
        console.log('Button clicked');
        setIsLoginMode(!isLoginMode);
    }

  return (
    <>
    <div className='flex flex-col gap-6 w-[27rem] border border-[--border] shadow-xl p-7 rounded-xl pb-8'>
    {isLoginMode ? (
    <>
        <div>
            <h1 className='text-2xl font-medium'>Sign in to your account</h1>
            <p className='text-[--highlight]'>Enter your email below to login your account</p>
        </div>

        <div className='flex flex-col justify-start items-center w-full'>
        <Button>
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
            <Input type='email' placeholder="Enter your email here" eye={false} onchange={(event: any) => setRegisterEmail(event.target.value)}/>
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input type='password' placeholder="Enter your password here" eye={true} onchange={(event: any) => setRegisterPassword(event.target.value)}/>
        </div>
        <Button onClick={register}>Sign In</Button>
        <p className='text-sm text-stone-400 gap-1 flex'>Dont have an account?<button className='text-sm text-stone-400 underline' onClick={changeForm}>Register</button></p>
    </>
    ) : (
    <>
        <div>
            <h1 className='text-2xl font-medium'>Create an account</h1>
            <p className='text-[--highlight]'>Enter your email below to create your account</p>
        </div>

        <div className='flex flex-col justify-start items-center w-full'>
            <Button>
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
            <Input type='email' placeholder="Enter your email here" eye={false} onchange={(event: any) => setRegisterEmail(event.target.value)}/>
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input type='password' placeholder="Enter your password here" eye={true} onchange={(event: any) => setRegisterPassword(event.target.value)}/>
        </div>
        <Button onClick={register}>Sign Up</Button>
        <p className='text-sm text-stone-400 gap-1 flex'>Already have an account?<button className='text-sm text-stone-400 underline' onClick={changeForm}>Login</button></p>
    </>
    )}
    </div>
    </>
  )
}