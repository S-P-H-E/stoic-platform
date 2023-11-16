"use client"

import { db } from '@/utils/firebase';
import {  collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import type {Timestamp} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import UserImagePassable from '../UserImagePassable';

interface Message {
  userProfilePic: any;
  userBannerPic: any;
  userName: any;
  userStatus: any;
  id: string;
  message: string
  timestamp: Timestamp
  userId: string
}

export default function Chat({channelId}: {channelId: string | string[]}) {
  const [messages, setMessages] = useState<Message[]>([]); // fix the type later

    const getUserProfileData = async (userId: string) => {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            return {
              photoUrl: userData.photoUrl,
              bannerUrl: userData.bannerUrl,
              userName: userData.name,
              userStatus: userData.status
            };
          }
        } catch (error) {
          console.error('Error fetching user profile data:', error);
        }
        return {
          photoUrl: null, // Return a default profile image URL or handle missing images here
          bannerUrl: null, // Return a default banner URL or handle missing banners here
        };
    };

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const messagesRef = collection(db, 'channels', channelId as string, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'asc'));
          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const messageData = await Promise.all(snapshot.docs.map(async (doc) => {
              const messageData = doc.data();
              const userProfileData = await getUserProfileData(messageData.userId);
              return {
                id: doc.id,
                ...messageData,
                userProfilePic: userProfileData.photoUrl || '',
                userBannerPic: userProfileData.bannerUrl || '',
                userName: userProfileData.userName || '',
                userStatus: userProfileData.userStatus || '',
                message: messageData.message,
                timestamp: messageData.timestamp,
                userId: messageData.userId
              };
            }));

            setMessages(messageData);
          });
      
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      if (channelId) {
        fetchMessages();
      }
    }, [channelId]);

  return (
    <div>
      <ul className='flex flex-col gap-2'>
      {messages.map((message) => (
        <li
        key={message.id}
        className='flex gap-2 items-center'
        >
          <div className="w-10 h-10">
          <UserImagePassable userBannerUrl={message.userBannerPic} userImage={message.userProfilePic} userName={message.userName} userStatus={message.userStatus}/>
          </div>
          {message.message}
        </li>
      ))}
      </ul>
    </div>
  )
}
