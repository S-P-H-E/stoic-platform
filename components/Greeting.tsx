"use client"

import React from 'react';
import { UserDataFetcher } from '@/utils/userDataFetcher';

export default function Greeting() {
  const { userName } = UserDataFetcher();

  const currentHour = new Date().getHours();

  let greeting = 'Hello';

  if (currentHour >= 21) {
    greeting = 'Good evening';
  } else if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = 'Good night';
  }  
  else {
    greeting = 'Hello';
  }

  return (
    <p className="text-2xl font-medium">
      {greeting}, {userName ? userName : '...'}
    </p>
  );
}
