import AuthGuard from '@/utils/AuthGuard';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from './../../components/MobileSidebar';
import React from "react";
import AdvancedWrapper from './Wrapper';
import { Suspense } from 'react'
import PageLoader from "@/components/PageLoader";

function Fallback() {
    return <PageLoader/>
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
        <body>
            <Suspense fallback={<Fallback/>}>
              <AdvancedWrapper>
                <div className="hidden md:flex md:w-60 lg:w-72 h-full border-border md:border-r">
                  <Sidebar />
                </div>
                <div className="flex flex-col md:pl-[15rem] lg:pl-[18rem]">
                  <MobileSidebar />
                  {children}
                </div>
              </AdvancedWrapper>
            </Suspense>
        </body>
    </AuthGuard>
  );
}
