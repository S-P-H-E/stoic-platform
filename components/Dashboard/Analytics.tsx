"use client"

import { getChannelInfo } from '@/actions/actions';
import { User } from '@/types/types'
import { isUserAllowedToFetch } from '@/utils/utils'
import React, { useTransition } from 'react'

interface ChannelStatistics {
  hiddenSubscriberCount: boolean;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}


export default function Analytics({user}: {user: User}) {
  const [isPending, startTransition] = useTransition();

  const isAllowed = isUserAllowedToFetch(user.status)

  const handleButtonClick = async () => {
    startTransition(async () => {
      const data = await getChannelInfo(user.status, user.social)
      const statistics: ChannelStatistics = data.items[0].statistics

      console.log(statistics)
    })
  }
  
  return (
    <div className='flex gap-2 items-center'>
      {user && user.social && 
        user.social
      }
      <button onClick={handleButtonClick}>Click me!</button>
    </div>
  )
}
