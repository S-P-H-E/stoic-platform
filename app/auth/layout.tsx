import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/utils/AuthGuard'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <body className={inter.className}>
            {children}
        </body>
    )
}
