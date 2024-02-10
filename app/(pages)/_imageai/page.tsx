import { Metadata } from "next";
import ImageAIComponent from "@/app/(pages)/_imageai/ImageAI";

export const metadata: Metadata = {
  title: 'Image AI - STOIC',
  description: 'ImageAI page of Stoic platform',
}

export default function ImageAI() {
  return (
    <ImageAIComponent/>
  )
}