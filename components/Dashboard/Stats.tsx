"use client"

import { getChannelInfo } from '@/actions/actions';
import { User } from '@/types/types'
import { isUserAllowedToFetch } from '@/utils/utils'
import React, { useTransition, useEffect, useCallback, useState } from 'react'
import { BeatLoader } from 'react-spinners';
import StatCard from './StatCard';

interface ChannelStatistics {
  hiddenSubscriberCount: boolean;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}


export default function Statistics({user}: {user: User}) {
  const [isPending, startTransition] = useTransition();
  const [channelStatistics, setChannelStatistics] = useState<ChannelStatistics | null>(null)

  const isAllowed = isUserAllowedToFetch(user.status)

  const fetchData = useCallback(async () => {
    startTransition(async () => {
      const channel = await getChannelInfo(user.status, user.social);
      const statistics: ChannelStatistics = channel.statistics;
      setChannelStatistics(statistics)

      console.log(statistics);
    });
  }, [user.status, user.social, startTransition]);


  useEffect(() => {
    if (isAllowed && user.social) {
      fetchData();
    }
  }, [isAllowed, fetchData, user.social]);

  return (
    <div className='flex flex-col gap-4 w-full h-40'>
      <h1 className="text-2xl font-medium">Social Stats</h1>
      {user.social && isPending ? 
        <div className="w-full h-full flex items-center justify-center">
          <BeatLoader color="#fff"/>
        </div>
      : 
        <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full gap-4">
          <StatCard quantity={channelStatistics?.viewCount} subheading={'Views'}/>
          <StatCard quantity={channelStatistics?.subscriberCount} formatCompact subheading={'Subscribers'}/>
          <StatCard quantity={channelStatistics?.videoCount} formatCompact subheading={'Videos'}/>
        </div>
      }
    </div>
  )
}
