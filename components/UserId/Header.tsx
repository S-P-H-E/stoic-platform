import { User } from '@/types/types';
import Image from 'next/image';
import { ButtonShad } from '../ui/buttonshad';
import { FaPen } from 'react-icons/fa6';
import UserImagePassable from '../UserImagePassable';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import BannerUpload from '../Settings/BannerPhotoUpload';
import PhotoUpload from '../Settings/ProfilePhotoUpload';
import Membership from './Membership';

interface GlobalUser {
  id: string | null;
  status: string | undefined;
  stripeId: string | undefined;
  name: string | null;
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
          {!user.profileBannerUrl ?
            <div className="w-full h-full bg-border rounded-b-2xl animate-pulse"/>
          :
            <Image
              fill
              priority
              src={user.profileBannerUrl}
              className="object-cover lg:rounded-b-2xl"
              alt="User Banner Image"
            /> 
          }
          {isAuthorized && (
            <Dialog>
              <DialogTrigger>
                <div className="absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-2xl lg:text-3xl font-medium flex items-center justify-center lg:rounded-b-2xl group-hover:opacity-100 transition">
                  <h1>Click to change your banner</h1>
                </div>
              </DialogTrigger>
              <DialogContent >
                <BannerUpload isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="w-full bg-darkgray border-b border-border pb-6">
        <div className="px-6 gap-4 flex justify-between items-center xl:w-[80%] lg:w-[85%] max-w-7xl max-h-7xl mx-auto h-3/4 w-full relative">
            <div className="absolute bottom-0 left-8 ring-8 ring-darkgray w-44 xl:w-52 bg-darkgray aspect-square rounded-full">
              <div className="group relative h-full w-full rounded-full">
                
                <Avatar className="w-full h-full">
                {!user.profileImageUrl ?
                  <div className="w-full h-full bg-border rounded-full animate-pulse"/>
                  :
                <AvatarImage src={user.profileImageUrl ?? undefined} />
                }
                  <AvatarFallback className='uppercase bg-darkgray select-none text-base w-full h-full'>{user.name && user.name.charAt(0)}{user.name && user.name.charAt(user.name.length - 1)}</AvatarFallback>
                </Avatar>
                {isAuthorized && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer absolute w-full h-full inset-0 opacity-0 bg-bg/50 text-2xl lg:text-3xl font-medium flex items-center justify-center rounded-full group-hover:opacity-100 transition">
                        <FaPen className="w-[20%] h-[20%]" />
                      </div>
                    </DialogTrigger>
                    <DialogContent >
                      <PhotoUpload isAuthorized={isAuthorized} userId={userId} globalUser={globalUser} user={user}/>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="ml-[11.5rem] xl:ml-[13.5rem] px-2 py-4">
              <h1 className="text-2xl xl:text-3xl font-semibold line-clamp-1">
                {user.name ? user.name : 'Loading...'}
              </h1>
              <h1 className="text-sm xl:text-base font-light text-highlight line-clamp-1">
                {user.email ? user.email : 'Loading...'}
              </h1>
            </div>


          {isAuthorized ? (
            <div className="flex gap-2 items-center">
              <Membership 
                user={user} 
                globalUserName={globalUser.name} 
                globalStripeCustomerId={globalUser.stripeId || undefined} 
                globalUserRole={globalUser.status} 
                globalUserId={globalUser.id} 
                stripeCustomerId={user.stripeId} 
                userId={userId}
              />
              <ButtonShad variant="secondary">
                <p>Settings</p>
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
