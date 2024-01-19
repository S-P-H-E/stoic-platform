"use client"

import Button from '@/components/UI Elements/Button'
import Input from '@/components/UI Elements/Input'
import { auth, db } from '@/utils/firebase'
import { validatePassword } from '@/utils/validation'
import { message } from 'antd'
import clsx from 'clsx'
import { confirmPasswordReset } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { FiLoader } from 'react-icons/fi'

export default function ChangePassword() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  async function resetPassword(oobcode: string, newPassword: string) {

    const validationErrors = [];
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      validationErrors.push("Password must follow the security rules");
    }
  
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        message.error(error);
      });
    }
    
    try {
      setIsLoading(true)
      await confirmPasswordReset(auth, oobcode, newPassword);
      message.success('Password changed successfully');
      router.push('/')
    } catch (error) {
      if (validationErrors.length == 0) {
        message.error('Password reset failed');
      }
    } finally {
      setIsLoading(false)
    }
  }
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const oobCode = searchParams.get('oobCode')
  const continueUrl = searchParams.get('continueUrl')

  const [newPassword, setnewPassword] = useState('')

  return (
    <Suspense>
    <div className="flex flex-col items-center justify-center h-screen gap-3 w-full">
      {mode === 'resetPassword' ? (
        oobCode ? (
          <div className="sm:w-[24rem]">
            <h1 className="text-2xl font-semibold text-center mb-4">Reset your password</h1>
            <form
              className="flex flex-col gap-3"
              onSubmit={async e => {
                e.preventDefault()
                resetPassword(oobCode, newPassword)
              }}>
              <Input placeholder={"Enter your new password"} type='text' value={newPassword} onChange={e => setnewPassword(e.target.value)}/>
              <div className="gap-2 flex flex-col">
              <Button
              disabled={isLoading}
              type='submit'
              className={clsx({
                'text-gray-400': isLoading, // Apply the 'text-gray-400' class when isLoading is true
              })}>
              { isLoading ? <FiLoader className="animate-spin my-1"/> : <p>Reset Password </p>}
            </Button>
            <p className="text-stone-400 text-sm font-light">Your password should be at least 8 digits, have uppercase and a number</p>
            </div>
            </form>
          </div>
        ) : (
          <p>Invalid Request</p>
        )
      ) : (
        <p>Invalid Mode</p>
      )}
    </div>
    </Suspense>
  )
}