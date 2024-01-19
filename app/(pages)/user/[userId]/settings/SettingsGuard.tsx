'use client'

import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React, { useEffect, useState } from 'react'
import SettingsComponent from './Settings';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonShad } from '@/components/ui/buttonshad';
import StoicLogo from '@/public/stoicWhite.webp'
import { User, GlobalUser, Role } from '@/types/types';
import { UserDataFetcherById } from '@/utils/userDataFetcherById';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function SettingsGuard({userId}: {userId: string}) {
  const { userId: userIdGlobal, userStatus: userStatusGlobal, userStripeId: userStripeIdGlobal, userName: userNameGlobal } = UserDataFetcher();

  const { userSocial, userDescription, userStripeId, userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userStatus, userProfileImageUrl, userProfileBannerUrl } = UserDataFetcherById(userId);
    // fetch data based on userId here

    const [globalUser, setGlobalUser] = useState<GlobalUser>()
    const [user, setUser] = useState<User>()
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
      if (userStatusGlobal !== 'user' && userIdGlobal == userId || userStatusGlobal === 'admin') {
        const user: User = {
          stripeId: userStripeId,
          roles: userRoles,
          generalLastCourse,
          email: userEmail,
          generalLastLesson,
          name: userName,
          social: userSocial,
          status: userStatus,
          description: userDescription,
          profileImageUrl: userProfileImageUrl,
          profileBannerUrl: userProfileBannerUrl,
        };
    
        const globalUser: GlobalUser = {
          id: userIdGlobal,
          name: userNameGlobal,
          status: userStatusGlobal,
          stripeId: userStripeIdGlobal
        }
    
        setGlobalUser(globalUser)
        setUser(user)
      }
    }, [userId, generalLastCourse, generalLastLesson, userDescription, userEmail, userIdGlobal, userName, 
      userNameGlobal, userProfileBannerUrl, userProfileImageUrl, userRoles, userStatus, userStatusGlobal, 
      userStripeId, userStripeIdGlobal, userSocial
    ])

    useEffect(() => {
      const rolesCollection = collection(db, 'roles');
  
      const unsubscribe = onSnapshot(
        query(rolesCollection, orderBy('order')),
        (snapshot) => {
          const rolesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            color: doc.data().color,
            order: doc.data().order, // Include the order field in rolesData
          }));
          setRoles(rolesData);
        }
      );
  
      return () => unsubscribe();
    }, []);

    if (userStatus && userId !== userIdGlobal && userStatusGlobal !== 'admin' ) {
      return (
      <div className='flex flex-col min-h-screen items-center justify-center gap-3'>
          { userStatus === 'user' && <Locked/> }
          <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
          <h3 className='text-2xl font-medium'>You are not authorised to see this content.</h3>
          <Link href="/">
            <ButtonShad variant={'outline'}>Take me back to homepage</ButtonShad>
          </Link>
      </div>
      )
    }
    else if (userStatus == "user") {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <Locked/>
          <SettingsComponent roles={roles} userId={userId} globalUser={globalUser} user={user}/>
        </div>
      );
    } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <SettingsComponent roles={roles} userId={userId} globalUser={globalUser} user={user}/>
        </div>
      );
    }  else {
      return <PageLoader/>;
    }
}
