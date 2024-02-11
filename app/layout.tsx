import { FirebaseProvider } from '@/utils/authContext'
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner';
import { GeistSans } from "geist/font/sans";

import React from "react";

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
    <FirebaseProvider>
      <html lang="en">
        <body className={GeistSans.className}>
            {children}
            <Toaster />
        </body>
      </html>
    </FirebaseProvider>
  )
}
