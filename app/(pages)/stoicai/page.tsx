'use client';

import UserImage from '@/components/UserImage';
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    e.preventDefault();

    handleSubmit(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  };

  const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent a new line in the textarea
      handleFormSubmit(e as any);
    }
  };

  return (
    <main className="w-full h-screen p-12 flex flex-col items-center justify-end">
      {/* <div className="flex items-center justify-center w-full h-full font-medium text-5xl opacity-60">STOIC AI</div> */}
      <div className='max-w-[50rem] w-full flex flex-col'>
        <section className="flex flex-col gap-2">
          {messages.map(m => (
            <div className="mb-4 flex gap-2 items-center" key={m.id}>
              {m.role === 'user' ? 

              <div className="w-8 h-8">
                <UserImage/>
              </div> 

              : 'AI: '}

              <pre>{m.content}</pre>
            </div>
          ))}
        </section>
        <form className="flex gap-2 w-full" onSubmit={handleFormSubmit}>
        <div className="flex border border-[--border] items-center w-full rounded-md">
          <textarea
            ref={textareaRef}
            className="flex rounded-md p-4 w-full outline-none resize-none max-h-[200px] bg-transparent scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600"
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
    </main>
  );
}