import Greeting from '@/components/Dashboard/Greeting'
import React from 'react'
import { User } from '@/types/types';

interface DashboardComponentProps {
  notAllowed?: boolean;
  user?: User;
}

// ! if not allowed exists, do something

export default function DashboardComponent({notAllowed, user}: DashboardComponentProps) {
  return (
    <div className="h-full flex flex-col gap-4 lg:p-10 lg:px-16 p-6 justify-between items-start w-full mx-auto max-w-7xl">
      <Greeting/>
    </div>
  )
}