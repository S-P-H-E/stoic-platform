import { User } from '@/types/types';
import Image from 'next/image';
import { ButtonShad } from '../ui/buttonshad';
import { FaPen } from 'react-icons/fa6';

interface GlobalUser {
  id: string | null;
  status: string | undefined;
}

const UserIdHeader = ({
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
    <section className="w-full">
      <div className="w-full h-[48svh] min-h-[12rem] max-h-screen relative bg-darkgray">
        <div className="group relative w-full xl:w-[80%] lg:w-[85%] h-full max-w-7xl max-h-7xl flex flex-col mx-auto lg:rounded-b-2xl">
          <Image
            fill
            priority
            src={user.profileBannerUrl}
            className="object-cover lg:rounded-b-2xl"
            alt="User Banner Image"
          />
          {isAuthorized && (
            <div className="absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-2xl lg:text-3xl font-medium flex items-center justify-center lg:rounded-b-2xl group-hover:opacity-100 transition">
              <h1>Click to change your banner</h1>
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-darkgray border-b border-border pb-6">
        <div className="px-6 gap-4 flex justify-between items-center xl:w-[80%] lg:w-[85%] max-w-7xl max-h-7xl mx-auto h-3/4 w-full relative">
            <div className="group absolute bottom-0 left-8 ring-8 ring-darkgray w-44 xl:w-52 aspect-square rounded-full">
              <div className="relative h-full w-full">
                <Image
                  fill
                  src={user.profileImageUrl}
                  className="rounded-full object-cover"
                  alt="User Profile Image"
                />
                {isAuthorized && (
                  <div className="absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-2xl lg:text-3xl font-medium flex items-center justify-center rounded-full group-hover:opacity-100 transition">
                    <FaPen className="w-[20%] h-[20%]" />
                  </div>
                )}
              </div>
            </div>
            <div className="ml-[11.5rem] xl:ml-[13.5rem] px-2 py-4">
              <h1 className="text-2xl xl:text-3xl font-semibold line-clamp-1">
                {user.name}
              </h1>
              <h1 className="text-sm xl:text-base font-light text-highlight line-clamp-1">
                {user.email}
              </h1>
            </div>


          {isAuthorized ? (
            <div className="flex gap-2 items-center">
              <ButtonShad variant="secondary">
                <p>Billing</p>
              </ButtonShad>
              <ButtonShad>
                <p>Manage Account</p>
              </ButtonShad>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <ButtonShad variant="secondary">View</ButtonShad>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserIdHeader;
