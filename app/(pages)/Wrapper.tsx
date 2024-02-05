"use client"

import React from 'react';
import OnboardingNotification from '@/components/OnboardingNotification';
import {UserDataFetcher} from '@/utils/userDataFetcher';
import Locked from "@/components/Locked";
import {isUserAllowedToFetch} from "@/utils/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import PageLoader from "@/components/PageLoader";

const AdvancedWrapper = ({children}: { children: React.ReactNode }) => {
    const {userId, userOnboarding, userStatus, userName} = UserDataFetcher();
    const allowedToFetch = isUserAllowedToFetch(userStatus);

    const searchParams = useSearchParams()

    const selectedPlatforms = searchParams.get('selectedPlatforms')
    const description = searchParams.get('description')
    const step = searchParams.get('step')

    const instagram = searchParams.get('instagram')
    const youtube = searchParams.get('youtube')
    const tiktok = searchParams.get('tiktok')
    const twitter = searchParams.get('twitter')

    const skip = searchParams.get('skip')
    const final = searchParams.get('final')

    const router = useRouter()
    const pathname = usePathname()

    const numericStep = Number(step)

    if ( !(final && numericStep === 5) ) {
        if ((skip !== 'true') && (!description && numericStep && numericStep >= 2 && numericStep !== 5)) {
            router.push(selectedPlatforms ? `${pathname}?step=1&selectedPlatforms=${selectedPlatforms}` : `${pathname}?step=1`);
        }
        if ((skip !== 'true') && (numericStep && numericStep >= 3 && !selectedPlatforms)) {
            router.push(description ? `${pathname}?step=2&description=${description}` : `${pathname}?step=1`);
        }
        if ((skip !== 'true') && (numericStep && numericStep >= 4 && (!instagram && !youtube && !tiktok && !twitter))) {
            router.push(selectedPlatforms ? `${pathname}?step=3&description=${description}&selectedPlatforms=${selectedPlatforms}` : `${pathname}?step=2&description=${description}`);
        }
    }

    if (!final && step && step >= '5') {
        if (instagram || youtube || tiktok || twitter || skip) {
            let platformParams = '';

            if (instagram) {
                platformParams += `&instagram=${instagram}`;
            }
            if (youtube) {
                platformParams += `&youtube=${youtube}`;
            }
            if (tiktok) {
                platformParams += `&tiktok=${tiktok}`;
            }
            if (twitter) {
                platformParams += `&twitter=${twitter}`;
            }
            if (skip === 'true') {
                platformParams += `$skip=true`
            }

            router.push(`${pathname}?step=4&description=${description}&selectedPlatforms=${selectedPlatforms}${platformParams}`);
        } else {
            router.push(`${pathname}?step=3&description=${description}&selectedPlatforms=${selectedPlatforms}`);
        }
    }

    if (allowedToFetch && userOnboarding) {
        return (
            <>
                <OnboardingNotification final={final} skip={skip} tiktok={tiktok} instagram={instagram} youtube={youtube} twitter={twitter} selectedPlatforms={selectedPlatforms || ''}
                                        description={description || ''} userStatus={userStatus} userId={userId} userName={userName} step={step || ''}
                />
                {children}
            </>
        );
    } else if (allowedToFetch) {
        return children;
    } else if (userStatus) {
        return (
            <>
                <Locked/>
                {children}
            </>
        );
    } else {
        return <PageLoader/>
    }
};

export default AdvancedWrapper;
