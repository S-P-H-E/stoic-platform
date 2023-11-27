"use client"

import { db } from '@/utils/firebase';
import {  collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import type {Timestamp} from 'firebase/firestore'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UserImagePassable from '../UserImagePassable';
import clsx from 'clsx';
import { HiTrash } from 'react-icons/hi2';
import { RiReplyFill } from 'react-icons/ri';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FaPen } from 'react-icons/fa';
import { IoIosSave } from 'react-icons/io';

interface Message {
  userProfilePic: any;
  userBannerPic: any;
  userName: any;
  userStatus: any;
  id: string;
  message: string
  timestamp: Timestamp
  userId: string
  sameUser: boolean
}

interface Member {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  bannerUrl: string;
  status: string;
  canMessage: boolean;
  canReadMessages: boolean;
}

export default function Chat({channelId, members, canFetch, readPermission, userId, userStatus}: {channelId: string | string[], members: Member[], canFetch: boolean, readPermission: boolean, userId: string | null, userStatus: string | undefined}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editedMessage, setEditedMessage] = useState<{ id: string; message: string } | null>(null);
  const chatContainerRef = useRef<HTMLUListElement | null>(null);
  const editedMessageRef = useRef<HTMLLIElement | null>(null); // Ref for the edited message

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom when editedMessage changes
    if (editedMessageRef.current && chatContainerRef.current) {
      editedMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [editedMessage]);

  const detectAndStyleLinks = (comment: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = comment.match(urlRegex);

    if (!matches) {
      return comment;
    }

    let styledComment = comment;

    matches.forEach((match) => {
      styledComment = styledComment.replace(
        match,
        `<a href="${match}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${match}</a>`
      );
    });

    return styledComment;
  };

  const MessageTimestamp = ({ createdAt }: { createdAt: Date }) => {
    const commentDate = new Date(createdAt);
    const currentDate = new Date();

    // Check if the comment was made today
    const isToday = commentDate.toDateString() === currentDate.toDateString();

    // Format date & time
    const formattedDate = commentDate.toLocaleDateString();
    const formattedTime = commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <p className="text-xs opacity-50">
        {isToday ? 'Today at ' + formattedTime : formattedDate}
      </p>
    );
  };

    useEffect(() => {
      const fetchMessages = async () => {
        if(userStatus == 'admin' || 'premium') {
        try {
          const messagesRef = collection(db, 'channels', channelId as string, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'asc'));
          const unsubscribe = onSnapshot(q, async (snapshot) => {

            const messageData = await Promise.all(snapshot.docs.map(async (doc) => {
            const messageData = doc.data();

            const userProfileData = members.find((member) => member.id === messageData.userId);
            return {
                id: doc.id,
                message: messageData.message,
                timestamp: messageData.timestamp,
                userId: messageData.userId,
                userProfilePic: userProfileData?.photoUrl || '',
                userBannerPic: userProfileData?.bannerUrl || '',
                userName: userProfileData?.name || '',
                userStatus: userProfileData?.status || '',
              };
            }));
    
            const updatedMessages = messageData.map((message, index, array) => {
              if (index === 0 || message.userId !== array[index - 1]?.userId) {
                return {
                  ...message,
                  sameUser: false,
                };
              } else {
                return {
                  ...message,
                  sameUser: true,
                };
              }
            });
    
            setMessages(updatedMessages);
          });
    
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
        }
      };
    
      if (channelId && canFetch && readPermission) {
        fetchMessages();
      }
    }, [channelId, members, canFetch, readPermission, userStatus]);
    
    const deleteMessage = async (messageId: string, messageUserId: string) => {
      try {
        if (userId === messageUserId || userStatus === 'admin') {
          const messageRef = doc(db, 'channels', channelId as string, 'messages', messageId);
          await deleteDoc(messageRef);
        } else {
          console.log("Unauthorized. (unlucky)")
        }

      } catch (error) {
        console.error('Error deleting message:', error);
      }
    };

    const editMessage = async (messageId: string, messageUserId: string) => {
      try {
        if (userId === messageUserId || userStatus === 'admin') {
          setEditedMessage({ id: messageId, message: messages.find((msg) => msg.id === messageId)?.message || '' });
        } else {
          console.log('Unauthorized. (unlucky)');
        }
      } catch (error) {
        console.error('Error editing message:', error);
      }
    };
  
    const saveEditedMessage = async () => {
      try {
        if (editedMessage) {
          const messageRef = doc(db, 'channels', channelId as string, 'messages', editedMessage.id);
          await updateDoc(messageRef, { message: editedMessage.message, edited: true });
  
          // Clear the edited message state after saving
          setEditedMessage(null);
        }
      } catch (error) {
        console.error('Error saving edited message:', error);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEditedMessage();
      }
    };

    return (
      <ul ref={chatContainerRef} className='flex flex-col h-full justify-end overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800 p-3'>
        {messages.map((message) => (
          <li 
          key={message.id} 
          className={clsx('relative group flex gap-2 items-center py-0.5 px-2 hover:bg-white/5 rounded-lg transition duration-200', message.sameUser ? 'mt-0' : 'mt-4')}
          ref={(ref) => {
            if (editedMessage && message.id === editedMessage.id) {
              editedMessageRef.current = ref;
            }
          }}
          >
            {!message.sameUser && (
              <div className="flex gap-2">
                <div className="w-12 h-12">
                  <UserImagePassable userBannerUrl={message.userBannerPic} userImage={message.userProfilePic} userName={message.userName} userStatus={message.userStatus}/>
                </div>
              </div>
            )}
            <div className="flex flex-col w-full">
                {!message.sameUser && (
                  <div className="flex gap-2 items-center">
                    <h1 className="text-lg font-medium">{message.userName}</h1>
                    <MessageTimestamp createdAt={message.timestamp.toDate()} />
                  </div>
                )}
                {editedMessage?.id !== message.id &&
                  <h1
                    className={clsx('animate-pop flex flex-wrap break-all', message.sameUser && 'ml-14 ')}
                    dangerouslySetInnerHTML={{
                    __html: detectAndStyleLinks(message.message), // Adjust the maxLength as needed
                    }}
                  />
                }

                {editedMessage?.id === message.id && (
                  <div className={clsx("animate-pop flex gap-2 py-1", message.sameUser && 'ml-14 ')}>
                    <input
                      type="text"
                      value={editedMessage.message}
                      onChange={(e) => setEditedMessage({ ...editedMessage, message: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full border-[--border] border px-4 py-2 bg-[--darkgray] rounded-lg outline-none hover:bg-[--border] transition duration-200"
                    />
                    <button onClick={saveEditedMessage} className="bg-white hover:bg-white/80 text-black px-4 py-2 rounded-md flex gap-2 items-center transition duration-200"><IoIosSave size={20}/>Save</button>
                  </div>
                )}
            </div>
            <div className="absolute -top-10 right-2 bg-[--border] rounded-xl p-1 flex gap-1 items-center opacity-0 group-hover:scale-y-100 scale-y-50 scale-x-[.8] group-hover:scale-x-100 group-hover:opacity-100 transition duration-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="hover:bg-[--highlight] h-full p-2 rounded-lg transition duration-200"><RiReplyFill/></TooltipTrigger>
                    <TooltipContent className="bg-[--border] border-[--highlight]">
                      <p>Reply</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger onClick={() => editMessage(message.id, message.userId)} className="hover:bg-[--highlight] h-full p-2 rounded-lg transition duration-200"><FaPen/></TooltipTrigger>
                    <TooltipContent className="bg-[--border] border-[--highlight]">
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  { (userId === message.userId || userStatus === 'admin') && 
                    <Tooltip>
                      <TooltipTrigger onClick={() => deleteMessage(message.id, message.userId)} className="hover:bg-red-500 h-full p-2 rounded-lg transition duration-200"><HiTrash/></TooltipTrigger>
                      <TooltipContent className="bg-[--border] border-[--highlight]">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  }

                </TooltipProvider>

            </div>
          </li>
        ))}
      </ul>
  )
}
