"use client"

import UserProfile from '@/components/UserProfile';
import {GlobalUser, Role, SocialInfo, User} from '@/types/types';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {SettingsSchema} from '@/schemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import Link from 'next/link'
import NewInput from '@/components/UI Elements/NewInput';
import {ButtonShad} from '@/components/ui/buttonshad';
import {updateUserDetails} from '@/utils/updateFirestore';
import React, {useEffect, useState} from 'react'
import {message} from 'antd';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import Image from 'next/image';
import {FaArrowLeft, FaLock, FaUser} from 'react-icons/fa6';
import {capitalizeFirstLetter, isValidURL, truncateText} from '@/utils/utils';
import NewTextArea from '@/components/UI Elements/NewTextArea';
import {BiLoader} from 'react-icons/bi';
import Membership from '@/components/UserId/Membership';
import {Dialog, DialogClose, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {UserDataFetcherById} from "@/utils/userDataFetcherById";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {auth, db} from "@/utils/firebase";
import Unauthorized from "@/components/Unauthorized";
import PageLoader from "@/components/PageLoader";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import {AnimatePresence, motion} from "framer-motion";
import YoutubeAnimation from '@/public/lottie/youtube.json'
import InstagramAnimation from '@/public/lottie/instagram.json'
import TiktokAnimation from '@/public/lottie/tiktok.json'
import TwitterAnimation from '@/public/lottie/twitter.json'
import clsx from "clsx";
import Lottie from "lottie-react";
import {MdCancel} from "react-icons/md";
import {sendEmailVerification} from "firebase/auth";
import {BsExclamation} from "react-icons/bs";
import {RecaptchaVerifier} from "firebase/auth";
import UpdatePassword from "@/components/Settings/UpdatePassword";

export default function SettingsComponent({
                                              userId,
                                          }: {
    userId: string;
}) {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const {
        userPassword: userPasswordGlobal,
        user: userGlobal,
        userOnboarding: userOnboardingGlobal,
        userId: userIdGlobal,
        userStatus: userStatusGlobal,
        userStripeId: userStripeIdGlobal,
        userName: userNameGlobal
    } = UserDataFetcher();

    const allowedToFetch = userStatusGlobal !== 'user' && userIdGlobal == userId || userStatusGlobal === 'admin'

    const {
        userSocial,
        userDescription,
        userStripeId,
        userRoles,
        generalLastCourse,
        userEmail,
        generalLastLesson,
        userName,
        userStatus,
        userProfileImageUrl,
        userProfileBannerUrl,
        userOnboarding,
        userEmailVerified
    } = UserDataFetcherById(userId);
    // fetches data based on userId here

    const [globalUser, setGlobalUser] = useState<GlobalUser>()
    const [user, setUser] = useState<User>()
    const [roles, setRoles] = useState<Role[]>([]);

    const [socialMenuOpen, setSocialMenuOpen] = useState(false)
    const [newInputs, setNewInputs] = useState([''])

    const [socialPlatforms, setSocialPlatforms] = useState<{
        youtube?: string;
        twitter?: string;
        instagram?: string;
        tiktok?: string;
        [key: string]: string | undefined;
    }>({});

    useEffect(() => {
        if (allowedToFetch) {
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
                onboarding: userOnboarding,
                profileBannerUrl: userProfileBannerUrl,
                emailVerified: userEmailVerified
            };

            const globalUser: GlobalUser = {
                id: userIdGlobal,
                name: userNameGlobal,
                status: userStatusGlobal,
                stripeId: userStripeIdGlobal,
                onboarding: userOnboardingGlobal
            }

            const social = {
                youtube: userSocial?.youtube,
                twitter: userSocial?.twitter,
                instagram: userSocial?.instagram,
                tiktok: userSocial?.tiktok,
            };

            setSocialPlatforms(social);
            setGlobalUser(globalUser)
            setUser(user)
        }
    }, [userId, generalLastCourse, generalLastLesson, userDescription, userEmail, userIdGlobal, userName,
        userNameGlobal, userProfileBannerUrl, userProfileImageUrl, userRoles, userStatus, userStatusGlobal,
        userStripeId, userStripeIdGlobal, userSocial, allowedToFetch, userOnboarding, userOnboardingGlobal,
        userEmailVerified
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

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            description: user?.description || undefined,
            youtube: user?.social?.youtube || undefined,
            twitter: user?.social?.twitter || undefined,
            instagram: user?.social?.instagram || undefined,
            tiktok: user?.social?.tiktok || undefined,
            email: user?.email || undefined,
        },
    });

    useEffect(() => {
        if (user && user.social) {
            const socialValues: SocialInfo = {};
            Object.keys(socialPlatforms).forEach((platform) => {
                socialValues[platform as keyof SocialInfo] = user.social![platform as keyof SocialInfo] || '';
            });

            form.reset({
                name: user?.name || '',
                description: user?.description || '',
                email: user?.email || '',
                ...socialValues,
            });
        }
    }, [user, form, socialPlatforms]);

    useEffect(() => {
        const hasErrors = Object.keys((form.formState.errors as any)).some((key) => (form.formState.errors as any)[key]);

        if (hasErrors) {
            message.warning('Please check your details.');
        }
    }, [form.formState.errors]);

    const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
        try {
            setLoading(true);

            const {youtube, twitter, instagram, tiktok, ...restValues} = values;

            const updatedValues = {
                ...restValues,
                social: {
                    youtube: youtube || socialPlatforms.youtube || '',
                    twitter: twitter || socialPlatforms.twitter || '',
                    instagram: instagram || socialPlatforms.instagram || '',
                    tiktok: tiktok || socialPlatforms.tiktok || '',
                },
            };

            await updateUserDetails(user?.status, userId, updatedValues);

            message.success('Successfully updated user information!');
            setSuccess('Successfully updated user information!');
        } catch {
            setError('Failed to update user info, please try again later.');
            message.error('There was an issue with your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setNewInputs([''])

        setSocialMenuOpen(!socialMenuOpen);
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleSocialPlatformButtonClick = (event: React.MouseEvent<HTMLButtonElement>, platform: string) => {
        event.preventDefault();

        setNewInputs((prevInputs) => {
            const updatedInputs = prevInputs.filter((input) => input !== '');

            if (!updatedInputs.includes(platform)) {
                updatedInputs.push(platform);
            }

            return updatedInputs;
        });
    }

    const handleRemovePlatform = async (event: React.MouseEvent<HTMLButtonElement>, platform: string) => {
        event.preventDefault();

        try {
            setLoading(true);

            const updatedSocialPlatforms = {...socialPlatforms};

            // Set the platform to an empty string instead of deleting it
            updatedSocialPlatforms[platform] = '';

            const updatedInputs = newInputs.includes(platform)
                ? newInputs.filter((input) => input !== platform)
                : [...newInputs];

            setNewInputs(updatedInputs);

            const updatedUser = {
                id: user?.id,
                status: user?.status,
                social: updatedSocialPlatforms,
            };

            // Remove undefined values from the updatedSocialPlatforms object
            Object.keys(updatedSocialPlatforms).forEach((key) => {
                if (updatedSocialPlatforms[key] === undefined) {
                    delete updatedSocialPlatforms[key];
                }
            });

            await updateUserDetails(user?.status, userId, updatedUser);

            message.success(`Successfully removed ${capitalizeFirstLetter(platform)} link!`);
            setSuccess(`Successfully removed ${capitalizeFirstLetter(platform)} link!`);
        } catch (error) {
            /*console.log(error)*/
            setError(`Failed to remove ${capitalizeFirstLetter(platform)} link. Please try again later.`);
            message.error('There was an issue with your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
            x: 75,
            scale: 0.5
        },
        animate: (index: number) => ({
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                delay: 0.1 * index,
            },
        }),
    };

    const lottieAnimations: any = {
        youtube: YoutubeAnimation,
        twitter: TwitterAnimation,
        instagram: InstagramAnimation,
        tiktok: TiktokAnimation,
    };

    const fieldEmpty = (platform: "youtube" | "instagram" | "twitter" | "tiktok" | "name" | "description") => {
        const fieldValue = form.watch(platform.toLowerCase() as "youtube" | "instagram" | "twitter" | "tiktok" | "name" | "description");
        return !fieldValue || fieldValue.trim() === '';
    };

    const handleVerifyEmail = async () => {
        try {
            setLoading(true);

            if (userGlobal && userId === globalUser?.id) {
                await sendEmailVerification(userGlobal)
                message.success('Verification email sent successfully!');
            } else {
                message.error('Something went wrong with your request, please try again.')
            }

        } catch (error) {
            if (error == 'FirebaseError: Firebase: Error (auth/too-many-requests).') {
                setError('Too many requests, please try again later.');
            } else {
                setError('Failed to send verification email. Please try again later.');
            }
            message.error('There was an issue with sending the verification email.');
        } finally {
            setLoading(false);
        }
    };

    if (userStatus && userId !== userIdGlobal && userStatusGlobal !== 'admin') {
        return <Unauthorized locked={userStatusGlobal === 'user'}/>
    } else if (userStatus) {
        return (
            <div className="flex flex-col gap-8 w-full mx-auto max-w-7xl h-full lg:p-10 lg:px-16 p-6 justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold">User Settings</h1>
                    <Link href={`/user/${userId}`} className="relative flex gap-2 group items-center w-fit active:scale-90 transition">
                        <FaArrowLeft className="absolute group-hover:translate-x-1 -translate-x-2 left-0 opacity-0 group-hover:opacity-100 transition"/>
                        {user?.profileImageUrl ? (
                            <Image alt="User image" src={user?.profileImageUrl!} height={80} width={80}
                                   className="group-hover:opacity-0 group-hover:-translate-x-3 w-7 h-7 rounded-full object-cover transition"/>
                        ) : (
                            <FaUser className="group-hover:opacity-0 m-2 group-hover:-translate-x-3 rounded-full object-cover transition"/>
                        )
                        }
                        <p className="font-medium text-sm group-hover:underline">Back to {user?.name}</p>
                    </Link>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 w-full min-w-[21rem]">
                    {user && user.name && user.roles && user.status && (
                        <>
                            <div className="bg-darkgray border border-border p-4 rounded-2xl w-full">
                                <div id="recaptcha-container">
                                    RECAPTCHA
                                </div>
                                <Form {...form}>
                                    <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg">Name</FormLabel>
                                                    <FormControl>
                                                        <NewInput disabled={loading} id='name' label={user?.name || "Name"} placeholder="Enter new name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg">Description</FormLabel>
                                                    <FormControl>
                                                        <NewTextArea disabled={loading} id='description' label={truncateText(user?.description, 20) || "Description"}
                                                                     placeholder="Enter new description" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg">Email</FormLabel>
                                                    <FormControl>
                                                        <NewInput
                                                            disabled={loading}
                                                            id="email"
                                                            type="email"
                                                            label="Update your account email"
                                                            placeholder={"Enter your new email"}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>

                                                    {!user.emailVerified &&
                                                        <div className="flex items-center pt-1 gap-2">
                                                            <FormLabel className="text-yellow-500 text-[16.5px] flex items-center"><BsExclamation size={32}/> You haven&#39;t verified your email
                                                                address.</FormLabel>
                                                            <ButtonShad
                                                                onClick={handleVerifyEmail}
                                                                disabled={loading}
                                                                size="sm"
                                                                className="active:scale-90 transition bg-yellow-500 hover:bg-yellow-600"
                                                                variant="secondary"
                                                            >
                                                                {loading ? 'Sending email...' : 'Verify'}
                                                            </ButtonShad>
                                                        </div>
                                                    }
                                                </FormItem>
                                            )}
                                        />


                                        <div className="flex flex-col gap-4">
                                            {Object.keys(socialPlatforms)
                                                .filter((platform) => socialPlatforms[platform] || newInputs.includes(platform)) // Check if the platform has a non-empty value or exists in newInputs
                                                .map((platform) => (
                                                    <div key={platform} className="relative">
                                                        <FormField
                                                            control={form.control}
                                                            name={platform.toLowerCase() as "instagram" | "youtube" | "twitter" | "tiktok"}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-lg">{capitalizeFirstLetter(platform)}</FormLabel>
                                                                    <FormControl>
                                                                        <NewInput
                                                                            disabled={loading}
                                                                            id={platform}
                                                                            type={`social-${platform}`}
                                                                            label={truncateText(user?.social?.[capitalizeFirstLetter(platform)], 20) || capitalizeFirstLetter(platform)}
                                                                            placeholder={`Enter your ${capitalizeFirstLetter(platform)} link`}
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        {!fieldEmpty(platform as "youtube" | "instagram" | "twitter" | "tiktok" | "name" | "description") ?
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <button
                                                                        className="hover:scale-110 active:scale-90 transition hover:opacity-80 absolute right-2 top-[1.15rem] h-full flex items-center justify-center text-red-500">
                                                                        <MdCancel/>
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="flex flex-col gap-6 p-8">
                                                                    <div className="flex flex-col gap-1">
                                                                        <h1 className="text-2xl font-semibold">Delete confirmation</h1>
                                                                        {isValidURL(form.getValues()[platform as "youtube" | "instagram" | "twitter" | "tiktok" | "name" | "description"], platform) ?
                                                                            <p className="text-highlight">You already seem to have a valid {capitalizeFirstLetter(platform)} link, you sure you
                                                                                want to remove it?</p>
                                                                            :
                                                                            <p className="text-highlight">You&apos;ve already typed something in this box. Are you sure you want to erase it?</p>
                                                                        }
                                                                        <p className="break-all">You have
                                                                            entered: {form.getValues()[platform as "youtube" | "instagram" | "twitter" | "tiktok" | "name" | "description"]}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <ButtonShad variant="destructive" onClick={(e) => handleRemovePlatform(e, platform)}>
                                                                            Yes, delete it
                                                                        </ButtonShad>
                                                                        <DialogClose>
                                                                            <ButtonShad variant="secondary">
                                                                                Cancel
                                                                            </ButtonShad>
                                                                        </DialogClose>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            :
                                                            <button
                                                                onClick={(e) => handleRemovePlatform(e, platform)}
                                                                className="hover:scale-110 active:scale-90 transition hover:opacity-80 absolute right-2 top-[1.15rem] h-full flex items-center justify-center text-red-500"
                                                            >
                                                                <MdCancel/>
                                                            </button>
                                                        }
                                                    </div>
                                                ))}
                                            <AnimatePresence>
                                                {!socialMenuOpen &&
                                                    <div className={clsx("relative", !socialMenuOpen && 'pb-8')}>
                                                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="w-full absolute inset-0">
                                                            <ButtonShad onClick={(e) => handleSocialMenuOpen(e)} className="group w-full active:scale-95 transition flex items-center gap-2"
                                                                        variant="ring">
                                                                <FiChevronDown className="group-hover:rotate-180 transition duration-300"/> Add Social
                                                            </ButtonShad>
                                                        </motion.div>
                                                    </div>
                                                }
                                            </AnimatePresence>
                                            <AnimatePresence>
                                                {socialMenuOpen &&
                                                    <motion.div className="flex flex-col gap-4" initial={{height: 0, opacity: 0}} animate={{height: 100, opacity: 1}}
                                                                exit={{height: 0, opacity: 0, y: -30}}>
                                                        <motion.div initial={{height: 0, opacity: 0}} animate={{height: 50, opacity: 1}}
                                                                    className="w-full gap-3 grid grid-cols-2 md:grid-cols-4">
                                                            {Object.keys(socialPlatforms).map((platform, index) => (
                                                                <motion.div
                                                                    custom={index}
                                                                    variants={fadeInAnimationVariants}
                                                                    initial="initial"
                                                                    whileInView="animate"
                                                                    exit={{opacity: 0, scale: 0}}
                                                                    key={platform}
                                                                    className="flex flex-col gap-4"
                                                                >
                                                                    <button
                                                                        disabled={socialPlatforms[platform] !== undefined && socialPlatforms[platform] !== ''}
                                                                        onClick={(e) => handleSocialPlatformButtonClick(e, platform)}
                                                                        className="disabled:opacity-50 disabled:cursor-not-allowed duration-200 flex font-medium items-center text-start px-4 rounded-lg hover:ring-sky-600 active:scale-95 ring-2 ring-highlight transition w-full h-full"
                                                                    >
                                                                        <Lottie className="w-1/2" loop={false} animationData={lottieAnimations[platform]}/>
                                                                        {capitalizeFirstLetter(platform)}
                                                                    </button>
                                                                </motion.div>

                                                            ))}
                                                        </motion.div>
                                                        <motion.div exit={{opacity: 0, scale: 0, height: 0}}>
                                                            <ButtonShad onClick={(e) => handleSocialMenuOpen(e)} className="mt-2 w-full group active:scale-95 transition flex items-center gap-2"
                                                                        variant="ring">
                                                                <FiChevronUp className="group-hover:rotate-180 transition duration-300"/>Close Menu
                                                            </ButtonShad>
                                                        </motion.div>
                                                    </motion.div>
                                                }
                                            </AnimatePresence>
                                        </div>

                                        <FormError message={error}/>
                                        <FormSuccess message={success}/>
                                        <ButtonShad variant="secondary" disabled={loading} className="border-white border disabled:cursor-not-allowed active:scale-90 transition" type="submit">
                                            {loading ? <BiLoader className="animate-spin"/> : 'Save'}
                                        </ButtonShad>
                                    </form>
                                </Form>

                                <div className="flex flex-col gap-4 w-fit mt-4">
                                    <div>
                                        <Membership settings user={user} userId={userId} stripeCustomerId={user.stripeId} globalUserId={globalUser?.id} globalUserRole={globalUser?.status}
                                                    globalUserName={globalUser?.name} globalStripeCustomerId={globalUser?.stripeId}/>
                                    </div>

                                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                        <DialogTrigger asChild>
                                            <ButtonShad className='gap-1'>
                                                <FaLock/>
                                                Change Password
                                            </ButtonShad>
                                        </DialogTrigger>
                                        <DialogContent className="flex flex-col gap-2 p-8">
                                            <div className="flex flex-col gap-1">
                                                <h1 className="text-2xl font-semibold mb-2">Update your password</h1>
                                                <UpdatePassword userId={globalUser?.id} closeModal={closeModal} userStatus={globalUser?.status} userPassword={userPasswordGlobal}/>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className="bg-darkgray rounded-2xl min-w-[21rem] p-1 w-full lg:w-2/4 xl:w-2/3 border-border border">
                                <UserProfile
                                    edit
                                    userDescription={user.description}
                                    roles={roles}
                                    src={user.profileImageUrl}
                                    userBannerUrl={user.profileBannerUrl}
                                    userId={userId}
                                    userName={user.name}
                                    userRoles={user.roles}
                                    userStatus={user.status}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else {
        return <PageLoader/>
    }
}
