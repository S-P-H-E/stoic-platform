"use client"
import Channels from '@/components/Community/Channels'
import Chat from '@/components/Community/Chat';
import Chatbox from '@/components/Community/Chatbox';
import Members from '@/components/Community/Members';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs';

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

interface CommunityPageProps {
  params: {
    channelId: string;
  };
}

export default function CommunityPage(
  { params: { channelId } }: CommunityPageProps
) {

  const router = useRouter()

  const { userId, userStatus } = UserDataFetcher()

  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<Member | undefined>();


  const currentChannelIdString = channelId || '';
  

  if (userStatus == 'user') {
    router.push('/')
  }

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  const isAdminOrPremium = userStatus === 'admin' || userStatus === 'premium';

    useEffect(() => {
      if (currentChannel && isAdminOrPremium) {
        const usersCollection = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
          const membersData: Member[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              photoUrl: data.photoUrl,
              bannerUrl: data.bannerUrl,
              status: data.status,
              canMessage: currentChannel.permissions[data.status]?.canMessage || false,
              canReadMessages: currentChannel.permissions[data.status]?.canMessage || false,
            };
          });
          
          const filteredMembers = membersData.filter((member) => {
            const hasPermissionToSee =
              currentChannel.permissions[member.status]?.canSeeChannel || false;
            return member.status === 'admin' || (member.status === 'premium' && hasPermissionToSee);
          });

          setMembers(filteredMembers);

          const currentUserData = membersData.find((member) => member.id === userId);
          setCurrentUser(currentUserData);
        });
  
        return () => unsubscribe();
      }
    }, [currentChannel, userId, isAdminOrPremium]);

    useEffect(() => {
      if (isAdminOrPremium) {
        const channelsCollection = collection(db, 'channels');
      
        const unsubscribe = onSnapshot(
          query(channelsCollection, orderBy('order')),
          (querySnapshot) => {
            const channelsData: Channel[] = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name,
                description: data.description,
                icon: data.icon,
                permissions: data.permissions,
                order: data.order,
                activeTyping: data.activeTyping
              };
            });
      
            setChannels(channelsData);
    
            const currentChannelData = channelsData.find((channel) => channel.id === currentChannelIdString);
    
            console.log(currentChannelData)
            setCurrentChannel(currentChannelData);
          }
        );
        
        return () => unsubscribe();
      }
    }, [currentChannelIdString, isAdminOrPremium]);

    const handleDragEnd = async (id: string, newOrder: number) => {
      try { 
        const channelRef = doc(db, 'channels', id);
    
        await updateDoc(channelRef, {
          order: newOrder,
        });
    
        /* console.log(`Dropped channel with id ${id} to new order ${newOrder}`); */
      } catch (error) {
        console.error('Error updating channel order:', error);
      }
    };

  return (
    <main className='h-full flex items-end w-full'>

      <section className="h-screen w-2/12 border-r border-[--border] flex flex-col gap-4 p-2">
        <h1 className="text-2xl font-medium justify-center flex">Community</h1>
          <Channels router={router} channelId={currentChannelIdString} channels={channels} userStatus={userStatus} onDragEnd={handleDragEnd} />
      </section>
      
      <section className="h-screen w-full 2xl:w-8/12 border-r border-[--border] flex flex-col gap-4">
        <div className='flex flex-col h-full w-full relative'>
          <Chat currentChannel={currentChannel} currentUser={currentUser} userId={userId} userStatus={userStatus} canFetch={isAdminOrPremium} channelId={channelId} members={members} readPermission={currentUser?.canReadMessages || false}/>
          {/*<div className="sticky w-full p-2">
            <Chatbox userName={currentUser?.name} currentChannelName={currentChannel?.name} messagePermission={currentUser?.canMessage || false} userStatus={userStatus} userId={userId} channelId={channelId}/>
          </div> */}
        </div>
      </section>

     <section className="h-screen w-2/12 flex-col gap-4 p-2 2xl:flex hidden">
        <h1 className="text-2xl font-medium justify-center flex">Members</h1>
        <Members members={members}/>
      </section>

    <div className='2xl:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <button className="h-screen w-16 rounded-l-xl flex items-center justify-center">
            <ChevronLeft/>
            <BsPersonFill size={32}/>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className='border-[--border] bg-[--bg]'>
          <section className="h-screen w-full flex flex-col gap-4 p-2">
            <h1 className="text-2xl font-medium justify-center flex">Members</h1>
            <Members members={members}/>
          </section>
        </SheetContent>
      </Sheet>
      </div>
    </main>
  )
}
