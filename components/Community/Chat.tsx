"use client"

import { db } from '@/utils/firebase';
import {  collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import type {Timestamp} from 'firebase/firestore'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UserImagePassable from '../UserImagePassable';
import clsx from 'clsx';

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

export default function Chat({channelId, members, canFetch, readPermission}: {channelId: string | string[], members: Member[], canFetch: boolean, readPermission: boolean}) {
  const [messages, setMessages] = useState<Message[]>([]); // fix the type later
  const chatContainerRef = useRef<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


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
      };
    
      if (channelId && canFetch && readPermission) {
        fetchMessages();
      }
    }, [channelId, members, canFetch, readPermission]);
    return (
      <ul ref={chatContainerRef} className='mt-auto flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800 p-3'>
        {messages.map((message) => (
          <li key={message.id} className={clsx('flex gap-2 items-center', message.sameUser ? 'mt-0' : 'mt-4')}>
            {!message.sameUser && (
              <div className="flex gap-2">
                <div className="w-12 h-12">
                  <UserImagePassable userBannerUrl={message.userBannerPic} userImage={message.userProfilePic} userName={message.userName} userStatus={message.userStatus}/>
                </div>
              </div>
            )}
            <div className="flex flex-col">
              {!message.sameUser && (
                <div className="flex gap-2 items-center">
                  <h1 className="text-lg font-medium">{message.userName}</h1>
                  <MessageTimestamp createdAt={message.timestamp.toDate()} />
{/*                   <h1 className="text-sm font-light text-[--highlight]">{message.timestamp.toDate().toLocaleString()}</h1> */}
                </div>
              )}
              <h1
                className={clsx('flex flex-wrap break-all', message.sameUser && 'ml-14 ')}
                dangerouslySetInnerHTML={{
                  __html: detectAndStyleLinks(message.message), // Adjust the maxLength as needed
                }}
              ></h1>
            </div>
          </li>
        ))}
      </ul>
  )
}
