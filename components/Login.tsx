import React from 'react'
import Input from './Input'
import Button from './Button'
import { AiOutlineGoogle } from 'react-icons/ai'
import { BsFillEyeFill } from 'react-icons/bs'

export default function Login() {
  return (
    <div className='flex flex-col gap-6 border border-[--border] shadow-xl p-7 rounded-xl'>
        <div>
            <h1 className='text-2xl font-medium'>Create an account</h1>
            <p className='text-[--highlight]'>Enter your email below to create your account</p>
        </div>

        <div className='flex flex-col justify-start items-center w-full'>
            <Button onclick={null} icon={<AiOutlineGoogle />} title="Google" />
            <div className="inline-flex items-center justify-center w-full pt-2">
                <hr className="h-px my-5 border-0 bg-[--border] w-full" />
                <span className="absolute px-3 font-medium -translate-x-1/2 bg-[--bg] text-[--highlight] left-1/2 ">OR CONTINUE WITH</span>
            </div>
        </div>

        <div>
            <h1 className='text-lg font-medium'>Email</h1>
            <Input type='email' placeholder="Enter your email here" />
        </div>
        <div>
            <h1 className='text-lg font-medium'>Password</h1>
            <Input type='password' placeholder="Enter your password here" icon={<BsFillEyeFill />}/>
        </div>
    </div>
  )
}
