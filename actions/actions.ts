"use server"

import { parseChannelIdFromUrl, isUserAllowedToFetch } from "@/utils/utils"

const YoutubeApiKey = process.env.YOUTUBE_DATA_API_SECRET

export const getChannelInfo = async (
    userStatus: string | undefined,
    userSocial: string | undefined
  ) => {
    const isAllowed = isUserAllowedToFetch(userStatus);
    const YOUTUBE_CHANNELS_API = 'https://www.googleapis.com/youtube/v3/channels';
  
    if (!isAllowed) {
      return { error: 'You are not allowed to make this request.' };
    }
  
    if (userSocial && YoutubeApiKey) {
      const channelId = parseChannelIdFromUrl(userSocial);
  
      const channelResponse = await fetch(
        `${YOUTUBE_CHANNELS_API}?part=snippet,statistics&id=${channelId}&key=${YoutubeApiKey}`
      );
  
      const channelInfo = await channelResponse.json();

      console.log(channelInfo)
  
      if (channelInfo.items && channelInfo.items.length > 0) {
        const channelItem = channelInfo.items[0];
  
        if (channelItem.kind === 'youtube#channel') {
          console.log(channelInfo);
          return channelItem;
        } else {
          return { error: 'There was an issue with your request. Can you update your social information?' };
        }
      } else {
        return { error: 'No channel information found.' };
      }
    } else {
      return null;
    }
  };