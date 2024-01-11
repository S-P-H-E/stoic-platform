import { ButtonShad } from '@/components/ui/buttonshad';
import { User } from './../../../../types/types';
import Link from 'next/link';

interface GlobalUser {
    id: string | null;
    status: string | undefined;
}

const UserIdComponent = ({globalUser, userId, user}: {globalUser: GlobalUser, user: User, userId: string}) => {
    return (
        <div className='h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full'>
            <div className='flex flex-col gap-4 w-full'>
                <h1>{userId}</h1>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
                {globalUser.id == userId &&
                <Link href={`${userId}/settings`}><ButtonShad>Settings</ButtonShad></Link>
                }
            </div>
        </div>
    );
}
 
export default UserIdComponent;