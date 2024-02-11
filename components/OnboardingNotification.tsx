"use client"

import React, {useEffect, useState, useTransition} from 'react';
import {ButtonShad} from "@/components/ui/buttonshad";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {AnimatePresence, motion} from "framer-motion";
import OnboardingCard from "@/components/OnboardingCard";
import clsx from "clsx";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {FaArrowRight} from "react-icons/fa";
import {FaArrowLeft} from "react-icons/fa6";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {OnboardingSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import YoutubeAnimation from '@/public/lottie/youtube.json'
import InstagramAnimation from '@/public/lottie/instagram.json'
import TiktokAnimation from '@/public/lottie/tiktok.json'
import TwitterAnimation from '@/public/lottie/twitter.json'
import NewTextArea from "@/components/UI Elements/NewTextArea";
import StoicLogo from '@/public/stoicWhite.webp'
import NewInput from "@/components/UI Elements/NewInput";
import BannerUpload from "@/components/Settings/BannerPhotoUpload";
import {isUserAllowedToFetch} from "@/utils/utils";
import Image from "next/image";
import {message} from "antd";
import {MdCancel} from "react-icons/md";
import Lottie from "lottie-react";
import FinishedAnimation from '@/public/lottie/checkmarkAnimation.json';
import {updateUser} from "@/utils/updateFirestore";

interface OnboardingNotificationProps {
    userId: string | null;
    userName: string | null;
    userStatus: string | undefined;
    step: string;
    description: string;
    selectedPlatforms: string;
    instagram: string | null;
    twitter: string | null;
    tiktok: string | null;
    youtube: string | null;
    skip: string | null;
    final: string | null;
}

const OnboardingNotification = ({final, userId, userName, userStatus, step, skip, description, selectedPlatforms, twitter, instagram, youtube, tiktok}: OnboardingNotificationProps) => {

    const [open, setOpen] = useState(!!step)
    const [animation, setAnimation] = useState(true)

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const [formSocials, setFormSocials] = useState<{
        instagram: string;
        twitter: string;
        youtube: string;
        tiktok: string;
        [key: string]: string;
    }>({
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
    });

    const router = useRouter()

    const pathname = usePathname()

    const isAuthorized = isUserAllowedToFetch(userStatus)

    const handleDialogClose = () => {
        setOpen(!open)
        setAnimation(true)
        if (open) {
            router.push(pathname)
        }
    }

    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
        },
        animate: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.14 * index,
            },
        }),
    };

    const handlePlatformSelect = (platformTitle: string) => {
        // If selectedPlatforms is an empty string, set existingPlatforms to an empty array
        const existingPlatforms = selectedPlatforms ? selectedPlatforms.split(',').filter(Boolean) : [];

        const platformIndex = existingPlatforms.indexOf(platformTitle);

        if (platformIndex !== -1) {
            existingPlatforms.splice(platformIndex, 1);
        } else {
            existingPlatforms.push(platformTitle);
        }

        const updatedPlatforms = existingPlatforms.join(',');

        router.push(`${pathname}?step=${step}&description=${encodeURIComponent(description)}&selectedPlatforms=${updatedPlatforms}`);
    };

    const form = useForm<z.infer<typeof OnboardingSchema>>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            description: description,
            instagram: instagram || '',
            youtube: youtube || '',
            twitter: twitter || '',
            tiktok: tiktok || ''
        }
    });

    const {description: FormDescription, instagram: FormInstagram, twitter: FormTwitter, youtube: FormYoutube, tiktok: FormTiktok} = form.watch()

    useEffect(() => {
        const updatedFormSocials = {
            instagram: FormInstagram || instagram || '',
            twitter: FormTwitter || twitter || '',
            youtube: FormYoutube || youtube || '',
            tiktok: FormTiktok || tiktok || '',
        };
        setFormSocials(updatedFormSocials)
    }, [FormInstagram, FormTwitter, FormYoutube, FormTiktok, instagram, twitter, youtube, tiktok]);

    useEffect(() => {
        const totalTime = 1000;
        let remainingTime = totalTime;
        let intervalId: NodeJS.Timeout;

        const startAnimation = () => {
            intervalId = setInterval(() => {
                remainingTime -= 100;

                if (remainingTime <= 0) {
                    setAnimation(false);
                    clearInterval(intervalId);
                }
            }, 100);
        };
        if (open) {
            startAnimation();
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [open]);

    const onSubmit = async (values: z.infer<typeof OnboardingSchema>) => {
        setError('');
        setSuccess('');

        // get from searchparam if not from values if not empty string

        if ( Number(step) === 4 && description && (skip === 'true' || selectedPlatforms && socialPlatforms) )
            startTransition(async () => {
                try {
                    const updatedSocials = {
                        instagram: formSocials.instagram || instagram || '',
                        twitter: formSocials.twitter || twitter || '',
                        youtube: formSocials.youtube || youtube || '',
                        tiktok: formSocials.tiktok || tiktok || '',
                    };

                    const UpdatedUserDetails = {
                        description: FormDescription || description || '',
                        social: updatedSocials,
                        onboarding: false
                    }

                    await updateUser(userId, UpdatedUserDetails);
                    message.success('You have succesfully completed the onboarding!')
                } catch {
                    setError('Something went wrong!');
                }
            });
    };

    const handleRemovePlatform = (platformTitle: string) => {
        const existingPlatforms = selectedPlatforms ? selectedPlatforms.split(',').filter(Boolean) : [];
        const updatedPlatforms = existingPlatforms.filter(platform => platform !== platformTitle).join(',');

        router.push(`${pathname}?step=3&description=${encodeURIComponent(description)}&selectedPlatforms=${updatedPlatforms}`);
    };

    const placeholderMessages = [
        'After Effects Expert',
        '5 x boosted 😷💉, Xe/Xim, Vice/BBC, BLM ✊🏿, Democrat, Vegan, Climate change ⚠️',
        'Short-Form Expert'
    ]

    const socialPlatforms = [
        {
            title: 'Youtube',
            icon: YoutubeAnimation
        },
        {
            title: 'Instagram',
            icon: InstagramAnimation
        },
        {
            title: 'TikTok',
            icon: TiktokAnimation
        },
        {
            title: 'Twitter',
            icon: TwitterAnimation
        }
    ]

    const cancelDisabled = (title: string) => {
        return !(title.toLowerCase() in formSocials) || formSocials[title.toLowerCase()].trim() !== '';
    };

    const SkipLinking = () => {
        if (description) {
            router.push(`${pathname}?step=4&description=${description}&skip=true`)
        } else {
            router.push(`${pathname}?step=1`)
        }
    }

    const Steps = [
        {
            content: (
                <div className="w-full flex flex-col gap-6 items-center justify-center text-center">
                    <h2 className="text-2xl font-medium text-center">Tell us more about yourself</h2>
                    <Form {...form}>
                        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <NewTextArea
                                                {...field}
                                                placeholder={placeholderMessages[Math.floor(Math.random() * placeholderMessages.length)]}
                                                id="description"
                                                customWidth="md:w-96"
                                                customHeight="h-24 md:h-32"
                                                label="Enter your description"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                        </form>
                    </Form>
                </div>
            ),
        },
        {
            content: (
                <div className="flex flex-col items-center h-full justify-center gap-4">
                    <h2 className="text-xl font-medium text-center">Choose the platforms where you run accounts</h2>

                    <div className="grid grid-cols-2 gap-3">
                        {socialPlatforms.map((platform, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                variants={fadeInAnimationVariants}
                                initial="initial"
                                whileInView="animate"
                            >
                                <OnboardingCard
                                    icon={platform.icon}
                                    label={platform.title}
                                    onClick={() => handlePlatformSelect(platform.title)}
                                    checked={selectedPlatforms?.includes(platform.title)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="hover:text-white text-highlight flex items-center gap-2 active:scale-90 transition underline-offset-4 underline">
                                Skip <FaArrowRight size={12}/>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col gap-2 p-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold mb-2">Are you sure?</h1>
                                <p className="text-highlight">Linking your account allows us to provide you with helpful analytics and stats of your accounts.</p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <ButtonShad variant="destructive" onClick={SkipLinking}>
                                    Skip
                                </ButtonShad>
                                <DialogClose>
                                    <ButtonShad variant="secondary">
                                        Cancel
                                    </ButtonShad>
                                </DialogClose>
                            </div>
                            <p className="text-highlight text-sm">* You can always do this later in the user settings.</p>
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        },
        {
            content: (
                <div className="flex flex-col items-center h-full justify-center gap-4">
                    <h2 className="text-xl font-medium text-center">Link your accounts down below</h2>
                    {/*<p className="text-sm font-light text-muted-foreground">this will help us suit your needs and also will allow you to view your stats and analytics</p>*/}

                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className={clsx('grid gap-5', selectedPlatforms.split(',').length > 2 ? 'md:grid-cols-2' : 'grid-cols-1')}>
                                {socialPlatforms
                                    .filter(platform => selectedPlatforms?.includes(platform.title))
                                    .map((socialForm, index) => (
                                        <div key={index} className="relative">
                                            <FormField
                                                control={form.control}
                                                name={socialForm.title.toLowerCase() as "instagram" | "youtube" | "tiktok" | "twitter"}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <NewInput
                                                                {...field}
                                                                placeholder={`Enter a link to your ${socialForm.title}`}
                                                                id={index.toString()}
                                                                inputClassName={selectedPlatforms.split(',').length > 2 ? 'h-10 pr-8' : 'pr-8'}
                                                                label={`${socialForm.title} account link`}
                                                                disabled={isPending}
                                                                customWidth={selectedPlatforms.split(',').length <= 2 ? 'w-80' : 'w-full'}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            {
                                                cancelDisabled(socialForm.title) ? (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button className="hover:scale-110 active:scale-90 transition hover:opacity-80 absolute right-2 top-3 text-red-500">
                                                                <MdCancel/>
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent className="flex flex-col gap-6 p-8">
                                                            <div className="flex flex-col gap-1">
                                                                <h1 className="text-2xl font-semibold">Delete confirmation</h1>
                                                                <p className="text-highlight">You&apos;ve already typed something in this box. Are you sure you want to erase it?</p>
                                                                {formSocials[socialForm.title.toLowerCase()] &&
                                                                    <p className="break-all">You have entered: {formSocials[socialForm.title.toLowerCase()]}</p>
                                                                }
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <ButtonShad variant="destructive" onClick={() => handleRemovePlatform(socialForm.title)}>
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
                                                ) : (
                                                    <button
                                                        onClick={() => handleRemovePlatform(socialForm.title)}
                                                        className="hover:scale-110 active:scale-90 transition hover:opacity-80 absolute right-2 top-3 text-red-500"
                                                    >
                                                        <MdCancel/>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ))}
                            </div>

                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                        </form>
                    </Form>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-highlight flex items-center gap-2 active:scale-90 transition underline-offset-4 underline">
                                Skip <FaArrowRight size={12}/>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col gap-2 p-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold mb-2">Are you sure?</h1>
                                <p className="text-highlight">Linking your account allows us to provide you with helpful analytics and stats of your accounts.</p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <ButtonShad variant="destructive" onClick={SkipLinking}>
                                    Skip
                                </ButtonShad>
                                <DialogClose>
                                    <ButtonShad variant="secondary">
                                        Cancel
                                    </ButtonShad>
                                </DialogClose>
                            </div>
                            <p className="text-highlight text-sm">* You can always link your accounts later in user settings</p>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
        {
            content: (
                <div className="flex flex-col items-center h-full justify-center gap-4">
                    <h2 className="text-xl font-medium text-center">Upload your banner</h2>
                    <BannerUpload
                        isAuthorized={isAuthorized}
                        userId={userId || ''}
                        bypass
                        noTitle
                    />
                </div>
            )
        },
        {
            content: (
                <div className="flex flex-col items-center h-full justify-center gap-4">
                    <Lottie className="w-48" animationData={FinishedAnimation} loop={false} />
                    <h2 className="text-2xl font-medium text-center">You&apos;re all set-up!</h2>
                    <ButtonShad onClick={handleDialogClose} variant="secondary" className="w-full">Return</ButtonShad>
                </div>
            )
        }
    ];

    const handleNext = async () => {
        await form.handleSubmit(onSubmit)();
        const formErrors = form.formState.errors

        if ((!skip && (formErrors.youtube || formErrors.instagram || formErrors.tiktok || formErrors.twitter) && Number(step) >= 3) || formErrors.description) {
            message.warning('Please check your details.')
        } else {
            router.push(hrefValue)
        }
    };

    const isDisabled: boolean = (
        (Number(step) >= Steps.length && !skip) ||
        !FormDescription ||
        ((Number(step) >= 2 && !selectedPlatforms) && !skip) ||
        ((Number(step) >= 3 && !Object.values(formSocials).some(value => value !== '')) && !skip) ||
        (
            (!!form.formState.errors.youtube || !!form.formState.errors.instagram || !!form.formState.errors.tiktok || !!form.formState.errors.twitter) &&
            Number(step) >= 3 && !skip
        ) ||
        (!!form.formState.errors.description && !skip)
    );

    const hrefValue = Number(step) >= Steps.length || !FormDescription
        ? ''
        : selectedPlatforms
            ? Number(step) === 3 && (!formSocials || Object.values(formSocials).every(value => value === ''))
                ? `${pathname}?step=${step}&description=${encodeURIComponent(FormDescription)}&selectedPlatforms=${encodeURIComponent(selectedPlatforms)}`
                : `${pathname}?step=${Number(step) + 1}&description=${encodeURIComponent(FormDescription)}&selectedPlatforms=${encodeURIComponent(selectedPlatforms)}` +
                `&${Object.entries(formSocials)
                    .filter(([_, value]) => value !== '')
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&')}`
            : Number(step) === 4
                ? `${pathname}?step=5&final=true`  // Handle step 4 case
                : Number(step) >= 2
                    ? `${pathname}?step=${step}&description=${encodeURIComponent(FormDescription)}`
                    : `${pathname}?step=${Number(step) + 1}&description=${encodeURIComponent(FormDescription)}`;

    return (
        <div className="md:pl-[15rem] lg:pl-[18rem] bg-upgrade/50 w-full py-2 px-4 flex lg:flex-row flex-col items-center text-center justify-center gap-1 lg:gap-4">
            <h1 className="font-medium">👋 Hello {userName}, you haven&#39;t finished the onboarding process yet.</h1>
            <Dialog open={open} onOpenChange={handleDialogClose}>
                <DialogTrigger>
                    <ButtonShad onClick={() => router.push(pathname + '?step=1')} size="sm" variant="secondary">Complete Onboarding</ButtonShad>
                </DialogTrigger>
                <DialogContent className="max-w-[43rem] border-none rounded-xl">
                    <div className="ring ring-highlight/40 rounded-xl flex flex-col gap-4 items-center justify-center p-8">
                        <div className="text-center">
                            <h1 className="font-semibold text-3xl">Welcome, {userName}</h1>
                            <motion.p viewport={{once: true}} initial={{opacity: 0}} whileInView={{opacity: 1}} className="font-light text-highlight">Lets customize your experience.</motion.p>
                        </div>

                        <div className="w-full h-80 relative">
                            <AnimatePresence>
                                {animation &&
                                    <motion.div initial={{opacity: 0, scale: .5}} whileInView={{scale: 1, opacity: 1}} transition={{type: 'spring', damping: 15}} exit={{opacity: 0, scale: 1.5}}
                                                className="flex-col gap-4 absolute inset-0 flex items-center justify-center w-full h-full">
                                        <Image src={StoicLogo} placeholder="blur" className="object-cover w-44" height={400} width={400} alt="Stoic Logo Animation"/>
                                        <h1 className="text-3xl tracking-widest">S T O I C</h1>
                                    </motion.div>
                                }
                            </AnimatePresence>
                            <AnimatePresence>
                                {!animation &&
                                    <motion.div initial={{opacity: 0, scale: 0.7}} whileInView={{opacity: 1, scale: 1}} transition={{type: "spring", damping: 25, stiffness: 200}}
                                                viewport={{once: true}} className="flex flex-col h-full justify-center">
                                        <div className="w-full flex items-center justify-center py-4 px-14">
                                            <AnimatePresence>
                                                {Steps.map((stepContent, index) => (
                                                    step === (index + 1).toString() && (
                                                        <motion.div initial={{x: 35, opacity: 0}} className="absolute inset-0 flex w-full mx-auto h-full items-center justify-center"
                                                                    animate={{x: 0, opacity: 100}} exit={{x: 35, opacity: 0}} key={index}>
                                                            {stepContent.content}
                                                        </motion.div>
                                                    )
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                            <Link
                                                href={final === 'true' ? '' : (Number(step) > 1 ? description ? selectedPlatforms ? `${pathname}?step=${Number(step) - 1}&description=${encodeURIComponent(description)}&selectedPlatforms=${selectedPlatforms}` : `${pathname}?step=${Number(step) - 1}&description=${encodeURIComponent(description)}` : `${pathname}?step=${Number(step) - 1}` : '')}
                                                className={clsx("transition hidden md:block active:scale-90 absolute left-0", Number(step) <= 1 ? 'cursor-not-allowed' : 'group')}>
                                                <ButtonShad disabled={Number(step) <= 1 || final === 'true'} size="icon"><FaArrowLeft
                                                    className="group-active:translate-x-0 group-hover:-translate-x-0.5 transition"/></ButtonShad>
                                            </Link>
                                            <button
                                                onClick={handleNext}
                                                className={clsx("absolute hidden md:block right-0 active:scale-90 transition", isDisabled ? 'cursor-not-allowed' : 'group')}>
                                                <ButtonShad
                                                    size="icon"
                                                    disabled={isDisabled}
                                                >
                                                    <FaArrowRight className="group-active:translate-x-0 group-hover:translate-x-0.5 transition"/>
                                                </ButtonShad>
                                            </button>

                                            <Link
                                                href={final === 'true' ? '' : (Number(step) > 1 ? description ? selectedPlatforms ? `${pathname}?step=${Number(step) - 1}&description=${encodeURIComponent(description)}&selectedPlatforms=${selectedPlatforms}` : `${pathname}?step=${Number(step) - 1}&description=${encodeURIComponent(description)}` : `${pathname}?step=${Number(step) - 1}` : '')}
                                                className={clsx("md:hidden transition active:scale-90 absolute left-0 bottom-0", Number(step) <= 1 ? 'cursor-not-allowed' : 'group')}>
                                                <ButtonShad disabled={Number(step) <= 1 || final === 'true'} size="icon"><FaArrowLeft
                                                    className="group-active:translate-x-0 group-hover:-translate-x-0.5 transition"/></ButtonShad>
                                            </Link>
                                            <button
                                                onClick={handleNext}
                                                className={clsx("md:hidden absolute right-0 bottom-0 active:scale-90 transition", isDisabled ? 'cursor-not-allowed' : 'group')}>
                                                <ButtonShad
                                                    size="icon"
                                                    disabled={isDisabled}
                                                >
                                                    <FaArrowRight className="group-active:translate-x-0 group-hover:translate-x-0.5 transition"/>
                                                </ButtonShad>
                                            </button>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>

                        <div className="gap-4 flex items-center justify-center">
                            {Steps.map((_, index) => (
                                <OnboardingSphere key={index} active={step === (index + 1).toString()}/>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OnboardingNotification;

const OnboardingSphere = ({active}: {
    active?: boolean,
}) => {
    return (
        <div
            className={clsx("transition w-2.5 h-2.5 rounded-full", active ? 'bg-white' : 'bg-highlight')}
        />
    )
}