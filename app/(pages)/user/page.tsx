import { Metadata } from 'next';
import UserComponent from "@/app/(pages)/user/User";

export const metadata: Metadata = {
    title: 'User - STOIC',
    description: 'User page of Stoic platform',
}

const UserPage = () => {
    return (
        <UserComponent/>
    );
}
 
export default UserPage;