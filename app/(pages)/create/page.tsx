import { Metadata } from "next";
import CreateGuard from "./CreateGuard";

export const metadata: Metadata = {
  title: 'Create - STOIC',
  description: 'Create page of Stoic platform',
}

export default function Create() {
  return (
    <CreateGuard/>
  )
}