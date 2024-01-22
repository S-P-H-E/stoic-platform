'use client';

import UserImage from '@/components/UserImage';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { message } from 'antd';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import Image from 'next/image';
import StoicAIPicture from '@/public/stoicWhite.webp'

export default function StoicAIComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [userMessage, setUserMessage] = useState<string>(''); // State to store the user's typed message

  const { userStatus, user } = UserDataFetcher();

  useEffect(() => {
    const adjustRows = () => {
      if (textareaRef.current) {
        const currentTextarea = textareaRef.current;

        currentTextarea.style.height = 'auto'; // Reset the height
        currentTextarea.style.height = currentTextarea.scrollHeight + 'px';
        if (currentTextarea.scrollHeight >= 200) {
          currentTextarea.style.overflowY = 'auto'; // Add a scrollbar when the height is at least 200px
        } else {
          currentTextarea.style.overflowY = 'hidden'; // Remove the scrollbar when the height is less than 200px
        }
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener('input', adjustRows);
      adjustRows();
    }
  }, []);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if(user && userStatus !== 'user') {
      e.preventDefault();

      handleSubmit(e);

      console.log(input)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.overflowY = 'hidden';
      }
    } else {
      message.error('Encountered an issue with the user, please try again')
    }

  };

  const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent a new line in the textarea
      handleFormSubmit(e as any);
    }
  };

  return (
    <main className="w-full h-full flex flex-col items-center justify-end">
      <div className="w-full h-screen flex flex-col items-center justify-end p-12">
      {/* <div className="flex items-center justify-center w-full h-full font-medium text-5xl opacity-60">STOIC AI</div> */}
      <div className='w-full flex flex-col'>
        <section className="flex flex-col gap-2">
          {messages.map(m => (
            <div className="mb-4 flex gap-2 items-center" key={m.id}>
              {m.role === 'user' ? 

              <div className="w-8 h-8">
                <UserImage/>
              </div> 
              : 
                <Image alt='Stoic AI Icon' src={StoicAIPicture} placeholder='blur' className='h-8 w-6'/>
              }

              <h2>{m.content}</h2>

            </div>
          ))}
        </section>
        <form className="flex gap-2 w-full" onSubmit={handleFormSubmit}>
        <div className="flex border border-border items-center w-full rounded-md">
          <textarea
            ref={textareaRef}
            className="flex rounded-md p-4 w-full outline-none resize-none max-h-[200px] bg-transparent hover:scrollbar-thumb-neutral-900 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleTextareaKeyPress} // Handle Enter key press
            placeholder="Say something..."
            rows={1}
          />
          <button
            className="p-4 rounded-full"
            type="submit"
          >
            <IoSend />
          </button>
        </div>
        </form>
      </div>
      </div>
    </main>
  );
}