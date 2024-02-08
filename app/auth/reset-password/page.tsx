"use client"

import {auth} from '@/utils/firebase'
import {message} from 'antd'
import clsx from 'clsx'
import {verifyPasswordResetCode, confirmPasswordReset} from 'firebase/auth'
import {useRouter, useSearchParams} from 'next/navigation'
import React, {Suspense, useState, useTransition} from 'react'
import {FiLoader} from 'react-icons/fi'
import PageLoader from "@/components/PageLoader";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ResetPasswordPageSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/modifiedInput";
import {ButtonShad} from "@/components/ui/buttonshad";
import CardWrapper from "@/components/CardWrapper";
import {motion} from "framer-motion";
import Image from "next/image";
import StoicPatternBG from "@/public/Stoic_Pattern_EM.jpg";
import InvalidCredentials from "@/app/auth/InvalidCredentials";

function Fallback() {
    return <PageLoader/>
}

export default function ChangePassword() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const oobCode = searchParams.get('oobCode')
    const continueUrl = searchParams.get('continueUrl')

    const form = useForm<z.infer<typeof ResetPasswordPageSchema>>({
        resolver: zodResolver(ResetPasswordPageSchema),
    });

    const onSubmit = async (values: z.infer<typeof ResetPasswordPageSchema>) => {
        setError('');
        setSuccess('');

        if (!oobCode || mode !== 'resetPassword') {
            message.error('Authorisation token seems to be incorrect, please try again with a different reset link.')
            return
        }

        startTransition(async () => {
            try {
                await resetPassword(oobCode, values.password)
            } catch {
                setError('Something went wrong!');
            }
        });
    };

    async function resetPassword(oobcode: string, newPassword: string) {
        try {
            await verifyPasswordResetCode(auth, oobcode)
            setIsLoading(true)
            await confirmPasswordReset(auth, oobcode, newPassword);
            message.success('Password changed successfully');
            router.push(continueUrl || '/')
        } catch (error) {
            message.error('Something went wrong, please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Suspense fallback={<Fallback/>}>
            <div className="flex flex-col items-center justify-center relative min-h-screen gap-3 w-full">
                    <div className="z-10">
                    {mode === 'resetPassword' ? (
                        oobCode ? (
                            <CardWrapper headerLabel={"Reset your password"} backButtonLabel="Go back" backButtonHref={continueUrl || '/'}>
                                <Form {...form}>
                                    <form
                                        className="flex flex-col gap-3"
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg text-white">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLoading} {...field} type="password" eye placeholder={"Enter your new password"}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="gap-2 flex flex-col">
                                            <ButtonShad
                                                disabled={isLoading}
                                                type='submit'
                                                variant="secondary"
                                                className={clsx({
                                                    'active:scale-90 transition text-gray-400': isLoading, // Apply the 'text-gray-400' class when isLoading is true
                                                })}>
                                                {isLoading ? <FiLoader className="animate-spin my-1"/> : <p>Reset Password </p>}
                                            </ButtonShad>
                                        </div>
                                    </form>
                                </Form>
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