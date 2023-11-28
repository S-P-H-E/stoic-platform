"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import Image from 'next/image';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { BiFilm, BiLogoInstagram, BiVideo, BiX } from 'react-icons/bi';
import UserProfileDialog from './UserProfileDialog';
import { ButtonShad } from './ui/buttonshad';
import { AiOutlinePlus } from 'react-icons/ai';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Check } from 'lucide-react';
import { message } from 'antd';
import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export default function UserProfile({src, userName, userId, userStatus, userBannerUrl, userRoles, roles}: {userId: string | null, roles: Role[], src: string, userName: string, userStatus: string, userBannerUrl: string, userRoles: Role[] |"User"}) {
  const userChar: string = userName ? userName : '';
  const [userStatusEdited, setUserStatusEdited] = useState('Loading...')
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (userStatus === 'user') {
      setUserStatusEdited('Free')
    } else if (userStatus === 'premium') {
      setUserStatusEdited('Premium')
    } else if (userStatus === 'admin') {
      setUserStatusEdited('Admin')
    } else {
      setUserStatusEdited('')
    }
  }, [userStatus])

  const statusClass = clsx({
    'text-yellow-500': userStatus === 'admin',
    'text-orange-500': userStatus === 'premium',
    'text-gray-500': userStatus === 'user'
  });

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const { userStatus: currentUserStatus } = UserDataFetcher();
  
  const addRole = async () => {
    try {
      if (currentUserStatus === 'admin' && userId) {
        const userDocRef = doc(db, 'users', userId);

        let updatedRoles = [];

        if (userRoles === "User") {
          updatedRoles = [...selectedValues];
        } else {
          const userRoleNames = userRoles.map((role) => role.name);

          // Combine the extracted names with selectedValues
          updatedRoles = [...userRoleNames, ...selectedValues];
        }
  
        const userData = {
          roles: updatedRoles, // Store roles as a flat array
        };
  
        await updateDoc(userDocRef, userData);
        message.success('Role added successfully!');

        setSelectedValues([]);
      } else {
        message.error('An error occurred.. try again later');
      }
    } catch (error) {
      console.log(error)
      message.error('Failed to add role.');
    }
  };

  function handleRemoveRole(roleName: string) {
    try {
      if (Array.isArray(userRoles) && currentUserStatus == "admin" && userId) {
        const updatedRoles = userRoles.filter((role: Role) => role.name !== roleName);
  
        const userDocRef = doc(db, 'users', userId as string);
  
        const userData = {
          roles: updatedRoles.map((role) => role.name), // Store roles as a flat array of names
        };
  
        // Update the user document by deleting the specified role
        updateDoc(userDocRef, userData);
        message.success('Role removed successfully!');
      }

    } catch (error) {
      console.error(error);
      message.error('Failed to remove role.');
    }
  }
    
  return (
    <div className='flex flex-col md:w-[450px] w-[350px] gap-4 p-1'>
      <div className='flex flex-col gap-4 w-full items-start'>
        <div className='h-[140px] w-full relative rounded aspect-auto'>
          {userBannerUrl ? 
            <Image src={userBannerUrl} fill alt='image' className='object-cover rounded-2xl w-[500px]'/>
          : 
            <div className='w-full h-full bg-white rounded-2xl'/>
          }
        </div>
        <Dialog>
          <DialogTrigger>
            <div className="absolute top-[6rem] left-4 group border-[9px] border-[black] rounded-full">
              <Avatar className="w-[6rem] h-[6rem]">
                <AvatarImage src={src ?? undefined} />
                {/* Display the first letter of the userName */}
                <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-950/70 opacity-0 scale-[1.3] duration-200 group-hover:opacity-100 group-hover:scale-100 transition">
                  <span className="text-xs flex">VIEW PROFILE</span>
                </div>
              </Avatar>
              <div className={clsx('z-50 w-fit h-fit bg-[black] absolute top-[70px] right-0 rounded-full border-4 border-[black]', statusClass)}>
                <HiMiniCheckBadge size={30}/>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-[--background]">
            <UserProfileDialog userBannerUrl={userBannerUrl} userStatus={userStatusEdited ?? undefined} userName={userName} src={src}/>
          </DialogContent>
      </Dialog>
      <div className='py-4 md:px-7 px-2 mt-8 flex flex-col w-full h-full rounded-lg gap-2'>
          <div className="flex flex-col w-full h-full">


          <h1 className={clsx(
              "text-2xl leading-6 font-semibold",
              userRoles && userRoles !== "User" && userRoles.length > 0 && userRoles[0]?.color && `text-${userRoles[0].color}`
              )}>
              {userName ? userName : 'Loading...'}
            </h1>
            
            <h2 className={clsx("text-md leading-6 py-1", statusClass)}>{userStatusEdited}</h2>
          </div>

          <hr className='border-[--border]'/>

          <div className='flex flex-col'>
            <h1 className='text-lg font-medium'>INFO</h1>
            <div className='flex justify-between pb-5 pt-2'>
              <div className='bg-white text-black w-fit py-1 px-2 md:py-1 md:px-3 rounded-full flex items-center gap-2 text-xs md:text-sm font-semibold'>
                <BiFilm size={15}/>
                After Effects
              </div>
              <div className='bg-white text-black w-fit py-1 px-2 md:py-1 md:px-3 rounded-full flex items-center gap-2 text-xs md:text-sm font-semibold'>
                <BiLogoInstagram size={15}/>
                Instagram
              </div>
              <div className='bg-white text-black w-fit py-1 px-2 md:py-1 md:px-3 rounded-full flex items-center gap-2 text-xs md:text-sm font-semibold'>
                <BiVideo size={15}/>
                Short Form
              </div>
            </div>

            <div className='border border-[#2C2C2C] bg-[#0f0f0f] rounded-xl p-3 gap-3 flex flex-col'>
              <h1>ROLES</h1>
              <div className='flex flex-wrap gap-3 items-center text-lg'>
              {userRoles && (
              <>
                {userRoles === 'User' ? (
                  <div className="bg-white text-black flex px-4 py-2 h-10 rounded-md gap-2 items-center">
                    <HiMiniCheckBadge />
                    <h1>User</h1>
                  </div>
                ) : (
                  <>
                  {userRoles
                    .sort((a, b) => {
                      const orderA = roles.find(role => role.name === a.name)?.order || 0;
                      const orderB = roles.find(role => role.name === b.name)?.order || 0;
                      return orderA - orderB;
                    })
                    .map((role) => (
                      <div
                        className={clsx(`bg-${role.color} flex px-4 py-2 h-10 rounded-md gap-2 items-center`)}
                        key={role.id}
                      >
                        <HiMiniCheckBadge />
                        <h1>{role.name}</h1>
                        {currentUserStatus == "admin" &&
                          <BiX
                            className="cursor-pointer"
                            onClick={() => handleRemoveRole(role.name)} // Implement the function to remove the role
                          />
                        }
                      </div>
                    ))}
                    <div className="bg-white text-black flex px-4 py-2 h-10 rounded-md gap-2 items-center">
                    <HiMiniCheckBadge />
                      <h1>User</h1>
                    </div>
                  </>
                )}
              </>
              )}
              {currentUserStatus == "admin" &&
                <Popover>
                <PopoverTrigger asChild>
                <ButtonShad
                   variant="outline"
                    className="group border-dotted border-2 px-4 py-2 gap-1 h-10"
                  >
                    Add roles
                    <AiOutlinePlus className="group-hover:scale-110 transition"/>
                 </ButtonShad>
                </PopoverTrigger>
                <PopoverContent>
                <Command>
                <CommandInput placeholder="Search role..." />
                  <CommandEmpty className="gap-2 flex flex-col items-center justify-center py-4">
                     <p>No role found.</p>
                      <Dialog>
                        <DialogTrigger>
                          <ButtonShad variant="outline">Create role</ButtonShad>
                         </DialogTrigger>
                         <DialogContent>
                         {/* <CreateRole/> */}
                         </DialogContent>
                      </Dialog>
                       </CommandEmpty>
                       <CommandGroup>
                       {Array.isArray(userRoles) && 
                       
                        roles
                          .filter((role) => !userRoles.map((userRole: Role) => userRole.name).includes(role.name))
                          .map((role) => (
                            <CommandItem
                              key={role.id}
                              onSelect={() => toggleSelection(role.name)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={clsx(
                                  "mr-2 h-4 w-4",
                                  selectedValues.includes(role.name) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <h1 className={clsx(`text-${role.color}`)}>{role.name}</h1>
                            </CommandItem>
                          ))
                      }
                      </CommandGroup>
                  <div className="w-full items-center justify-center px-4 py-2 flex">
                    <ButtonShad disabled={selectedValues.length <= 0} className='w-60' variant="outline" onClick={addRole}>Apply</ButtonShad>
                  </div>
                </Command>
                </PopoverContent>
                </Popover>
              }
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  )
}
