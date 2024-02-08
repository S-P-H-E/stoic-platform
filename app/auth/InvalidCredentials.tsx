import React from 'react';
import Image from "next/image";
import StoicLogo from "@/public/stoicWhite.webp";
import CardWrapper from "@/components/CardWrapper";

const InvalidCredentials = ({type}: {type: "mode" | "request"}) => {
    return (
        <CardWrapper className="md:w-[600px]" headerLabel={'Invalid mode'} backButtonLabel={'Go back'} backButtonHref={'/'}>
            <div className="flex flex-col items-center justify-center gap-2 text-white">
            <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
            <h3 className='text-2xl font-medium text-center'>Invalid {type} provided, please try again later.</h3>
            </div>
        </CardWrapper>
    );
};

export default InvalidCredentials;
