"use server"

import { isUserAllowedToFetch } from "@/utils/utils"

const YoutubeApiKey = process.env.YOUTUBE_DATA_API_SECRET

export const getChannelInfo = async (userStatus: string | undefined, userSocial: string | undefined) => {

    const isAllowed = isUserAllowedToFetch(userStatus)

    if (!isAllowed) {
        return { error: 'You are not allowed to make this request.' }
    }

    if (userSocial && YoutubeApiKey) {
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?type=channel&q=MrBeast&key=${YoutubeApiKey}`
        );
        const channelSearchResult = await searchResponse.json();
        const channelId = channelSearchResult.items[0].id.channelId;

        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YoutubeApiKey}`
          );
        const channelInfo = await channelResponse.json();

        console.log(JSON.stringify(channelInfo));

        return (channelInfo);
    } else {
        return null
    }
}