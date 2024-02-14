"use client"
import Greeting from '@/components/Dashboard/Greeting'
import React, {useEffect, useState} from 'react'
import {User} from '@/types/types';
import Continue from '@/components/Dashboard/Continue';
import CreateTaskButton from '@/components/Dashboard/CreateTaskButton';
import Tasks from '@/components/Dashboard/Tasks';
import Unauthorized from '@/components/Unauthorized';
import Statistics from '@/components/Dashboard/Stats';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";
import PageLoader from "@/components/PageLoader";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/utils/firebase";

export default function DashboardComponent() {
    const {userId, userOnboarding, userStatus, userName, userSocial, userProfileImageUrl, generalLastCourse, generalLastLesson} = UserDataFetcher();

    const [user, setUser] = useState<User>()

    const allowedToFetch = isUserAllowedToFetch(userStatus)

    useEffect(() => {
        if (allowedToFetch) {
            const user: User = {
                id: userId,
                generalLastCourse,
                generalLastLesson,
                name: userName,
                social: userSocial,
                status: userStatus,
                profileImageUrl: userProfileImageUrl,
                onboarding: userOnboarding
            };

            setUser(user)
        }
    }, [allowedToFetch, userId, userOnboarding, generalLastCourse, generalLastLesson, userName, userProfileImageUrl, userSocial, userStatus])


    if (!allowedToFetch && userStatus) {
        return <Unauthorized/>
    } else if (userStatus && user) {
        return (
            <div className="h-full flex flex-col gap-6 lg:p-10 lg:px-16 p-6 justify-between items-start w-full mx-auto max-w-7xl">
                <div className="w-full flex gap-4 items-center justify-between">
                    <Greeting userName={user.name}/>
                    <CreateTaskButton userId={user.id} userStatus={user.status}/>
                </div>
                <Continue allowedToFetch={allowedToFetch} user={user}/>
                <Tasks userId={user.id} userStatus={user.status}/>
                {user.social &&
                    <Statistics user={user}/>
                }
            </div>
        )
    } else {
        <PageLoader/>
    }
}