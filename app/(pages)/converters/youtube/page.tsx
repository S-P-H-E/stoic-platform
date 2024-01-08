import { Metadata } from "next";
import YTConverterGuard from "./YTConverterGuard";
export const metadata: Metadata = {
  title: 'Youtube Converter - STOIC',
  description: 'Youtube converter page of Stoic platform',
}

export default function Dashboard() {
  return (
    <YTConverterGuard/>
  )
}