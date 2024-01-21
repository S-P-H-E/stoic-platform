import Greeting from '@/components/Dashboard/Greeting'
import React from 'react'
import { User } from '@/types/types';
import Continue from '@/components/Dashboard/Continue';
import CreateTaskButton from '@/components/Dashboard/CreateTaskButton';
import Tasks from '@/components/Dashboard/Tasks';

interface DashboardComponentProps {
  allowedToFetch: boolean;
  notAllowed?: boolean;
  user?: User;
}

export default function DashboardComponent({allowedToFetch, notAllowed, user}: DashboardComponentProps) {

  if (notAllowed || !user) {
    return (
      <p>Unauthorised</p> // ! change with the one we always use
    )
  } else {
    return (
      <div className="h-full flex flex-col gap-4 lg:p-10 lg:px-16 p-6 justify-between items-start w-full mx-auto max-w-7xl">
        <div className="w-full flex gap-4 items-center justify-between">
          <Greeting userName={user.name}/>
          <CreateTaskButton userId={user.id} userStatus={user.status}/>
        </div>
        <Continue allowedToFetch={allowedToFetch} user={user}/>
        <Tasks userId={user.id} userStatus={user.status}/>
        <div>OTHER CONTENT</div>
      </div>
    )
  }
}