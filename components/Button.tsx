import { FC, ReactNode } from 'react';
import React, { ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx'; // Import the clsx library

interface ButtonProps {
  onClick?: () => void;
  className?: string; // Allow passing additional classes
  children?: ReactNode; // Allow passing children
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ onClick, className, children, disabled }) => {
  const buttonClasses = clsx(
    'flex justify-center items-center gap-1 w-full text-center p-2 px-6 rounded-lg border border-[--border] hover:bg-[--border] transition hover:ring-offset-2 ring-offset-black hover:ring ring-white/10',
    className // Use the additional classes
  );

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children} {/* Render children */}
    </button>
  );
};

export default Button;