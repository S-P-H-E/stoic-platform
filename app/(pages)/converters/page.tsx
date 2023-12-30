import { Metadata } from "next";
import ConvertersGuard from "./ConvertersGuard";

export const metadata: Metadata = {
  title: 'Converters - STOIC',
  description: 'Converters page of Stoic platform',
}

export default function Converters() {
  return (
    <ConvertersGuard/>
  )
}

