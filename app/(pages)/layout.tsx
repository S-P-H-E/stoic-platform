import AuthGuard from '@/utils/AuthGuard'
import Sidebar from '@/components/Sidebar';
import MobileSidebar from './../../components/MobileSidebar';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body>   
          <AuthGuard>
            <div className='hidden md:flex w-80 h-full border-[--border] md:border-r'> 
              <Sidebar/>
            </div>
            <div className="flex flex-col md:pl-[18rem]">
            <MobileSidebar/>
              {children}
            </div>
          </AuthGuard>
        </body>
    </html>
  )
}
