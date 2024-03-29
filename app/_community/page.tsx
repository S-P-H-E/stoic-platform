import { Metadata } from "next";
import CommunityComponent from "@/app/_community/Community";

export const metadata: Metadata = {
  title: 'Community - STOIC',
  description: 'Community page of Stoic platform',
}

export default function Community() {
  return (
    <CommunityComponent/>
  )
}