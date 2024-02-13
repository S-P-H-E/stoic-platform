'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import Image from 'next/image';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { BiFilm, BiLogoInstagram, BiVideo, BiX } from 'react-icons/bi';
import { ButtonShad } from './ui/buttonshad';
import { AiOutlinePlus } from 'react-icons/ai';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import { Check, LucideImagePlus } from 'lucide-react';
import { message } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Link from 'next/link';
import { FaPen } from 'react-icons/fa6';
import PhotoUpload from './Settings/ProfilePhotoUpload';
import BannerUpload from './Settings/BannerPhotoUpload';
import {detectAndStyleLinks, getUserRoleColor} from "@/utils/utils";

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export default function UserProfile({
  edit,
  src,
  userName,
  userDescription,
  black,
  userId,
  userStatus,
  userBannerUrl,
  userRoles,
  roles,
}: {
  userDescription: string | null | undefined;
  edit?: boolean;
  black?: boolean;
  userId: string | null;
  roles: Role[];
  src: string | undefined;
  userName: string;
  userStatus: string;
  userBannerUrl: string | undefined;
  userRoles: Role[] | 'User';
}) {
  const userChar: string = userName ? userName : '';
  const [userStatusEdited, setUserStatusEdited] = useState('Loading...');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const isAuthorized = userStatus !== 'user';

  useEffect(() => {
    if (userStatus === 'user') {
      setUserStatusEdited('Free');
    } else if (userStatus === 'premium') {
      setUserStatusEdited('Premium');
    } else if (userStatus === 'admin') {
      setUserStatusEdited('Admin');
    } else {
      setUserStatusEdited('');
    }
  }, [userStatus]);

  const statusClass = clsx({
    'text-yellow-500': userStatus === 'admin',
    'text-orange-500': userStatus === 'premium',
    'text-gray-500': userStatus === 'user',
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

        if (userRoles === 'User') {
          updatedRoles = [...selectedValues];
          /*console.log(updatedRoles);*/
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
      /*console.log(error);*/
      message.error('Failed to add role.');
    }
  };

  function handleRemoveRole(roleName: string) {
    try {
      if (Array.isArray(userRoles) && currentUserStatus == 'admin' && userId) {
        const updatedRoles = userRoles.filter(
          (role: Role) => role.name !== roleName
        );

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
    <div
      className={clsx(
        'flex flex-col relative gap-4 p-1',
        edit ? 'w-full' : 'md:w-[450px] w-[350px] '
      )}
    >
      <div className="flex flex-col gap-4 w-full items-start">
        <div
          className={clsx(
            'group w-full h-[140px] overflow-hidden relative aspect-auto',
            edit ? 'rounded-xl' : 'rounded-2xl'
          )}
        >
          {userBannerUrl ? (
            <Image
              src={userBannerUrl}
              fill
              alt="image"
              className="z-10 object-cover w-full"
            />
          ) : (
            <div className="z-10 absolute inset-0 w-full h-full bg-white" />
          )}

 
          {edit && isAuthorized && userId && (
            <Dialog>
              <DialogTrigger>
                <div className="z-20 absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-xl font-medium flex items-center justify-center group-hover:opacity-100 transition">
                  <h1>Click to change your banner</h1>
                </div>
              </DialogTrigger>
              <DialogContent>
                <BannerUpload
                  isAuthorized={isAuthorized}
                  userId={userId}
                  bypass
                />
              </DialogContent>
            </Dialog>
          )}

          <div className="absolute inset-0 w-full h-full bg-border animate-pulse" />
        </div>
        {/*         <Dialog>
          <DialogTrigger> */}
        <div
          className={clsx(
            'absolute top-[6rem] left-8 group ring-[9px] rounded-full z-30',
            black ? 'bg-black ring-black' : 'bg-black ring-darkgray'
          )}
        >
          <Avatar className="w-[6rem] h-[6rem] ">
            <AvatarImage src={src ?? undefined} />
            {/* Display the first letter of the userName */}
            <AvatarFallback className="uppercase select-none text-base">
              {userChar.charAt(0)}
              {userChar.charAt(userChar.length - 1)}
            </AvatarFallback>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-950/70 opacity-0 scale-[1.3] duration-200 group-hover:opacity-100 group-hover:scale-100 transition">
              {edit && isAuthorized && userId ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-2xl lg:text-3xl font-medium flex items-center justify-center rounded-full group-hover:opacity-100 transition">
                      <FaPen className="w-[20%] h-[20%]" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <PhotoUpload
                      bypass
                      isAuthorized={isAuthorized}
                      userId={userId!}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <Link href={`/user/${userId}`} className="text-xs flex">
                  VIEW PROFILE
                </Link>
              )}
            </div>
          </Avatar>
          <div
            className={clsx(
              'w-fit h-fit absolute top-[70px] right-0 rounded-full border-4',
              statusClass,
              black ? 'border-black bg-black' : 'border-darkgray bg-darkgray'
            )}
          >
            <HiMiniCheckBadge size={30} />
          </div>
          {edit && (
            <div
              className={clsx(
                'w-fit h-fit absolute -top-0 right-0 rounded-lg border-4',
                black ? 'border-black bg-black' : 'border-darkgray bg-darkgray'
              )}
            >
              <LucideImagePlus className="opacity-80" />
            </div>
          )}
        </div>
        <div className="py-4 md:px-7 px-2 mt-8 flex flex-col w-full h-full rounded-lg gap-2">
          <div className="flex flex-col w-full h-full">
            <h1
              className={clsx(
                'text-2xl leading-6 font-semibold',
                userRoles &&
                  userRoles !== 'User' &&
                  userRoles.length > 0 &&
                  userRoles[0]?.color &&
                  `text-${getUserRoleColor(userRoles)}`
              )}
            >
              {userName ? userName : 'Loading...'}
            </h1>

            <h2 className={clsx('text-md leading-6 py-1', statusClass)}>
              {userStatusEdited}
            </h2>
          </div>

          <hr className="border-border" />

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-medium">INFO</h1>
            <div
              className={clsx(
                'border-border border rounded-xl p-3',
                black ? 'bg-darkgray' : 'bg-black'
              )}
            >
              <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: userDescription ? detectAndStyleLinks(userDescription) : 'No description provided'}}/>
            </div>
            {/*             <div className='flex justify-between pb-5 pt-2'>
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
            </div> */}

            <div
              className={clsx(
                'border border-border rounded-xl p-3 gap-3 flex flex-col',
                black ? 'bg-darkgray' : 'bg-black'
              )}
            >
              <h1>ROLES</h1>
              <div className="flex flex-wrap gap-3 items-center text-lg">
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
                            const orderA =
                              roles.find((role) => role.name === a.name)
                                ?.order || 0;
                            const orderB =
                              roles.find((role) => role.name === b.name)
                                ?.order || 0;
                            return orderA - orderB;
                          })
                          .map((role) => (
                            <div
                              className={clsx(
                                `bg-${role.color} flex px-4 py-2 h-10 border border-border rounded-md gap-2 items-center`
                              )}
                              key={role.id}
                            >
                              <HiMiniCheckBadge />
                              <h1>{role.name}</h1>
                              {currentUserStatus == 'admin' && (
                                <BiX
                                  className="cursor-pointer"
                                  onClick={() => handleRemoveRole(role.name)} // Implement the function to remove the role
                                />
                              )}
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
                {currentUserStatus == 'admin' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <ButtonShad
                        variant="outline"
                        className="group border-dotted border-2 px-4 py-2 gap-1 h-10"
                      >
                        Add roles
                        <AiOutlinePlus className="group-hover:scale-110 transition" />
                      </ButtonShad>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Search role..." />
                        <CommandEmpty className="gap-2 flex flex-col items-center justify-center py-4">
                          <p>No role found.</p>
                          <Dialog>
                            <DialogTrigger>
                              <ButtonShad variant="outline">
                                Create role
                              </ButtonShad>
                            </DialogTrigger>
                            <DialogContent>{/* <CreateRole/> */}</DialogContent>
                          </Dialog>
                        </CommandEmpty>
                        <CommandGroup>
                          {Array.isArray(userRoles)
                            ? roles
                                .filter(
                                  (role) =>
                                    !userRoles
                                      .map((userRole: Role) => userRole.name)
                                      .includes(role.name)
                                )
                                .map((role) => (
                                  <CommandItem
                                    key={role.id}
                                    onSelect={() => toggleSelection(role.name)}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={clsx(
                                        'mr-2 h-4 w-4',
                                        selectedValues.includes(role.name)
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    <h1 className={clsx(`text-${role.color}`)}>
                                      {role.name}
                                    </h1>
                                  </CommandItem>
                                ))
                            : roles.map((role) => (
                                <CommandItem
                                  key={role.id}
                                  onSelect={() => toggleSelection(role.name)}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={clsx(
                                      'mr-2 h-4 w-4',
                                      selectedValues.includes(role.name)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <h1 className={clsx(`text-${role.color}`)}>
                                    {role.name}
                                  </h1>
                                </CommandItem>
                              ))}
                        </CommandGroup>
                        <div className="w-full items-center justify-center px-4 py-2 flex">
                          <ButtonShad
                            disabled={selectedValues.length <= 0}
                            className="w-60"
                            variant="outline"
                            onClick={addRole}
                          >
                            Apply
                          </ButtonShad>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
