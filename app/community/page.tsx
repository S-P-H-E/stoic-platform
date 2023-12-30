import { Metadata } from "next";
import CommunityGuard from "./CommunityGuard";

export const metadata: Metadata = {
  title: 'Community - STOIC',
  description: 'Community page of Stoic platform',
}

export default function Community() {
  return (
    <CommunityGuard/>
  )
}