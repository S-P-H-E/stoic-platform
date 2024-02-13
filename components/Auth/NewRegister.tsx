import React, {useState, useTransition} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import bcrypt from "bcryptjs"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {RegisterSchema} from '@/schemas';
import {ButtonShad} from '../ui/buttonshad';
import {Input} from '../ui/modifiedInput';
import FormSuccess from '../FormSuccess';
import FormError from '../FormError';
import {auth, db} from "@/utils/firebase";
import {message} from "antd";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword} from "firebase/auth";
import type {FirebaseError} from "@firebase/util";
import {BiLoader} from "react-icons/bi";
import {doc, getDoc, setDoc} from "firebase/firestore";
import CardWrapper from "@/components/CardWrapper";
import {convertToAsciiEquivalent, createCustomerIfNullOnRegister} from "@/utils/utils";
import {sendEmailVerification} from "firebase/auth";

const firebaseErrorMessages: Record<string, string> = {
    "auth/invalid-email": "The email address is not valid.",
    "auth/missing-email": "The email address is missing.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/missing-password": "The password is missing.",
    "auth/email-already-in-use": "The email address is already in use by another account.",
    "auth/user-not-found": "The email address is not associated with an existing account.",
}
export default function NewRegister() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const router = useRouter()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const { name: formName} = form.watch();

    const register = async (values: z.infer<typeof RegisterSchema>) => {
        try {
            const existingUserRef = doc(db, "users", convertToAsciiEquivalent(values.name));
            const existingUserSnap = await getDoc(existingUserRef);

            if (existingUserSnap.exists()) {
                message.error("Username already in use. Please choose a different username.");
            } else {

                const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                await sendEmailVerification(userCredential.user)

                const userEmail = userCredential.user.email;
                const userName = values.name;

                const hashedPassword = await bcrypt.hash(values.password, 10);

                const createdCustomerId = await createCustomerIfNullOnRegister(userName, userEmail)

                const userData = {
                    name: userName,
                    email: userEmail,
                    photoUrl: userCredential.user.photoURL,
                    uid: userCredential.user.uid,
                    emailVerified: userCredential.user.emailVerified,
                    createdAt: userCredential.user.metadata.creationTime,
                    password: hashedPassword,
                    status: 'user',
                    onboarding: true,
                    custom: true,
                    createdCustomerId: createdCustomerId
                }

                const userRef = doc(db, "users", convertToAsciiEquivalent(userName));
                await setDoc(userRef, userData);

                message.success("Signed in successfully");
                router.push('/dashboard');
            }

        } catch (error) {
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";

            message.error(errorMessage);
        }
    }

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            try {
                await register(values)
            } catch {
                setError('Something went wrong!');
            }
        });
    };

    return (
        <CardWrapper
            headerLabel="Create a new account"
            backButtonHref="/"
            backButtonLabel="Already have an account?"
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg text-white">Display Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your display name here"
                                        type="name"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                {formName &&
                                    <p className="text-muted-foreground text-sm">Your username will be
                                        @{convertToAsciiEquivalent(formName)}
                                    </p>
                                }
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <ButtonShad type="submit" variant="secondary" className="w-full active:scale-95 transition"
                                disabled={isPending}>
                        {isPending ? <BiLoader className="animate-spin"/> : 'Register'}
                    </ButtonShad>
                </form>
            </Form>
        </CardWrapper>
    );
}
