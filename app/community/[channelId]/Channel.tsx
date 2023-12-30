"use client"
import Channels from '@/components/Community/Channels'
import Chat from '@/components/Community/Chat';
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
  roles: Array<Role>;
  canMessage: boolean;
  canReadMessages: boolean;
  activity: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}



interface CommunityPageProps {
  channelId: string;
}

export default function CommunityPage({channelId}: CommunityPageProps) {

  const router = useRouter()

  const { userId, userStatus } = UserDataFetcher()

  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<Member | undefined>();
  
  const [roles, setRoles] = useState<Role[]>([]);

  const currentChannelIdString = channelId || '';

  const [activity, setActivity] = useState('offline')
  

/*   if (userStatus == 'user') {
    router.push('/')
  } */

  useEffect(() => {
    if (userId) {
      const userDoc = doc(db, 'users', userId as string);

      const setUserOnlineStatus = async (status: string) => {
        try {
          await updateDoc(userDoc, { activity: status });
        } catch (error) {
          console.error('Error updating user activity:', error);
        }
      };

      const setOnlineStatus = () => {
        setUserOnlineStatus('online');
        setActivity('online')
      };

      const setOfflineStatus = () => {
        setUserOnlineStatus('offline');
        setActivity('offline')
      };

      const handleUserStatusChange = (isOnline: boolean) => {
        if (isOnline) {
          setOnlineStatus();
        } else {
          setOfflineStatus();
        }
      };

      const handleWindowFocus = () => {
        handleUserStatusChange(true);
      };

      const handleWindowBlur = () => {
        handleUserStatusChange(false);
      };

      setOnlineStatus();

      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);

      // Cleanup event listeners on component unmount
      return () => {
        setOfflineStatus(); // Set offline when the component unmounts
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [userId]);

  useEffect(() => {
    const rolesCollection = collection(db, 'roles');

    const unsubscribe = onSnapshot(
      query(rolesCollection, orderBy('order')),
      (snapshot) => {
        const rolesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          color: doc.data().color,
          order: doc.data().order, // Include the order field in rolesData
        }));
        setRoles(rolesData);
      }
    );
  

    return () => unsubscribe();
  }, []);

  const isAdminOrPremium = userStatus === 'admin' || userStatus === 'premium';

    useEffect(() => {
      if (currentChannel && isAdminOrPremium) {
        const usersCollection = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
          const membersData: Member[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();

            const userRoles = data.roles && data.roles.map((roleName: string) => {
              const role = roles.find((r) => r.name === roleName);
              return role || { name: roleName, color: 'white' }; // Default color if role not found
            });
     
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              photoUrl: data.photoUrl,
              bannerUrl: data.bannerUrl,
              status: data.status,
              activity: data.activity,
              roles: userRoles || "User",
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
    }, [currentChannel, userId, isAdminOrPremium, roles]);

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
        {/* <p>{currentUser?.activity}</p> */}
      </section>
      
      <section className="h-screen w-full 2xl:w-8/12 border-r border-[--border] flex flex-col gap-4">
        <div className='flex flex-col h-full w-full relative'>
          <Chat activity={activity} roles={roles} currentChannel={currentChannel} currentUser={currentUser} userId={userId} userStatus={userStatus} canFetch={isAdminOrPremium} channelId={channelId} members={members} readPermission={currentUser?.canReadMessages || false}/>
          {/*<div className="sticky w-full p-2">
            <Chatbox userName={currentUser?.name} currentChannelName={currentChannel?.name} messagePermission={currentUser?.canMessage || false} userStatus={userStatus} userId={userId} channelId={channelId}/>
          </div> */}
        </div>
      </section>

     <section className="h-screen w-2/12 flex-col gap-4 p-2 2xl:flex hidden">
        <h1 className="text-2xl font-medium justify-center flex">Members</h1>
        <Members userId={userId} roles={roles} members={members}/>
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
            <Members userId={userId} roles={roles} members={members}/>
          </section>
        </SheetContent>
      </Sheet>
      </div>
    </main>
  )
}
