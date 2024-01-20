"use client"
import { useState, useEffect } from 'react';

export default function Greeting({userName}: {userName: string | null | undefined}) {
  
  const [greeting, setGreeting] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

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

    const getFormattedDate = () => {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = new Date().toLocaleDateString('en-GB', options);
      setFormattedDate(formattedDate);
    };

    getGreeting();
    getFormattedDate();
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <p className="text-2xl md:text-3xl font-semibold">{greeting}, {userName ? userName : 'Loading...'}</p>
      <p className="text-muted-foreground text-base md:text-lg">{formattedDate}</p>
    </div>
  )
}