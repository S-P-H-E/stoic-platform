import React, { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NewInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
}

export default function NewTextArea({className, id, label, ...props}: NewInputProps) {
  return (
    <div className={clsx("bg-darkgray rounded-lg w-full min-w-0 flex", className)}>
        <div className="relative bg-inherit w-full">
            <textarea {...props} id={id || 'textarea'} className="disabled:opacity-50 disabled:cursor-not-allowed placeholder-transparent focus:placeholder-muted-foreground peer bg-transparent h-16 pt-2 resize-none w-full rounded-lg text-gray-200  ring-2 px-2 ring-highlight focus:ring-sky-600 focus:outline-none focus:border-rose-600"/>
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
