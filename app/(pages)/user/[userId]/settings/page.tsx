import { Metadata } from "next";
import SettingsGuard from "./SettingsGuard";

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
    <SettingsGuard userId={userId}/>
  )
}

