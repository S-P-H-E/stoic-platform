import { FC, ReactNode } from 'react';
import React, { ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx'; // Import the clsx library

interface ButtonProps {
  onClick?: () => void;
  className?: string; // Allow passing additional classes
  children?: ReactNode; // Allow passing children
}

const Button: FC<ButtonProps> = ({ onClick, className, children }) => {
  const buttonClasses = clsx(
    'flex justify-center items-center gap-1 w-full text-center p-2 px-6 rounded-lg border border-[--border] hover:bg-[--border] transition',
    className // Use the additional classes
  );

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children} {/* Render children */}
    </button>
  );
};

export default Button;