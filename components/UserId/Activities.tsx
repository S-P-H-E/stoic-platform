'use client';

import { User, GlobalUser } from '@/types/types';
import { Award, CheckCheck, Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import type { ReactNode } from 'react';

interface Activity {
  title: string;
  completedAt: Date;
  icon: ReactNode;
}

const Activities = ({
  user,
  globalUser,
  userId,
  isAuthorized,
}: {
  user: User;
  globalUser: GlobalUser;
  userId: string;
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
        delay: 0.04 * index,
      },
    }),
  };

  const activities: Activity[] = [
    {
      title: "Completed 'Top 1%' Lesson",
      completedAt: new Date(),
      icon: <CheckCheck size={30} />,
    },
    {
      title: "Completed 'The Algorithm' Lesson",
      completedAt: new Date('2024-01-14T10:00:00'),
      icon: <Star size={30} />,
    },
    {
      title: "Completed 'Introduction' Lesson",
      completedAt: new Date('2024-01-15T14:30:00'),
      icon: <Play size={30} />,
    },
    {
      title: 'Reached 1k Subscribers!',
      completedAt: new Date('2024-01-20T18:45:00'),
      icon: <Award size={30} />,
    },
    {
      title: 'Reached 100k Views on Latest Video',
      completedAt: new Date('2024-01-22T12:15:00'),
      icon: <Play size={30} />,
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {activities.map((activity, index) => (
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
            title={activity.title}
            completedAt={activity.completedAt}
            icon={activity.icon}
          />
        </motion.div>
      ))}
    </section>
  );
};

export default Activities;
