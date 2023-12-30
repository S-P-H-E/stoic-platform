import { Metadata } from "next";
import LibraryGuard from "./LibraryGuard";

export const metadata: Metadata = {
  title: 'Library - STOIC',
  description: 'Library page of Stoic platform',
}

export default function Library() {
  return (
    <LibraryGuard/>
  )
}

