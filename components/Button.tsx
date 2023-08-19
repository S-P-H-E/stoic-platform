import { FC } from 'react'
import React, { ReactElement } from 'react';
import type { IconType } from 'react-icons';

interface ButtonProps {
  title: string;
  // onclick: () => void;
  onclick: any;
  icon: ReactElement<IconType>;
  style: string;
}

const Button: FC<ButtonProps> = ({title, onclick, icon, style}) => {
  return (
    <button onClick={onclick} className={`flex justify-center items-center gap-1 w-full text-center p-2 px-6 rounded-lg border border-[--border] hover:bg-[--border] transition ${style}`}>
        {icon}
        {title}
    </button>
  )
}

export default Button