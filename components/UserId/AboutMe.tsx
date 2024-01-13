import { User } from '@/types/types';

interface GlobalUser {
  id: string | null;
  status: string | undefined;
}

const AboutMe = ({
    user,
    globalUser,
    userId,
    isAuthorized
  }: {
    user: User;
    globalUser: GlobalUser;
    userId: string;
    isAuthorized: boolean;
  }) => {
    return (
        <section className="border border-border bg-darkgray rounded-2xl w-full h-96 lg:w-80 p-5 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">About Me</h1>
            <p className="opacity-90">Hello im andrew tate and you are a fucking n****</p>
        </section>
    );
}
 
export default AboutMe;