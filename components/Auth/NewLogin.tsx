import React, {useState, useTransition} from 'react';
import CardWrapper from '../CardWrapper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {LoginSchema} from '@/schemas';
import {ButtonShad} from '../ui/buttonshad';
import Link from 'next/link';
import NewInput from '../UI Elements/NewInput';
import {Input} from '../ui/modifiedInput';
import FormSuccess from '../FormSuccess';
import FormError from '../FormError';
import {auth, db} from "@/utils/firebase";
import {message} from "antd";
import {useRouter} from "next/navigation";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import {signInWithEmailAndPassword} from "firebase/auth";
import type  {FirebaseError} from "@firebase/util";
import { BiLoader } from 'react-icons/bi';
import {collection, getDocs, query, where} from "firebase/firestore";

const firebaseErrorMessages: Record<string, string> = {
    "auth/invalid-email": "The email address is not valid.",
    "auth/missing-email": "The email address is missing.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/missing-password": "The password is missing.",
    "auth/email-already-in-use": "The email address is already in use by another account.",
    "auth/user-not-found": "The email address is not associated with an existing account.",
}
export default function NewLogin() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const router = useRouter()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    const login = async (values: z.infer<typeof LoginSchema>) => {
        try {
            const q = query(collection(db, 'users'), where('email', '==', values.email), where('custom', '==', true));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];

                if (!userDoc.data().password) {
                    message.warning(`Looks like you signed up with Google or Twitter, use those to log in.`);
                    return;
                }
            } else {
                message.error("User not found or not authorized.");
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            message.success("Signed in successfully");
            router.push('/dashboard');
        } catch (error) {
/*
            console.log(error)
*/
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";

            message.error(errorMessage);
        }
    }

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            try {
                await login(values)
            } catch {
                setError('Something went wrong!');
            }
        });
    };

    return (
        <CardWrapper
            headerLabel="Login to your account"
            backButtonHref="/?mode=register"
            backButtonLabel="Don't have an account?"
            showSocial
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg text-white">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your email here"
                                        type="email"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg text-white">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your password here"
                                        type="password"
                                        disabled={isPending}
                                        eye
                                    />
                                </FormControl>
                                <Dialog>
                                    <DialogTrigger
                                        className="text-white px-0 font-normal hover:underline underline-offset-4 active:scale-90 transition text-sm">
                                        Forgot your password?
                                    </DialogTrigger>
                                    <DialogContent>
                                        <ForgotPassword/>
                                    </DialogContent>
                                </Dialog>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <ButtonShad type="submit" variant="secondary" className="w-full active:scale-95 transition" disabled={isPending}>
                        {isPending ? <BiLoader className="animate-spin"/> : 'Login'}
                    </ButtonShad>
                </form>
            </Form>
        </CardWrapper>
    );
}
