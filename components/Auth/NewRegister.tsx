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
import {RegisterSchema} from '@/schemas';
import {ButtonShad} from '../ui/buttonshad';
import {Input} from '../ui/modifiedInput';
import FormSuccess from '../FormSuccess';
import FormError from '../FormError';
import {auth, db} from "@/utils/firebase";
import {message} from "antd";
import {useRouter} from "next/navigation";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import {createUserWithEmailAndPassword} from "firebase/auth";
import type {FirebaseError} from "@firebase/util";
import {BiLoader} from "react-icons/bi";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {sanitizeString} from "@/utils/utils";

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
            const existingUserRef = doc(db, "users", sanitizeString(values.name));
            const existingUserSnap = await getDoc(existingUserRef);

            if (existingUserSnap.exists()) {
                message.error("Username already in use. Please choose a different username.");
            } else {

                const user = await createUserWithEmailAndPassword(auth, values.email, values.password);

                const userEmail = user.user.email;
                const userName = values.name;

                const userData = {
                    name: userName,
                    email: userEmail,
                    password: values.password,
                    status: 'user',
                    onboarding: true,
                    custom: true
                }

                const userRef = doc(db, "users", sanitizeString(userName));
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
                                        @{sanitizeString(formName)}
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
                    <ButtonShad type="submit" variant="secondary" className="w-full active:scale-95 transition"
                                disabled={isPending}>
                        {isPending ? <BiLoader className="animate-spin"/> : 'Register'}
                    </ButtonShad>
                </form>
            </Form>
        </CardWrapper>
    );
}
