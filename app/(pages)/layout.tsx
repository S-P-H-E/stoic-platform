import AuthGuard from '@/utils/AuthGuard'
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] })

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body>
          <AuthGuard>
            {children}
          </AuthGuard>
        </body>
    </html>
  )
}
