import clsx from "clsx";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserProfileDialog({src, userName, userStatus, userBannerUrl}: {src: string, userName: string, userStatus: string, userBannerUrl: string}){
    
    const userChar: string = userName ? userName : '';
    
    const statusClass = clsx({
        'text-yellow-500': userStatus === 'Admin',
        'text-orange-500': userStatus === 'Premium',
        'text-gray-500': userStatus === 'Free'
    });

    return(
        <div className="rounded-xl h-96 p-2 relative">
            <div className="w-full h-40 relative">
                {userBannerUrl ? 
                    <Image alt="User Banner" fill className="rounded-lg object-cover" src={userBannerUrl} />
                : 
                    <div className='w-full h-full bg-white rounded-lg'/>
                }
            </div>
            <div className="h-[4.5rem]">
                <Avatar className="w-[7.5rem] h-[7.5rem] absolute top-28 left-5 border-[9px] border-[--background]">
                        <AvatarImage src={src ?? undefined} />
                        <AvatarFallback className='uppercase select-none text-base'>{userChar.charAt(0)}{userChar.charAt(userChar.length - 1)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="px-5 flex flex-col">
                <div className="flex flex-col w-full h-full">
                    <h1 className="text-2xl leading-6 font-semibold">{userName ? userName : 'Loading...'}</h1>
                    <h2 className={clsx("text-md leading-6 py-1", statusClass)}>{userStatus}</h2>
                    <p></p>
                </div>
            </div>
        </div>
    )
}