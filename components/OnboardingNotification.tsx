import React, {useEffect, useState, useTransition} from 'react';
import {ButtonShad} from "@/components/ui/buttonshad";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {AnimatePresence, motion} from "framer-motion";
import OnboardingCard from "@/components/OnboardingCard";
import clsx from "clsx";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FaArrowRight} from "react-icons/fa";
import {FaArrowLeft} from "react-icons/fa6";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {OnboardingSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import YoutubeAnimation from '@/public/lottie/youtube.json'
import InstagramAnimation from '@/public/lottie/instagram.json'
import TiktokAnimation from '@/public/lottie/tiktok.json'
import TwitterAnimation from '@/public/lottie/twitter.json'
import NewTextArea from "@/components/UI Elements/NewTextArea";
import {BiLoader} from "react-icons/bi";
import NewInput from "@/components/UI Elements/NewInput";

interface OnboardingNotificationProps {
    userId: string | null;
    userName: string | null;
    step: string;
    description: string;
    selectedPlatforms: string;
}

const OnboardingNotification = ({userId, userName, step, description, selectedPlatforms}: OnboardingNotificationProps) => {

    const [open, setOpen] = useState(!!step)
    const [animation, setAnimation] = useState(true)
    const [progress, setProgress] = useState(100);

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const router = useRouter()

    const handleDialogClose = () => {
        setOpen(!open)
        setAnimation(true)
        setProgress(100)
        if (open) {
            router.push('dashboard')
        }
    }

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

        router.push(`/dashboard?step=${step}&description=${encodeURIComponent(description)}&selectedPlatforms=${updatedPlatforms}`);
    };

    const form = useForm<z.infer<typeof OnboardingSchema>>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            description: description
        }
    });

    const {description: FormDescription, social: FormSocial} = form.watch()

    useEffect(() => {
        const totalTime = 2000;
        let remainingTime = totalTime;
        let intervalId: NodeJS.Timeout;

        const startAnimation = () => {
            intervalId = setInterval(() => {
                remainingTime -= 100;
                setProgress((remainingTime / totalTime) * 100);

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

        startTransition(async () => {
            try {
                /*await register(values)*/
            } catch {
                setError('Something went wrong!');
            }
        });
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

    const Steps = [
        {
            content: (
                <div className="w-full flex flex-col gap-6 items-center justify-center text-center">
                    <h2 className="text-2xl font-medium">Tell us more about yourself.</h2>
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
                                                customWidth="w-96"
                                                customHeight="h-24 md:h-32"
                                                label="Enter a description about you"
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
                    <h2 className="text-xl font-medium">Choose the platforms where you run accounts</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {socialPlatforms.map((platform, index) => (
                            <OnboardingCard
                                key={index}
                                icon={platform.icon}
                                label={platform.title}
                                onClick={() => handlePlatformSelect(platform.title)}
                                checked={selectedPlatforms?.includes(platform.title)}
                            />
                        ))}
                    </div>
                </div>
            ),
        },
        {
            content: (
                <div className="flex flex-col items-center h-full justify-center gap-4">
                    <h2 className="text-xl font-medium">Link your accounts down below</h2>
                    {/*<p className="text-sm font-light text-muted-foreground">this will help us suit your needs and also will allow you to view your stats and analytics</p>*/}

                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className={clsx('grid gap-5', socialPlatforms.length > 2 ? 'md:grid-cols-2' : 'grid-cols-1')}>
                            {socialPlatforms
                                .filter(platform => selectedPlatforms?.includes(platform.title))
                                .map((socialForm, index) => (
                                <FormField key={index}
                                    control={form.control}
                                    name={socialForm.title as "social"}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <NewInput
                                                    {...field}
                                                    placeholder={`https://${socialForm.title.toLowerCase()}.com`}
                                                    id={index.toString()}
                                                    inputClassName='h-16'
                                                    label={`Enter a link to your ${socialForm.title}`}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            ))}
                            </div>

                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                        </form>
                    </Form>
                </div>
            )
        }
    ];


    const hrefValue =
        Number(step) >= Steps.length || !FormDescription
            ? ''
            : selectedPlatforms
                ? `/dashboard?step=${Number(step) + 1}&description=${encodeURIComponent(FormDescription)}&selectedPlatforms=${selectedPlatforms}`
                : Number(step) >= 2
                    ? `/dashboard?step=${step}&description=${encodeURIComponent(FormDescription)}`
                    : `/dashboard?step=${Number(step) + 1}&description=${encodeURIComponent(FormDescription)}`;

    return (
        <div className="md:pl-[15rem] lg:pl-[18rem] bg-upgrade/50 w-full py-2 px-4 flex lg:flex-row flex-col items-center text-center justify-center gap-1 lg:gap-4">
            <h1>👋 Hello {userName}, you haven&#39;t finished the onboarding process yet.</h1>
            <Dialog open={open} onOpenChange={handleDialogClose}>
                <DialogTrigger>
                    <ButtonShad onClick={() => router.push('dashboard?step=1')} size="sm" variant="secondary">Complete Onboarding</ButtonShad>
                </DialogTrigger>
                <DialogContent className="max-w-[43rem] border-none rounded-none">
                    <div className="ring ring-highlight/40 rounded-xl flex flex-col gap-4 items-center justify-center p-8">
                        <div className="text-center">
                        <h1 className="font-semibold text-3xl">Welcome, {userName}</h1>
                            <p className="font-light text-highlight">Lets customize your experience.</p>
                        </div>

                        <div className="w-full h-80 relative">
                            <AnimatePresence>
                                {animation &&
                                    <motion.div exit={{opacity: 0}} className="absolute inset-0 flex items-center justify-center h-full">
                                        Lottie Animation
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
                                            href={Number(step) > 1 ? description ?  selectedPlatforms ? `/dashboard?step=${Number(step) - 1}&description=${encodeURIComponent(description)}&selectedPlatforms=${selectedPlatforms}` : `/dashboard?step=${Number(step) - 1}&description=${encodeURIComponent(description)}`  : `/dashboard?step=${Number(step) - 1}` : ''}
                                            className={clsx("transition active:scale-90 absolute left-0", Number(step) <= 1 ? 'cursor-not-allowed' : 'group')}>
                                            <ButtonShad disabled={Number(step) <= 1} size="icon"><FaArrowLeft className="group-active:translate-x-0 group-hover:-translate-x-0.5 transition"/></ButtonShad>
                                        </Link>
                                        <Link
                                            href={hrefValue}
                                            className={clsx("absolute right-0 active:scale-90 transition", Number(step) >= Steps.length || !FormDescription ? 'cursor-not-allowed' : 'group')}>
                                            <ButtonShad disabled={Number(step) >= Steps.length || !FormDescription || step >= '2' && !selectedPlatforms} size="icon"><FaArrowRight className="group-active:translate-x-0 group-hover:translate-x-0.5 transition"/></ButtonShad>
                                        </Link>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>

                        <div className="gap-4 flex items-center justify-center">
                            {Steps.map((_, index) => (
                                <OnboardingSphere FormDescription={FormDescription} selectedPlatforms={selectedPlatforms} description={description} key={index} step={step >= '3' && !selectedPlatforms  ? index : index + 1} active={step === (index + 1).toString()}/>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OnboardingNotification;

const OnboardingSphere = ({active, FormDescription, step, description, selectedPlatforms}: { FormDescription: string | undefined, selectedPlatforms: string | undefined, description: string | undefined, active?: boolean, step: number }) => {
    return (
        <Link href={description || FormDescription ? selectedPlatforms ? `dashboard?step=${step}&description=${FormDescription || description}&socialPlatforms=${selectedPlatforms}` : `dashboard?step=${step}&description=${FormDescription || description}` : `dashboard?step=${step}`} className={clsx("w-2.5 hover:border-white border" +
            " transition h-2.5" +
            " rounded-full", active ? 'bg-white' +
            ' border-white' : 'border-highlight' +
            ' bg-highlight')}/>
    )
}