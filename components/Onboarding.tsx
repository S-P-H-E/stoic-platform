import React from 'react';
import OnboardingCard from "@/components/OnboardingCard";
import {motion} from 'framer-motion'
import clsx from "clsx";

interface OnboardingProps {
    userId: string | null
    userName: string | null
}

const Onboarding = ({userId, userName}: OnboardingProps) => {
    return (
        <section
            className="md:pl-[15rem] lg:pl-[18rem] fixed inset-0 backdrop-blur-xl w-full h-full flex items-center bg-black/30 justify-center z-40"
        >
            <motion.div initial={{scale: 0, opacity: 0}} whileInView={{ scale: 1, opacity: 1 }} transition={{type: 'spring', stiffness: 200, damping: 16}} className="ring ring-highlight/40 rounded-lg flex flex-col gap-4 items-center justify-center p-8 bg-white bg-opacity-5 backdrop-blur">
                <div className="text-center">
                    <h1 className="font-semibold text-3xl">Welcome, {userName}</h1>
                    <p className="font-light text-highlight">Lets customize your experience.</p>
                </div>
                <div className="flex items-center gap-8">
                </div>
                <div className="gap-4 flex items-center justify-center">
                    <OnboardingSphere active/>
                </div>
            </motion.div>
        </section>
    );
};

export default Onboarding;

const OnboardingSphere = ({active}: {active: boolean}) => {
    return (
        <span className={clsx("w-2 h-2 rounded-full", active ? 'bg-white' : 'bg-highlight')}/>
    )
}