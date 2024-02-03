import { Metadata } from "next";
import CreateComponent from "@/app/(pages)/create/Create";

export const metadata: Metadata = {
  title: 'Create - STOIC',
  description: 'Create page of Stoic platform',
}

export default function Create() {
  return (
    <CreateComponent/>
  )
}