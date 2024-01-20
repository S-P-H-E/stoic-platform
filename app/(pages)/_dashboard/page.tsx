import { Metadata } from "next";
import DashboardGuard from "./DashboardGuard";

export const metadata: Metadata = {
  title: 'Dashboard - STOIC',
  description: 'Dashboard page of Stoic platform',
}

export default function Dashboard() {
  return (
    <DashboardGuard/>
  )
}

