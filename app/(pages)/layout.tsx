import AuthGuard from '@/utils/AuthGuard';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from './../../components/MobileSidebar';


export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <html lang="en">
        <body>
          <div className="hidden md:flex md:w-60 lg:w-72 h-full border-border md:border-r">
            <Sidebar />
          </div>
          <div className="flex flex-col md:pl-[15rem] lg:pl-[18rem]">
            <MobileSidebar />
            {children}
          </div>
        </body>
      </html>
    </AuthGuard>
  );
}
