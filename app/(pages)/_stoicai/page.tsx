import { Metadata } from "next";
import StoicAIComponent from "@/app/(pages)/_stoicai/StoicAI";

export const metadata: Metadata = {
  title: 'Stoic AI - STOIC',
  description: 'StoicAI page of Stoic platform',
}

export default function StoicAI() {
  return (
    <StoicAIComponent/>
  )
}

