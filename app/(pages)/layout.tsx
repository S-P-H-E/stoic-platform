
import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/utils/AuthGuard'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

        <body className={inter.className}>
          <AuthGuard>
            {/* <Sidebar /> */}
            {children}
          </AuthGuard>
        </body>

    </html>
  )
}
