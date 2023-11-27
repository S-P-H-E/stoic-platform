"use client"

import { auth, db } from '@/utils/firebase';
import clsx from 'clsx';
import { Timestamp, addDoc, collection} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'


export default function Chatbox({ userName, userStatus, userId, channelId, messagePermission, currentChannelName}: { userName: string | undefined, userStatus:string | undefined, userId: string | null, channelId: string | string[], messagePermission: boolean, currentChannelName: string | undefined}) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [newMessage, setNewMessage] = useState('');

/*  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const [isTyping, setIsTyping] = useState(false)
 */

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
      if(userStatus !== 'user' && messagePermission) {
        e.preventDefault();
  
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.overflowY = 'hidden';
        }

        sendMessageToFirestore()
        
      } else {
        console.log('Encountered an issue with the user, please try again')
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
        e.preventDefault(); // Prevent a new line in the textarea
        handleFormSubmit(e as any);
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

  return (
    <>
        <form className="flex gap-2 w-full justify-end items-end mt-auto" onSubmit={handleFormSubmit}>
            <div className="flex border border-[--border] items-center w-full rounded-md bg-[--bg]">
              <textarea
                ref={textareaRef}
                className={clsx('flex rounded-md p-4 w-full outline-none resize-none max-h-[200px] bg-transparent scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-600', !messagePermission && 'cursor-not-allowed')}
                value={newMessage}
                disabled={!messagePermission || false}
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
        </form>
    </>
  )
}
