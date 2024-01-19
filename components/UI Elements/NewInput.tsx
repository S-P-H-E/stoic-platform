import React, { InputHTMLAttributes } from 'react'

interface NewInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
}

export default function NewInput({id, label, ...props}: NewInputProps) {
  return (
    <div className="bg-darkgray rounded-lg w-full min-w-0 flex">
        <div className="relative bg-inherit w-full">
            <input {...props} id={id || 'input'} className="disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-transparent focus:placeholder-muted-foreground peer bg-transparent h-10 w-full rounded-lg text-gray-200  ring-2 px-2 ring-highlight focus:ring-sky-600 focus:outline-none focus:border-rose-600"/>
             <label htmlFor={id || 'input'} className="absolute cursor-text left-0 -top-3 text-sm text-muted-foreground bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">
              {label ? label : "Type inside me"}
            </label>
        </div>
        <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          box-shadow:
            0 0 0 2px #0ea5e9,   /* Blue "ring" */
            0 0 0 30px var(--darkgray) inset;  /* Dark gray background for autofill */
          -webkit-text-fill-color: #fff;
          caret-color: #fff !important
          border-radius: 8px;  /* Adjust the border-radius as needed */
  }
`}</style>
    </div>
  )
}
