import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import * as z from "zod";
import {UpdatePasswordPageSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage, Form} from "@/components/ui/form";
import {Input} from "@/components/ui/modifiedInput";
import {updateUserDetails} from "@/utils/updateFirestore";
import {message} from "antd";
import {ButtonShad} from "@/components/ui/buttonshad";
import {BiLoader} from "react-icons/bi";
import bcrypt from "bcryptjs";
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "firebase/auth";
import {auth} from "@/utils/firebase";
import type {FirebaseError} from "@firebase/util";

const UpdatePassword = ({userPassword, userId, userStatus, closeModal}: {closeModal: () => void, userPassword: string | null | undefined, userId: string | null | undefined, userStatus: string | undefined}) => {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const firebaseErrorMessages: Record<string, string> = {
        "auth/wrong-password": "Old password is incorrect.",
        "auth/missing-password": "The password is missing.",
        "auth/weak-password": "Password cannot be shorter than 8 digits",
        "auth/user-not-found": "The email address is not associated with an existing account.",
        "auth/too-many-requests": "Too many tries, please try again later",
    }

    const form = useForm<z.infer<typeof UpdatePasswordPageSchema>>({
        resolver: zodResolver(UpdatePasswordPageSchema),
        defaultValues: {
        },
    });

    const onSubmit = async (values: z.infer<typeof UpdatePasswordPageSchema>) => {
        try {
            setLoading(true);

            const user = auth.currentUser;

            if (!userPassword || !user || !userId) {
                message.error('You do not have a password or your account is created with a provider.')
                return
            }

            const passwordsMatch =  bcrypt.compare(
                values.password,
                userPassword
            )

            if (!passwordsMatch) {
                message.error('Password does not match')
                return
            }
            
            const credential = EmailAuthProvider.credential(user.email || '', values.password);
            const hashedPassword = await bcrypt.hash(values.newPassword, 10);

            await reauthenticateWithCredential(user, credential)

            await updatePassword(user, values.newPassword)
            await updateUserDetails(userStatus, userId, {password: hashedPassword})

            closeModal()

            message.success('Successfully updated user information!');
            setSuccess('Successfully updated user information!');
        } catch (error) {
            console.log(error)
            const firebaseError = error as FirebaseError;
            const errorCode = firebaseError.code as keyof typeof firebaseErrorMessages;
            const errorMessage = firebaseErrorMessages[errorCode] || "An error occurred. Please try again.";
            setError('Failed to update user info, please try again later.');
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Form {...form}>
                <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg">Current Password</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} eye type="password" placeholder="Enter current password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg">New Password</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} eye type="password" placeholder="Enter new password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    ANOTHER INPUT AND REFINE IN INDEX.TS, CHECKS IF IT MATCHES THE OTHER ONE SO WE HAVE CONFIRMATION
                    <ButtonShad variant="secondary" disabled={loading} className="border-white border disabled:cursor-not-allowed active:scale-90 transition" type="submit">
                        {loading ? <BiLoader className="animate-spin"/> : 'Save'}
                    </ButtonShad>
                </form>
            </Form>
        </div>
    );
};

export default UpdatePassword;
