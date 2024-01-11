import { Metadata } from "next";
import SettingsGuard from "./SettingsGuard";

export const metadata: Metadata = {
  title: 'Settings - STOIC',
  description: 'Settings page of Stoic platform',
}

export default function Settings() {
  return (
    <SettingsGuard/>
  )
}

