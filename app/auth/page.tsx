import React from 'react';
import PageLoader from "@/components/PageLoader";
import {redirect} from "next/navigation";
import {message} from "antd";

interface AuthHandlerProps {
    searchParams: {
        continueUrl: string | null,
        oobCode: string | null,
        mode: string | null
    }
}

const AuthHandler = ({
                         searchParams: {continueUrl, oobCode, mode}
                     }: AuthHandlerProps) => {

    if (!oobCode || !mode) {
        message.error('There was an issue with your request, please try again')
        redirect('')
    }

    if (mode === 'resetPassword') {
        if (continueUrl) {
            redirect(`auth/reset-password?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}`)
        } else {
            redirect(`auth/reset-password?mode=${mode}&oobCode=${oobCode}`)
        }
    }

    if (mode === 'verifyEmail') {
        if (continueUrl) {
            redirect(`auth/verify-email?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}`)
        } else {
            redirect(`auth/verify-email?mode=${mode}&oobCode=${oobCode}`)
        }
    }

    return <PageLoader/>
};

export default AuthHandler;
