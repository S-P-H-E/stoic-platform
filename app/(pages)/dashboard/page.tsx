import { Metadata } from "next";
import DashboardComponent from "./Dashboard";

export const metadata: Metadata = {
  title: 'Dashboard - STOIC',
  description: 'Dashboard page of Stoic platform',
}

export default function Dashboard() {
  return (
    <DashboardComponent/>
  )
}