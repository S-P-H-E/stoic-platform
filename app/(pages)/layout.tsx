import AuthGuard from '@/utils/AuthGuard'
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] })

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body>
          <div className="flex">
          <AuthGuard>
            <div className='pr-[17rem]'>
            <Sidebar/>
            </div>
            {children}
          </AuthGuard>
          </div>
        </body>
    </html>
  )
}
