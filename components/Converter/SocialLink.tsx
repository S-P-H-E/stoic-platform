import Link from 'next/link';
import React, { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

interface SocialProps {
  link: string;
  icon?: IconType;
  children?: ReactNode; // Allow passing children
  iconSize?: number
}

export default function SocialLink({ link, icon: Icon, children, iconSize }: SocialProps) {
  return (
    <Link href={link} className='w-20 h-20 outline-none flex items-center justify-center p-6 rounded-xl border-border border cursor-pointer transition hover:bg-border hover:ring-offset-2 ring-offset-bg duration-200 hover:ring-2 ring-border'>
      { Icon ?   
            <Icon size={iconSize} />
      : null
      }
      {children} {/* Render any additional content */}
    </Link>
  );
}