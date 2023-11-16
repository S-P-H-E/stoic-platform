"use client"

import { auth, db } from '@/utils/firebase';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'

export default function Chatbox({userStatus, userId, channelId}: {userStatus:string | undefined, userId: string | null, channelId: string | string[]}) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [newMessage, setNewMessage] = useState('');

    const sendMessageToFirestore = async () => {
        try {
        const user = auth.currentUser;
        if (!user) {
            console.error('User not logged in');
            return;
        }
      
        const messagesRef = collection(db, 'channels', channelId as string, 'messages');
        await addDoc(messagesRef, {
            message: newMessage,
            timestamp: Timestamp.fromDate(new Date()),
            userId: userId,
        });
      
        setNewMessage('');
        } catch (error) {
        console.error('Error adding comment:', error);
        }
    }

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
      if(userStatus !== 'user') {
        e.preventDefault();
  
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.overflowY = 'hidden';
        }

        sendMessageToFirestore()
        
      } else {
        /* message.error('Encountered an issue with the user, please try again') */
      }
  
    };
  
    const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent a new line in the textarea
        handleFormSubmit(e as any);
      }
    };

  return (
    <>
        <form className="flex gap-2 w-full justify-end items-end mt-auto" onSubmit={handleFormSubmit}>
            <div className="flex border border-[--border] items-center w-full rounded-md">
              <textarea
                ref={textareaRef}
                className="flex rounded-md p-4 w-full outline-none resize-none max-h-[200px] bg-transparent scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600"
                onKeyDown={handleTextareaKeyPress}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
    </>
  )
}
