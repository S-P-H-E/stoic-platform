import clsx from "clsx";

export default function UserProfileDialog({src, userName, userStatus, userBannerUrl}: {src: string, userName: string, userStatus: string, userBannerUrl: string}){
    return(
        <div className="rounded-2xl ">
            <img className="rounded-2xl" src={userBannerUrl} />
            <img src={src} className="rounded-full aspect-square w-[130px] absolute left-4 top-[150px] border-[9px] border-[black]"/>
            <div className="mt-20 px-8">
                <div className="flex flex-col w-full h-full">
                    <h1 className="text-2xl leading-6 font-semibold">{userName ? userName : 'Loading...'}</h1>
                    <h2 className={clsx("text-md leading-6 py-1")}>{userStatus}</h2>
                    <p></p>
                </div>
            </div>
        </div>
    )
}