import { Metadata } from 'next';
import UserIdComponent from "@/app/(pages)/user/[userId]/UserId";

interface UserIdPageProps {
    params: {
        userId: string;
    };
}

export const metadata: Metadata = {
    title: 'User - STOIC',
    description: 'User page of Stoic platform',
}

const UserIdPage = ({
    params: {userId}
}: UserIdPageProps) => {
    return (
        <UserIdComponent userId={userId}/>
    );
}
 
export default UserIdPage;