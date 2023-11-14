"use client"
import React, { useEffect, useState } from 'react'
import Input from '../UI Elements/Input'
import Button from '../UI Elements/Button'
import {BiLogOut} from 'react-icons/bi'
import { UserDataFetcher } from '@/utils/userDataFetcher'
import { db } from '@/utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { message } from 'antd';
import PasswordModal from './PasswordModal'
import ProfilePhotoUplaod from './ProfilePhotoUpload'
import UserImage from '../UserImage'
import { validateNameLength } from '@/utils/validation'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { useFirebase } from '@/utils/authContext'

export default function AccountSettings() {
  const { userName, user, userId } = UserDataFetcher();
  const {signOut} = useFirebase();

  const [displayName, setDisplayName] = useState("")
  const [MenuOpen, setMenuOpen] = useState(false)
  const [imgMenuOpen, setImgMenuOpen] = useState(false)
  
  const [hasPassword, setHasPassword] = useState(false);

  const [nameErrorUI, setNameErrorUI] = useState(false)

  const closePasswordModal = () => {
    setMenuOpen(false);
  };

  const closeImageModal = () => {
    setImgMenuOpen(!imgMenuOpen)
  }

  const handleUpdateDisplayName = async () => {

    if (userId && displayName.trim() !== '') {
      const validationErrors = [];

      const nameError = validateNameLength(displayName);
      if (nameError) {
        validationErrors.push("Name cannot be empty or longer than 21 characters.");
        setNameErrorUI(true)
      }

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          message.error(error);
        });
        return;
      }

      try {
        await updateDoc(doc(db, 'users', userId), { name: displayName });

        message.success("Display name changed successfully!");
        setDisplayName('');

      } catch (error) {
        message.error("Something went wrong when changing display name");
      }
    }
  };

  useEffect(() => {
    async function checkPasswordField() {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);

        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            // Check if the user has a password field in Firestore
            if (userData.password) {
              setHasPassword(true);
            }
          }
        } catch (error) {
          console.error('Error checking password field:', error);
        }
      }
    }

    checkPasswordField();
  }, [userId]);

  
  return (
    <div className="flex flex-col h-full w-full sm:flex-none">
    {MenuOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div>
            <PasswordModal onClose={closePasswordModal}/>
          </div>
        </div>
      )}

    <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl 2xl:text-4xl pb-8">Account Setings</h1>
      <div className="border-[--border] border rounded-lg">
        <div className="w-full h-2/6 px-4 md:px-12">
          <div className='2xl:py-8 md:py-4 py-4 px-0 flex items-center justify-between gap-4'>
            <div className="flex items-center gap-4">
              <div className='rounded-full bg-transparent 2xl:w-32 2xl:h-32 md:h-28 md:w-28 h-20 w-20'>
                <UserImage/>
              </div>
                <div>
                  <h1 className="2xl:text-4xl lg:text-3xl md:text-2xl font-medium">{userName ? userName : 'loading...'}</h1>
                  <h2 className='text-light text-[--highlight] 2xl:text-lg lg:text-base text-sm'>{userName ? user?.email : "loading..."}</h2>
                  
                </div>
              </div>

              <div className="gap-2 lg:flex flex-col lg:w-[25%] md:w-40 h-32 items-center justify-center hidden">
              <Button onClick={() => signOut()} className='bg-red-600 hover:bg-red-500 lg:font-medium 2xl:text-lg md:text-base gap-3 !ring-red-500/50'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
          <hr className='border-[--border]'/>
          <div className='flex flex-col md:mt-6 mt-6 2xl:mt-16 md:text-2xl 2xl:text-3xl font-medium gap-2'>
            <div className="2xl:mb-8 mb-4 gap-2 flex flex-col">
              <h1>Display Name</h1>
              <div className="flex-col flex md:flex-row gap-3">
                <Input value={displayName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDisplayName(event.target.value)} className="font-normal text-lg" type='text' placeholder={userName ? userName : 'loading...'}/>
                <Button onClick={handleUpdateDisplayName} className='lg:font-medium 2x:text-lg md:text-base gap-3 md:max-w-[25%]'>
                  Update
                </Button>
              </div>
            </div>

            <div className="2xl:mb-6 mb-4 gap-2 flex flex-col">
              <h1>Email</h1>
              <p className='text-[--highlight] lg:text-xl'>{userName ? user?.email : "loading..."}</p>
            </div>

            <div className="2xl:mb-6 lg:mb-4 mb-0 gap-2 flex flex-col w-full md:w-64">
              <h1>User Image</h1>
              {userId ? 
              <Dialog>
                <DialogTrigger onClick={() => setImgMenuOpen(!imgMenuOpen)}>
                  <Button className='font-normal text-base lg:text-lg'>Update</Button>
                </DialogTrigger>
                <DialogContent>
                  <ProfilePhotoUplaod onClose={closeImageModal}/>
                </DialogContent>
              </Dialog>
              :null
              }
            </div>

            { hasPassword &&
              <div className="2xl:mb-6 lg:mb-4 mb-0 gap-2 flex flex-col md:w-64">
                <h1>Password</h1>
                <Button onClick={() => setMenuOpen(true)} className='font-normal text-base lg:text-lg'>Change Password</Button>
              </div>
            }


            <div className="md:w-40 items-center justify-center lg:hidden mt-6 mb-3">
              <Button onClick={() => signOut()} className='bg-red-600 hover:bg-red-500 font-normal 2x:text-lg md:text-base !ring-red-500/50'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
