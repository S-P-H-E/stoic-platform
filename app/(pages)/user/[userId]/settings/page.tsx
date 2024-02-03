import { Metadata } from "next";
import SettingsComponent from "@/app/(pages)/user/[userId]/settings/Settings";

export const metadata: Metadata = {
  title: 'Settings - STOIC',
  description: 'Settings page of Stoic platform',
}

interface SettingsPageProps {
    params: {
        userId: string;
    };
}

export default function SettingsPage({
    params: {userId}
}: SettingsPageProps) {
  return (
    <SettingsComponent userId={userId}/>
  )
}

