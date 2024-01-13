import type { ReactNode } from "react";

const ActivityCard = ({
    title,
    completedAt,
    icon
}: {
    title: string;
    completedAt: Date;
    icon: ReactNode
}) => {
    return (
        <div className="justify-between h-24 w-full p-6 rounded-2xl bg-darkgray border border-border flex gap-2 items-center">
            <div className="flex gap-2 items-center">
                <span>{icon}</span>
                <h1 className="text-xl 2xl:text-2xl font-medium">{title}</h1>
            </div>
            <p className="font-light text-highlight">{completedAt.toLocaleString()}</p>
        </div>
    );
}
 
export default ActivityCard;