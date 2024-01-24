import React, { ReactNode } from 'react';
import { ButtonShad } from '@/components/ui/buttonshad';
import clsx from 'clsx';
import { BsArrowRight } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import ClothTexture from '@/public/cloth.jpg'
import { FaBook } from "react-icons/fa";

interface AdminCardProps {
  title: string;
  description: string;
  href?: string;
  gradient?: boolean;
  gradient2?: boolean;
  children?: ReactNode;
  linkMsg?: string;
  icon?: ReactNode
}

export default function AdminCard({
  title,
  description,
  href,
  gradient,
  gradient2,
  children,
  linkMsg,
  icon
}: AdminCardProps) {

  return (
    <div className="w-full h-full relative group">
      <div
        className={clsx(
          'border h-full w-full border-border group-hover:border-highlight transition duration-300 relative group overflow-hidden rounded-xl flex flex-col gap-2 items-start justify-center p-10',
          gradient
            ? 'bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'
            : gradient2
            ? 'bg-gradient-to-br from-red-300/60 to-black'
            : 'bg-gradient-to-r from-blue-700/70 via-blue-600/30 to-gray-900'
        )}
      >
        <div className="flex items-center gap-2 text-white z-10">
          {icon}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <p className="text-light opacity-60 font-sm mt-2 z-10">{description}</p>
        {children}
        {href && (
          <Link href={href} className="z-10">
            <ButtonShad variant="secondary" className="active:scale-90 transition gap-2 group">
              {linkMsg ? linkMsg : 'Take me there'}
              <BsArrowRight />
            </ButtonShad>
          </Link>
        )}

        <Image src={ClothTexture} fill placeholder='blur' className='object-cover opacity-40 group-hover:opacity-90 group-hover:scale-110 transition duration-500' quality={95} alt="Cloth"/>
        <div className="w-3/4 absolute -bottom-10 h-24 bg-white left-[12%] rounded-full opacity-0 group-hover:opacity-80 mt-4 blur-[80px] transition duration-500" />
      </div>
      <div className="w-full h-full absolute inset-0 shadow-[0_0px_75px_rgba(49,_76,_80,_0.65)] rounded-xl opacity-0 group-hover:opacity-100 transition duration-500"/>
    </div>
  );
}
