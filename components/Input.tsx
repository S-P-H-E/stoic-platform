"use client"

import React, { ReactElement, useState } from 'react';
import type { IconType } from 'react-icons';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'


interface InputProps {
    placeholder: string;
    className?: string;
    type: string;
    eye: boolean;
  }

  const Input: React.FC<InputProps> = ({ placeholder, className, type, eye }) => {
    const [toggle, setToggle] = useState(true)

    const toggleVisibility = () => {
      setToggle(prevToggle => !prevToggle); // Toggle the state when the button is clicked
    };

    const inputType = toggle ? type : 'text';

    return (
      <div className='flex border border-[--border] p-2 rounded-lg w-full'>
        <input type={inputType} className={`bg-transparent items-center focus:border-white-60 w-full placeholder:text-[--highlight] outline-none ${className}`}
          placeholder={placeholder} />

        {eye ? (
          <button onClick={toggleVisibility} className='text-[--highlight] hover:text-white transition'>
            {toggle ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
          </button>
        ) : (
          <></>
        )}
      </div>
        
    );
  };
  
  export default Input;
