import UserIdGuard from './UserIdGuard';

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
        <UserIdGuard userId={userId} />
    );
}
 
export default UserIdPage;