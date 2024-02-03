"use client"

import React from 'react';
import OnboardingNotification from '@/components/OnboardingNotification';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Locked from "@/components/Locked";
import {isUserAllowedToFetch} from "@/utils/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import PageLoader from "@/components/PageLoader";

const AdvancedWrapper = ({ children}: {children: React.ReactNode}) => {
    const { userId, userOnboarding, userStatus, userName } = UserDataFetcher();
    const allowedToFetch = isUserAllowedToFetch(userStatus);

    const searchParams= useSearchParams()

    const selectedPlatforms = searchParams.get('selectedPlatforms')
    const description = searchParams.get('description')
    const step = searchParams.get('step')

    const router = useRouter()
    const pathname = usePathname()

   if(!description && step && step >= '2') {
        router.push(selectedPlatforms ? `${pathname}?step=1selectedPlatforms=${selectedPlatforms}` : `${pathname}?step=1`)
   }
   if (step && step >= '3' && !selectedPlatforms) {
       router.push(description ? `${pathname}?step=2&description=${description}` : `${pathname}?step=2`)
   }

    if (allowedToFetch && userOnboarding) {
        return (
            <>
{/*
                <OnboardingNotification selectedPlatforms={selectedPlatforms || ''} description={description || ''} userStatus={userStatus} userId={userId} userName={userName} step={step || ''} />
*/}

                {children}
            </>
        );
    } else if (allowedToFetch) {
        return children;
    } else if (userStatus) {
        return (
            <>
                <Locked />
                {children}
            </>
        );
    } else {
        return <PageLoader/>
    }
};

export default AdvancedWrapper;
