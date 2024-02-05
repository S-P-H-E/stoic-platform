'use client';

import * as React from 'react';

import { clsx } from 'clsx';
import ShowPassword from '../Auth/ShowPassword';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  eye?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ eye, className, type, ...props }, ref) => {
    const [inputFocused, setInputFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const handleInputFocus = () => {
      setInputFocused(true);
    };

    const handleInputBlur = () => {
      setInputFocused(false);
    };

    return (
      <div
        className={clsx(
          'h-10 border outline-none border-border px-3 py-2 flex rounded-md transition bg-black duration-200',
          inputFocused && 'border-blue-400 ring ring-blue-400/50'
        )}
      >
        <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          box-shadow:
            0 0 0 30px black inset;  /* Dark gray background for autofill */
          -webkit-text-fill-color: #fff;
          caret-color: #fff !important
          border-radius: 8px;  /* Adjust the border-radius as needed */
          }`}
        </style>
        <input
          type={eye ? (showPassword ? 'text' : 'password') : type}
          className={clsx(
            'flex w-full focus:outline-none outline-none text-sm file:border-0 file:bg-transparent bg-black text-white file:text-sm file:font-medium placeholder:text-muted-foreground' +
              ' disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        {eye && (
          <ShowPassword
            onClick={() => handleShowPassword()}
            showPassword={showPassword}
          />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
