'use client'

import Locked from '@/components/Locked';
import PageLoader from '@/components/PageLoader';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React from 'react'
import SettingsComponent from './Settings';

export default function SettingsGuard() {
    const { userStatus } = UserDataFetcher();

    if (userStatus == "user") {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <Locked/>
          <SettingsComponent/>
        </div>
      );
    } else if (userStatus == 'premium' || userStatus == 'admin' && userStatus !== null) {
      return (
        <div className="h-full flex lg:p-10 lg:px-16 p-6 justify-between items-start w-full">
          <SettingsComponent/>
        </div>
      );
    }  else {
      return <PageLoader/>;
    }
}
