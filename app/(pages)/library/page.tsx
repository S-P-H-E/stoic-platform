import { Metadata } from "next";
import LibraryComponent from "@/app/(pages)/library/Library";

export const metadata: Metadata = {
  title: 'Library - STOIC',
  description: 'Library page of Stoic platform',
}

export default function Library() {
  return (
    <LibraryComponent/>
  )
}

