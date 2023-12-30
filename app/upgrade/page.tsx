import { Metadata } from "next";
import UpgradeGuard from "./UpgradeGuard";

export const metadata: Metadata = {
  title: 'Upgrade - STOIC',
  description: 'Upgrade page of Stoic platform',
}

export default function Upgrade() {
  return (
    <UpgradeGuard/>
  )
}