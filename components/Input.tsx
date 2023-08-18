import React, { ReactElement } from 'react';
import type { IconType } from 'react-icons';

interface InputProps {
    placeholder: string;
    className?: string;
    type: string;
    icon?: ReactElement<IconType>;
  }

  const Input: React.FC<InputProps> = ({ placeholder, className, type, icon }) => {
    return (
      <div className='border border-[--border] p-2 rounded-lg w-full'>
        <input type={type} className={`bg-transparent  items-center focus:border-white-60 w-full placeholder:text-[--highlight] ${className}`}
          placeholder={placeholder} />
        <button >
          {icon}
        </button>
      </div>
        
    );
  };
  
  export default Input;
