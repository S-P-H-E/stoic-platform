"use client"

import { auth, db } from '@/utils/firebase';
import clsx from 'clsx';
import { Timestamp, addDoc, collection} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { z } from 'zod';


export default function Chatbox({ userName, userStatus, userId, channelId, messagePermission, currentChannelName}: { userName: string | undefined, userStatus:string | undefined, userId: string | null, channelId: string | string[], messagePermission: boolean, currentChannelName: string | undefined}) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
    const [currentLimit, setCurrentLimit] = useState<number>(2); // Initial message limit in seconds
    const [isRateLimitedBefore, setIsRateLimitedBefore] = useState(false);
    const [loading, setLoading] = useState(false);

    const messageLimit = 10; // Adjust the limit as needed

    const [newMessage, setNewMessage] = useState('');
    
    const sendMessageToFirestore = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not logged in');
          return;
        } else if (isRateLimited()) {
          console.error('Message rate limit exceeded');
          return;
        }
    
        setIsRateLimitedBefore(false);
    
        const trimmedMessage = newMessage.trim(); // Remove leading and trailing spaces
    
        // Check if the trimmed message is empty
        if (!trimmedMessage) {
          console.error('Message cannot be just a space');
          return;
        }
    
        const messagesRef = collection(db, 'channels', channelId as string, 'messages');
        await addDoc(messagesRef, {
          message: trimmedMessage,
          timestamp: Timestamp.fromDate(new Date()),
          userId: userId,
        });
    
        setNewMessage('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const isRateLimited = () => {
      const now = Date.now();
  
      if (isRateLimitedBefore) {
        console.error('Message rate limit exceeded');
        return true;
      }
  
      const recentMessages = messageTimestamps.filter((timestamp) => now - timestamp < currentLimit * 1000);
  
      if (recentMessages.length >= messageLimit) {
        setCurrentLimit(currentLimit + 2);
  
        setTimeout(() => {
          setIsRateLimitedBefore(false);
        }, currentLimit * 1000);
  
        setIsRateLimitedBefore(true);
        return true;
      }
  
      return false;
    };
  
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
  
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (userStatus !== 'user' && messagePermission) {
        e.preventDefault();
        setLoading(true)
    
        try {
          messageSchema.parse(newMessage); // Validate the message using Zod schema
        } catch (error: any) {
          const errorMessage = error.errors[0]?.message; // Access the "message" property
          /* message.error(`Validation error: ${errorMessage}`); */
          return; // Do not send the message if validation fails
        } finally {
          setLoading(false)
        }
    
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.overflowY = 'hidden';
        }
        
        setMessageTimestamps([...messageTimestamps, Date.now()]);
        sendMessageToFirestore();
      } else {
        console.log('Encountered an issue with the user, please try again');
      }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
/*       setIsTyping(e.target.value !== '');

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
  
      setTypingTimeout(
        setTimeout(() => {
          setIsTyping(false);
        }, 10000)
      );

      updateTypingStatus(true) */
    };
  
    const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        try {
          setLoading(true)
          e.preventDefault(); // Prevent a new line in the textarea
          handleFormSubmit(e as any);
        } catch(error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      } /* else {
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
  
        setTypingTimeout(
          setTimeout(() => {
            setIsTyping(false);
          }, 10000)
        );
      } */
    };

/*     const updateTypingStatus = useCallback(
      async (isTyping: boolean) => {
        try {
          const channelRef = doc(db, 'channels', channelId as string);
          await updateDoc(channelRef, {
            activeTyping: isTyping
              ? arrayUnion(userName)
              : arrayRemove(userName),
          });
        } catch (error) {
          console.error('Error updating typing status:', error);
        }
      },
      [userName, channelId]
    );
    
    useEffect(() => {
      // Cleanup function to remove user from typing list when component unmounts
      return () => {
        if (userName) {
          updateTypingStatus(false);
        }
      };
    }, [userName, channelId, updateTypingStatus]); */
  
    const messageSchema = z.string().min(1, 'Message must be at least 1 character').max(1000, 'Message must be at most 1000 characters');

  return (
    <>
      {isRateLimitedBefore && (
        <div className="text-red-500">You are currently rate-limited. Please wait before sending another message. {}</div>
      )}
        <form className="relative flex gap-2 w-full justify-end items-end mt-auto" onSubmit={handleFormSubmit}>
            <div className={clsx("flex border border-[--border] items-center w-full rounded-md bg-[--bg]", loading && 'cursor-not-allowed opacity-50')}>
              <textarea
                ref={textareaRef}
                className={clsx('flex rounded-md p-4 w-full outline-none resize-none max-h-[200px] bg-transparent scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600', !messagePermission && 'cursor-not-allowed', loading && 'cursor-not-allowed opacity-50')}
                value={newMessage}
                disabled={!messagePermission || loading || false}
                onKeyDown={handleTextareaKeyPress}
                onChange={handleTextareaChange}
                placeholder={messagePermission ? `Message ${currentChannelName}` : 'You are not allowed to send messages.'}
                rows={1}
              />
              {/* <p>{isTyping ? 'Typing...' : null}</p> */}
              <button
                className="p-4 rounded-full"
                type="submit"
              >
                <IoSend />
              </button>
            </div>
            {newMessage.length > 850 &&
            <div className="absolute bottom-2 right-16">
              <p className={clsx('border-[--border] border bg-[--bg] px-2 py-1 rounded-xl', (newMessage.length) > 1000 && 'text-red-500 border-red-600/50')}>{newMessage.length}</p>
            </div>
            }
        </form>
    </>
  )
}
