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
        <body className={inter.className}>
          <AuthGuard>
            <div className="flex flex-col items-center mb-28">
              <Navbar/>
            </div>
            {children}
          </AuthGuard>
        </body>
    </html>
  )
}
