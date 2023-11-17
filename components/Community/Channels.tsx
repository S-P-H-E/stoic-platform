import React from 'react'
import DraggableChannel from './DraggableChannel';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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
  
export default function Channels({ channels, channelId, onDragEnd, userStatus, router }: {channels: Channel[], channelId: string | string[], userStatus:string | undefined, onDragEnd: (id: string, order: number) => void; router: AppRouterInstance}) {

  return (
    <>
      <ul className="flex flex-col gap-2">
        {channels
          .filter((channel) => channel.permissions[userStatus || 'premium']?.canSeeChannel || false) // Add this line to filter channels based on user's permission
          .map((channel => (
            <div key={channel.id}>
            <DraggableChannel userStatus={userStatus} channelId={channelId as string} onClick={() => router.push(`/community/${channel.id}` ? `${channel.id}` : `/community/${channel.id}`)} channel={channel} onDragEnd={onDragEnd} />
            </div>
          )))}
      </ul>
    </>
  )
}
