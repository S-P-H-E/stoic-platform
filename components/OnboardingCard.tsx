import React from 'react';
import Lottie from "lottie-react";
import clsx from "clsx";

const OnboardingCard = ({ onClick, checked, label, icon }: { onClick: () => void, checked: boolean, label: string, icon: any }) => {
    return (
        <button onClick={onClick} className={clsx("border-2 flex items-center hover:border-highlight duration-150 hover:bg-border transition active:scale-95 rounded-md border-border w-32" +
            " md:w-[14.5rem] h-32", checked && 'bg-border active:bg-red-900/20')}>
            <Lottie className="w-32" animationData={icon} loop={false}/>
            <h1 className="font-semibold text-xl md:block hidden">{label}</h1>
        </button>
    );
};

export default OnboardingCard;