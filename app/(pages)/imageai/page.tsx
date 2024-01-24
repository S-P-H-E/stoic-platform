import { Metadata } from "next";
import ImageAIGuard from "./ImageAIGuard";

export const metadata: Metadata = {
  title: 'Image AI - STOIC',
  description: 'ImageAI page of Stoic platform',
}

export default function ImageAI() {
  return (
    <ImageAIGuard/>
  )
}