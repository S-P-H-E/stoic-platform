import { Metadata } from "next";
import ChannelGuard from "./ChannelGuard";

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
    <ChannelGuard channelId={channelId}/>
  )
}

