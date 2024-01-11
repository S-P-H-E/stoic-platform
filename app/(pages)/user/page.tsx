import { Metadata } from 'next';
import UserGuard from './UserGuard';

export const metadata: Metadata = {
    title: 'User - STOIC',
    description: 'User page of Stoic platform',
}

const UserPage = () => {
    return (
        <UserGuard/>
    );
}
 
export default UserPage;