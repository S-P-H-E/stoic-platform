"use client"

import React, { useEffect, useState } from 'react';
import { UserDataFetcher } from '@/utils/userDataFetcher';

export default function Greeting() {
  const { userName } = UserDataFetcher();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good morning');
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good afternoon');
      } else if (currentHour >= 18 && currentHour < 22) {
        setGreeting('Good evening');
      } else {
        setGreeting('Good night');
      }
    };

    getGreeting();
  }, []);

  return (
    <p className="text-2xl font-medium">
      {greeting}, {userName ? userName : '...'}
    </p>
  );
}
