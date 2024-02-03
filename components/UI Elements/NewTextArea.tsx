import React, { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NewInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  black?: boolean;
  customHeight?: string;
  resize?: boolean;
  customWidth?: string;
}

export default function NewTextArea({customHeight, customWidth, resize, className, id, label, black, ...props}: NewInputProps) {
  return (
    <div className={clsx("rounded-lg min-w-0 flex", className, black ? 'bg-bg' : 'bg-darkgray', customWidth ? customWidth : 'w-full')}>
        <div className="relative bg-inherit w-full">
            <textarea {...props} id={id || 'textarea'} className={clsx("disabled:opacity-50 disabled:cursor-not-allowed placeholder-transparent focus:placeholder-muted-foreground peer bg-transparent pt-2 w-full rounded-lg text-gray-200  ring-2 px-2 ring-highlight focus:ring-sky-600 focus:outline-none focus:border-rose-600", customHeight ? customHeight : 'h-16', !resize && 'resize-none')}/>
             <label htmlFor={id || 'textarea'} className="absolute cursor-text left-0 -top-3 text-sm text-muted-foreground bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">
              {label ? label : "Type inside me"}
            </label>
        </div>
        <style jsx>{`
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover, 
          textarea:-webkit-autofill:focus, 
          textarea:-webkit-autofill:active {
          box-shadow:
            0 0 0 2px #0ea5e9,   /* White "ring" */
            0 0 0 30px var(--darkgray) inset;  /* Dark gray background for autofill */
          color: #0ea5e9 !important;
          -webkit-text-fill-color: #fff;
          caret-color: #fff !important
          border-radius: 8px;  /* Adjust the border-radius as needed */
            }
        `}
        </style>
    </div>
  )
}
