import { Metadata } from "next";
import ChannelComponent from "./Channel";

export const metadata: Metadata = {
  title: 'Community - STOIC',
  description: 'Community page of Stoic platform',
}

interface CommunityPageProps {
  params: {
    channelId: string;
  };
}   

export default function Dashboard(
  { params: { channelId } }: CommunityPageProps
) {
  return (
    <ChannelComponent channelId={channelId}/>
  )
}

