"use client"

import {message} from 'antd'
import {useRouter, useSearchParams} from 'next/navigation'
import React, {Suspense, useCallback, useEffect, useState, useTransition} from 'react'
import PageLoader from "@/components/PageLoader";
import CardWrapper from "@/components/CardWrapper";
import {motion} from "framer-motion";
import Image from "next/image";
import StoicPatternBG from "@/public/Stoic_Pattern_EM.jpg";
import InvalidCredentials from "@/app/auth/InvalidCredentials";
import {applyActionCode} from "@firebase/auth";
import {auth, db} from "@/utils/firebase";
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {ScaleLoader} from "react-spinners";
import {doc, updateDoc} from "firebase/firestore";

function Fallback() {
    return <PageLoader/>
}

export default function VerifyEmail() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<boolean>(false);
    const {userEmailVerified, userId} = UserDataFetcher()

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const oobCode = searchParams.get('oobCode')
    const continueUrl = searchParams.get('continueUrl')

    const verifyEmail = useCallback(async (oobCode: string, continueUrl: string | null, userId: string) => {
        try {
            setIsLoading(true);
            if (userEmailVerified) {
                message.warning('Your email is already verified, you can close this tab.')
                return
            }

            if (!oobCode) {
                message.error('Authorization token seems to be incorrect, please try again with a different reset link.');
                return;
            }

            if (mode !== 'verifyEmail') {
                message.error('Verification mode seems to be incorrect, please try again with a different reset link..');
                return;
            }

            await applyActionCode(auth, oobCode);
                const userDocRef = doc(db, 'users', userId);
                const userDataToUpdate = {
                    emailVerified: true
                };
                await updateDoc(userDocRef, userDataToUpdate)

            message.success('Email verified successfully');

/*
            router.push(continueUrl || '/');
*/

        } catch (error) {
            message.error('Something went wrong, please try again.');
            /*console.log(error)*/
        } finally {
            setIsLoading(false);
            setSuccess(true)
        }
    }, [userEmailVerified, mode, router]);

    useEffect(() => {
        if (oobCode && mode === 'verifyEmail' && !userEmailVerified && !success && userId) {
            verifyEmail(oobCode, continueUrl, userId)
                .then(() => {
                    // extra
                })
                .catch((error) => {
                });
        }
    }, [success, verifyEmail, oobCode, mode, continueUrl, userId, userEmailVerified]);

    return (
        <Suspense fallback={<Fallback/>}>
            <div className="flex flex-col items-center justify-center relative min-h-screen gap-3 w-full">
                <div className="z-10">
                    {mode === 'verifyEmail' ? (
                        oobCode ? (
                            <CardWrapper headerLabel={"Verify your email"} backButtonLabel="Go back" backButtonHref={continueUrl || '/'}>
                                <div className="flex flex-col items-center justify-center">
                                    {isLoading && <ScaleLoader color="#fff"/>}

                                    {success && !isLoading &&
                                        <h1 className="text-2xl font-semibold text-white">Your email is now verified!</h1>
                                    }

                                    {!success && !isLoading &&
                                        <h1 className="text-2xl font-semibold text-white">Something unexpected happened, try again with a new url.</h1>
                                    }
                                </div>
                            </CardWrapper>
                        ) : (
                            <InvalidCredentials type={"request"}/>
                        )
                    ) : (
                        <InvalidCredentials type={"mode"}/>
                    )}
                </div>
                <motion.div className="pointer-events-none" initial={{opacity: 0}} whileInView={{opacity: 0.4}} transition={{type: 'tween'}}>
                    <Image fill alt="Background pattern" quality={95} priority src={StoicPatternBG}/>
                    <div className="w-full h-full z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black"/>
                </motion.div>
            </div>
        </Suspense>
    )
}