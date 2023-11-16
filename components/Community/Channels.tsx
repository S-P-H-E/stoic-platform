import Link from 'next/link';
import React from 'react'
import { clsx } from 'clsx';

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
  }
  
export default function Channels({ channels, channelId, userStatus }: { channels: Channel[], channelId: string | string[], userStatus:string | undefined}) {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
    }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {channels
          .filter((channel) => channel.permissions[userStatus || 'premium']?.canSeeChannel || false) // Add this line to filter channels based on user's permission
          .map((channel => (
            <Link
              href={`/community/${channel.id}` ? `${channel.id}` : `/community/${channel.id}`}
              key={channel.id}
              className={clsx('px-4 py-2 text-lg bg-[--darkgray] border border-[--border] rounded-xl hover:bg-[--border] transition', channelId == channel.id && 'bg-white hover:bg-white/80 text-black')}
            >
              {truncateText(channel.name, 20)}
            </Link>
          )))}
      </ul>
    </>
  )
}
