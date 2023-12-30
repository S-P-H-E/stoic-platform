import { Metadata } from "next";
import StoicAIGuard from "./StoicAIGuard";

export const metadata: Metadata = {
  title: 'Stoic AI - STOIC',
  description: 'StoicAI page of Stoic platform',
}

export default function StoicAI() {
  return (
    <StoicAIGuard/>
  )
}

