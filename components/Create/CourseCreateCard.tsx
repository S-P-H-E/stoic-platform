import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'

export default function CourseCreateCard({loop, invert, type, src, icon, title, description}: {loop?: boolean, invert?: boolean, src: any, type: "public" | "locked", icon: React.ReactNode, title: string, description: string}) {
  return (
    <Link href={`/create/course?&type=${type}`} className="w-full md:h-[28rem] 2xl:h-[32rem] pb-8">
        <div className="w-full h-full relative group">
            <div className="flex flex-col items-center group-hover:shadow-[0_0px_65px_rgba(49,_76,_80,_0.55)] active:scale-95 overflow-hidden rounded-lg border border-border group-hover:border-highlight transition duration-300 w-full h-full">
              <div className="group-hover:bg-darkgray transition duration-300 border-b border-border w-full h-full flex items-center justify-center relative">
                <Lottie loop={loop ? true : false}className={clsx("group-hover:scale-110 transition duration-300 h-60 md:h-44 2xl:h-52", invert && 'invert')} animationData={src}/>
              </div>
              <div className="gap-4 flex bg-darkgray group-hover:bg-border/60 transition duration-300 flex-col justify-center items-center p-8 pb-16 ">
                {icon}
                <div className="flex flex-col gap-1 text-center">
                  <h1 className="text-2xl 2xl:text-3xl font-semibold">{title}</h1>
                  <p className="md:text-base 2xl:text-xl text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
        </div>
    </Link>
  )
}
