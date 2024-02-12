import type {ReactNode} from 'react';
import {Award, CheckCheck, Play, Star} from 'lucide-react';
import type {Timestamp} from "firebase/firestore";

const ActivityCard = ({
                          title,
                          completedAt,
                          icon,
    isAuthorized
                      }: {
    title: string;
    completedAt: Timestamp;
    icon: string;
    isAuthorized: boolean;
}) => {

    const iconMap: Record<string, ReactNode> = {
        "Award": <Award/>,
        "CheckCheck": <CheckCheck/>,
        "Play": <Play/>,
        "Star": <Star/>,
    };

    const parts = title.split('-');
    const lessonName = parts[1].trim();

    const iconComponent = iconMap[icon] || null;
    return (
        <div className="justify-between h-24 w-full p-6 rounded-2xl bg-darkgray border border-border flex gap-2 items-center">
            <div className="flex gap-2 items-center">
                <span>{iconComponent}</span>
                <h1 className="text-xl 2xl:text-2xl font-medium">{parts[0]} <span className="font-bold">{lessonName}</span> {parts[2]}</h1>
            </div>
            <p className="font-light text-highlight">
                {completedAt.toDate().toLocaleString()}
            </p>
        </div>
    );
};

export default ActivityCard;
