import { Metadata } from "next";
import ConvertersComponent from "@/app/(pages)/converters/Converters";

export const metadata: Metadata = {
  title: 'Converters - STOIC',
  description: 'Converters page of Stoic platform',
}

export default function Converters() {
  return (
    <ConvertersComponent/>
  )
}

