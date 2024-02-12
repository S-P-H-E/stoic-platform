'use client';

import {User, GlobalUser} from '@/types/types';
import {motion} from 'framer-motion';
import ActivityCard from './ActivityCard';
import type {Timestamp} from "firebase/firestore";
import {Frown} from "lucide-react";

interface Activity {
    title: string;
    completedAt: Timestamp;
    icon: string;
}

const Activities = ({
                        user,
                        globalUser,
                        userId,
                        userActivities,
                        isAuthorized,
                    }: {
    user: User;
    globalUser: GlobalUser;
    userId: string;
    userActivities: Activity[] | undefined
    isAuthorized: boolean;
}) => {
    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
            y: 100,
        },
        animate: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: (index % 1) * 0.15,
            },
        }),
    };

    return (
        <section className="w-full flex flex-col gap-4">
            {userActivities && userActivities.length > 0 ? userActivities.map((activity, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    variants={fadeInAnimationVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{
                        once: true,
                    }}
                >
                    <ActivityCard
                        isAuthorized={isAuthorized}
                        title={activity.title ? activity.title : 'Loading...'}
                        completedAt={activity.completedAt}
                        icon={activity.icon}
                    />
                </motion.div>
            ))
            :
            <div className="flex flex-col gap-2 md:gap-4 justify-center text-center items-center h-full">
                <Frown size={64}/>
                <h1 className="text-lg md:text-2xl">{isAuthorized ? "You currently dont have any activities so far." : "This user doesn't have any activities yet."}</h1>
            </div>
            }
        </section>
    );
};

export default Activities;
