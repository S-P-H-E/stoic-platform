import { ButtonShad } from '@/components/ui/buttonshad';
import Link from 'next/link';
import Image from 'next/image';
import UserIdHeader from '@/components/UserId/Header';
import AboutMe from '@/components/UserId/AboutMe';
import Activities from '@/components/UserId/Activities';
import Locked from '@/components/Locked';
import StoicLogo from '@/public/stoicWhite.webp'
import Socials from '@/components/UserId/Socials';
import Unauthorized from '@/components/Unauthorized';
import {User} from "@/types/types";

interface GlobalUser {
    id: string | null;
    status: string | undefined;
    name: string | null;
    stripeId: string | undefined;
}

const UserIdComponent = ({globalUser, userId, user}: {globalUser: GlobalUser | undefined, user: User | undefined, userId: string}) => {
    const isAuthorized = userId === globalUser?.id || globalUser?.status === 'admin' && user?.status !== 'admin';

    if (user && globalUser && globalUser.status !== 'user') {
        return (
            <main className='h-full flex flex-col gap-4 w-full'>
                <UserIdHeader isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                <div className='w-full xl:w-[80%] lg:w-[85%] max-w-7xl max-h-7xl px-6 mx-auto flex flex-col lg:flex-row gap-4 pb-8'>{/*  PADDING CHECK! !! ! ! */}
                    <Activities isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                    <div className="gap-4 flex flex-col w-1/2 max-w-[20rem]">
                        <AboutMe isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                        <Socials isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                    </div>
                </div>
            </main>
        );
    } else {
        return <Unauthorized locked={globalUser?.status === 'user'}/>
    }
}
 
export default UserIdComponent;


{/* <div className='h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full'>
    <div className='flex flex-col gap-4 w-full'>
        <h1>{userId}</h1>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
        {globalUser.id == userId &&
        <Link href={`${userId}/settings`}><ButtonShad>Settings</ButtonShad></Link>
        }
    </div>
</div> */}