import { Metadata } from "next";
import YTConverterComponent from "@/app/(pages)/converters/youtube/YTConverter";
export const metadata: Metadata = {
  title: 'Youtube Converter - STOIC',
  description: 'Youtube converter page of Stoic platform',
}

export default function Dashboard() {
  return (
    <YTConverterComponent/>
  )
}