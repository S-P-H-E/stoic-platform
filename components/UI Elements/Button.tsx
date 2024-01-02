import { FC, ReactNode } from 'react';
import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"
}

const Button: FC<ButtonProps> = ({ onClick, className, children, disabled, type }) => {
  const normalButtonClasses = clsx(
    'disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-1 w-full text-center p-2 px-6 rounded-lg ring-offset-[--bg] border ring-white/10 border-[--border] transition',
    className
  );

  // Define separate class names for the hover state
  const hoverButtonClasses = clsx(
    'hover:bg-[--border] hover:ring-offset-2 hover:ring',
    !disabled && 'cursor-pointer' // Only apply hover styles if not disabled
  );

  return (
    <button
      onClick={onClick}
      className={clsx(normalButtonClasses, !disabled && hoverButtonClasses)} // Conditionally apply hover styles
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
