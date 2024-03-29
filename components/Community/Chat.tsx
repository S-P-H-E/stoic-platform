'use client';

import { FaExclamationTriangle } from "react-icons/fa";
import { db } from '@/utils/firebase';
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import UserImagePassable from '../UserImagePassable';
import clsx from 'clsx';
import { HiTrash } from 'react-icons/hi2';
import { RiReplyFill } from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { FaPen } from 'react-icons/fa';
import { IoIosSave, IoIosCloseCircle } from 'react-icons/io';
import Chatbox from './Chatbox';
import { GoReply } from 'react-icons/go';
import {detectAndStyleLinks} from "@/utils/utils";

interface Message {
  userProfilePic: any;
  userBannerPic: any;
  userName: any;
  userDescription: any;
  userStatus: any;
  id: string;
  message: string;
  timestamp: Timestamp;
  userId: string;
  sameUser: boolean;
  userRoles: Role[] | 'User';
  repliedTo:String
}

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface Member {
  id: string;
  name: string;
  description: string;
  email: string;
  photoUrl: string;
  bannerUrl: string;
  status: string;
  canMessage: boolean;
  canReadMessages: boolean;
  roles: Role[] | 'User';
}
interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: {
    [key: string]: {
      canMessage: boolean;
      canSeeChannel: boolean;
      canSeeMessages: boolean;
      [key: string]: boolean; // additional dynamic permissions
    };
  };
  order: number;
}

export default function Chat({
  roles,
  currentChannel,
  currentUser,
  channelId,
  members,
  canFetch,
  readPermission,
  userId,
  userStatus,
  activity
}: {
  currentChannel: Channel | undefined;
  currentUser: Member | undefined;
  channelId: string | string[];
  members: Member[];
  canFetch: boolean;
  readPermission: boolean;
  userId: string | null;
  userStatus: string | undefined;
  roles: Role[];
  activity: string
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialMessagesCount, setInitialMessagesCount] = useState(20);
  const [totalMessages, setTotalMessages] = useState(0);
  const [moreMessagesAvailable, setMoreMessagesAvailable] = useState(true);
  
  const [editedMessage, setEditedMessage] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const [isReplying, setIsReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message>();
  const [prevRepliedMessage, setPrevRepliedMessage] = useState<
    Message | undefined
  >(undefined);

  const chatContainerRef = useRef<HTMLUListElement | null>(null);
  const editedMessageRef = useRef<HTMLLIElement | null>(null); // Ref for the edited message
  const repliedMessageRef = useRef<HTMLLIElement | null>(null); // Ref for the replied message

  const messageSoundRef = useRef<HTMLAudioElement | null>(null);

  const resetReplyingTo = () => {
    setIsReplying(false);
    setReplyingTo(undefined);
  };

  useEffect(() => {
/*    const audio = new Audio('/test.mp3');
    messageSoundRef.current = audio;*/

    // Clean up when the component unmounts
    return () => {
      if (messageSoundRef.current) {
        messageSoundRef.current.pause();
        messageSoundRef.current = null;
      }
    };
  }, []);


  useLayoutEffect(() => {
    if (activity === 'online') {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [activity, messages]);

  useEffect(() => {
    // Scroll to the bottom when editedMessage changes
    if (editedMessageRef.current && chatContainerRef.current) {
      editedMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }

    // Scroll to the replied message when replying
    if (repliedMessageRef.current && chatContainerRef.current && isReplying) {
      if (replyingTo !== prevRepliedMessage) {
        repliedMessageRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });

        setPrevRepliedMessage(replyingTo);
      }
    } else {
      // Reset prevRepliedMessage when not replying
      setPrevRepliedMessage(undefined);
    }
  }, [editedMessage, isReplying, replyingTo, prevRepliedMessage]);


  const test = members.find(member => member.id === 'hoj596WZZ55925csUnq0')?.name

  const MessageTimestamp = ({
    createdAt,
    noContext,
  }: {
    createdAt: Date;
    noContext: boolean;
  }) => {
    const commentDate = new Date(createdAt);
    const currentDate = new Date();

    // Check if the comment was made today
    const isToday = commentDate.toDateString() === currentDate.toDateString();

    // Format date & time
    const formattedDate = commentDate.toLocaleDateString();
    const formattedTime = commentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <p className="text-xs opacity-50">
        {isToday && !noContext
          ? 'Today at ' + formattedTime
          : noContext
          ? formattedTime
          : formattedDate}
      </p>
    );
  };

  useEffect(() => {
    const fetchMessages = async (messageLimit: number) => {
      if (userStatus == 'admin' || 'premium') {
        try {
          const messagesRef = collection(
            db,
            'channels',
            channelId as string,
            'messages'
          );

          const q = query(
            messagesRef,
            orderBy('timestamp', 'asc'),
            /* limit(messageLimit) */
          );

          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const messageData = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const messageData = doc.data();

                const userProfileData = members.find(
                  (member) => member.id === messageData.userId
                );
                return {
                  id: doc.id,
                  message: messageData.message,
                  timestamp: messageData.timestamp,
                  userId: messageData.userId,
                  repliedTo: messageData.repliedTo,
                  userProfilePic: userProfileData?.photoUrl || '',
                  userBannerPic: userProfileData?.bannerUrl || '',
                  userName: userProfileData?.name || '',
                  userDescription: userProfileData?.description || '',
                  userStatus: userProfileData?.status || '',
                  userRoles: userProfileData?.roles || 'User',
                };
              })
            );

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

            if (activity === 'offline' && updatedMessages.length > messages.length) {
              if (messageSoundRef.current) {
                messageSoundRef.current.play();
              }
            }

            setMessages(updatedMessages);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    if (channelId && canFetch && readPermission) {
      fetchMessages(initialMessagesCount);
    }

  }, [initialMessagesCount, channelId, members, canFetch, readPermission, userStatus, activity, messages.length]);

  const deleteMessage = async (messageId: string, messageUserId: string) => {
    try {
      if (userId === messageUserId || userStatus === 'admin') {
        const messageRef = doc(
          db,
          'channels',
          channelId as string,
          'messages',
          messageId
        );
        await deleteDoc(messageRef);
      } else {
        console.log('Unauthorized. (unlucky)');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const editMessage = async (messageId: string, messageUserId: string) => {
    try {
      if (userId === messageUserId) {
        setEditedMessage({
          id: messageId,
          message: messages.find((msg) => msg.id === messageId)?.message || '',
        });
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
        const messageRef = doc(
          db,
          'channels',
          channelId as string,
          'messages',
          editedMessage.id
        );
        await updateDoc(messageRef, {
          message: editedMessage.message,
          edited: true,
        });

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

  const handleReply = (message: Message) => {
    const isAtBottom =
      chatContainerRef.current &&
      chatContainerRef.current.scrollHeight -
        chatContainerRef.current.scrollTop ===
        chatContainerRef.current.clientHeight;

    setIsReplying(true);
    setReplyingTo(message);

    // Scroll to the bottom if the user was already at the bottom
    if (isAtBottom && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleCloseReply = () => {
    setIsReplying(false);
    setReplyingTo(undefined);
  };

  function getUserRoleColor(userRoles: Role[] | 'User'): string {
    if (userRoles === 'User' || userRoles.length === 0) {
      // Return a default color for users without roles
      return 'white';
    }
    // Find the role with the least order
    const leastOrderRole = userRoles.reduce(
      (minRole, currentRole) =>
        minRole.order < currentRole.order ? minRole : currentRole,
      userRoles[0]
    );

    return leastOrderRole.color;
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="sticky top-0 py-2 text-2xl font-medium flex justify-center items-center border-b border-border">
        <h1>
          {currentChannel
            ? currentChannel.name
            : 'Loading...'}
        </h1>
      </div>
      <ul
        ref={chatContainerRef}
        className="flex flex-col mt-auto overflow-x-hidden overflow-y-auto scrollbar-thin hover:scrollbar-thumb-neutral-900 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 scrollbar-track-neutral-800 p-3"
      >
        <>
        {!readPermission && currentChannel && (
          <div className="flex gap-1 justify-center items-center text-highlight">
            <FaExclamationTriangle/> 
            <h1>You are not allowed to read messages in {currentChannel.name}</h1>
          </div>
          )
        }
        
        {messages && messages.map((message) => (
          <div className={clsx("flex flex-col relative group py-0.5 px-2 hover:bg-white/5 rounded-lg transition duration-200", (message.sameUser && !message.repliedTo) ? 'mt-0' : 'mt-4 pt-1')} key={message.id}>
          {message.repliedTo && (
            <>
              {messages.map((msg) => {
              if (msg.id === message.repliedTo) {
                const repliedUser = members.find((member) => member.id === msg.userId);

                const userImagePassableProps = {
                  userId: repliedUser?.id ?? null,
                  roles: roles,
                  userRoles: repliedUser?.roles ?? 'User' as "User" | Role[], // Use type assertion
                  userBannerUrl: repliedUser?.bannerUrl || '',
                  userImage: repliedUser?.photoUrl || '',
                  userName: repliedUser?.name || '',
                  userStatus: repliedUser?.status || '',
                  userDescription: repliedUser?.description
                };

                return (
                  <div key={msg.id} className="flex items-center mb-2">
                    <div className="pl-4 flex gap-2 items-center opacity-80">
                    <GoReply className="scale-x-[-1]" />
                      {/* Replied to:{' '} */}
                      <div className="w-6 h-6">
                      <UserImagePassable {...userImagePassableProps} />
                      </div>
                      <span
                        className={clsx(
                          'font-medium',
                          repliedUser?.roles &&
                            repliedUser?.roles.length > 0 &&
                            repliedUser?.roles !== 'User' &&
                            repliedUser?.roles[0]?.color &&
                            `text-${getUserRoleColor(repliedUser.roles)}`
                        )}
                      >
                        <p>{repliedUser ? ` ${repliedUser.name}` : 'Unknown User'}{/* <span className="text-white font-base">:</span> */}</p>
                      </span>
                      <p className="line-clamp-1">{msg.message}</p>
                    </div>
                  </div>
                );
              }
          })}
          </>
          )}
          <li
            className='relative group flex gap-2 items-start'
            ref={(ref) => {
              if (editedMessage && message.id === editedMessage.id) {
                editedMessageRef.current = ref;
              }
              if (isReplying && replyingTo && message.id === replyingTo.id) {
                repliedMessageRef.current = ref;
              }
            }}
          >
            {(!message.sameUser || message.repliedTo) && (
              <div className="flex gap-2">
                <div className="w-12 h-12">
                  <UserImagePassable
                    userDescription={message.userDescription}
                    userId={message.userId}
                    roles={roles}
                    userRoles={message.userRoles}
                    userBannerUrl={message.userBannerPic}
                    userImage={message.userProfilePic}
                    userName={message.userName}
                    userStatus={message.userStatus}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col w-full">
              {(!message.sameUser || message.repliedTo) && (
                <div className="flex gap-2 items-center">
                  <h1 
                    className={clsx(
                      "text-lg font-medium",
                      message.userRoles &&
                      message.userRoles.length > 0 &&
                      message.userRoles !== "User" &&
                      `text-${getUserRoleColor(message.userRoles)}`
                    )}
                  >
                    {message.userName}
                  </h1>
                  <MessageTimestamp
                    noContext={false}
                    createdAt={message.timestamp.toDate()}
                  />
                </div>
              )}
              {editedMessage?.id !== message.id && (
                <div className="relative flex items-center">
                { (message.sameUser && !message.repliedTo) && (
                    <div className="absolute left-3 items-start justify-start flex opacity-0 group-hover:opacity-100 transition duration-200">
                      <MessageTimestamp
                        noContext={true}
                        createdAt={message.timestamp.toDate()}
                      />
                    </div>
                  )}
                  <h1
                    className={clsx(
                      'animate-pop flex flex-wrap break-all',
                      (message.sameUser && !message.repliedTo) && 'ml-14 '
                    )}
                    dangerouslySetInnerHTML={{
                      __html: detectAndStyleLinks(message.message)
                        .split('\n')
                        .map((line) => `${line}<br />`)
                        .join(''),
                    }}
                  />
                </div>
              )}

              {editedMessage?.id === message.id && (
                <div
                  className={clsx(
                    'animate-pop flex gap-2 py-1',
                    message.sameUser && !message.repliedTo && 'ml-14 '
                  )}
                >
                  <input
                    type="text"
                    value={editedMessage.message}
                    onChange={(e) =>
                      setEditedMessage({
                        ...editedMessage,
                        message: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    className="w-full border-border border px-4 py-2 bg-darkgray rounded-lg outline-none hover:bg-border transition duration-200"
                  />
                  <button
                    onClick={saveEditedMessage}
                    className="bg-white hover:bg-white/80 text-black px-4 py-2 rounded-md flex gap-2 items-center transition duration-200"
                  >
                    <IoIosSave size={20} />
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="absolute -top-10 right-2 bg-border rounded-xl p-1 flex gap-1 items-center opacity-0 group-hover:scale-y-100 scale-y-50 scale-x-[.8] group-hover:scale-x-100 group-hover:opacity-100 transition duration-300">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => handleReply(message)}
                    className="hover:bg-highlight h-full p-2 rounded-lg transition duration-200"
                  >
                    <RiReplyFill />
                  </TooltipTrigger>
                  <TooltipContent className="bg-border border-highlight">
                    <p>Reply</p>
                  </TooltipContent>
                </Tooltip>

                {userId === message.userId && (
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => editMessage(message.id, message.userId)}
                      className="hover:bg-highlight h-full p-2 rounded-lg transition duration-200"
                    >
                      <FaPen />
                    </TooltipTrigger>
                    <TooltipContent className="bg-border border-highlight">
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {(userId === message.userId || userStatus === 'admin') && (
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => deleteMessage(message.id, message.userId)}
                      className="hover:bg-red-500 h-full p-2 rounded-lg transition duration-200"
                    >
                      <HiTrash />
                    </TooltipTrigger>
                    <TooltipContent className="bg-border border-highlight">
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </li>
          </div>
        ))}
        </>
      </ul>
      <div className="sticky w-full p-2 bottom-0 flex flex-col gap-2">
        {isReplying && replyingTo ? (
          <span className="flex justify-between items-center">
            <div>
              Replying to{' '}
              <span
                className={clsx(
                  'font-medium',
                    replyingTo.userRoles &&
                    replyingTo.userRoles.length > 0 &&
                    replyingTo.userRoles != 'User' &&
                    replyingTo.userRoles[0]?.color &&
                    `text-${replyingTo.userRoles[0].color}`
                )}
              >
                {replyingTo.userName}
              </span>
            </div>
            <div className="px-4 flex gap-2">
              <button
                className="hover:text-red-500 transition"
                onClick={() => {
                  handleCloseReply();
                }}
              >
                <IoIosCloseCircle size={24} />
              </button>
            </div>
          </span>
        ) : null}
        <Chatbox
          userName={currentUser?.name}
          currentChannelName={currentChannel?.name}
          messagePermission={currentUser?.canMessage || false}
          userStatus={userStatus}
          userId={userId}
          channelId={channelId}
          replyingTo={replyingTo}
          resetReplyingTo={resetReplyingTo}
        />
      </div>
    </div>
  );
}
