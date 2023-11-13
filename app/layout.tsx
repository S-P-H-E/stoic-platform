import { FirebaseProvider } from '@/utils/authContext'
import './globals.css'
import type { Metadata } from 'next'

import { GeistSans, GeistMono } from "geist/font";

export const metadata: Metadata = {
  title: 'S T O I C',
  description: 'Stoic premium platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <FirebaseProvider>
        {children}
        </FirebaseProvider>
      </body>
    </html>
  )
}
