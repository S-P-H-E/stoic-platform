"use client"
import React, { useEffect, useState } from 'react';

export default function DateTime() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = {
        day: 'numeric',
        month: 'long',
      };
      const optionsYear = {
        year: 'numeric',
      };
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
      };
      const formattedDate = now.toLocaleDateString(undefined, optionsDate as any);
      const formattedYear = now.toLocaleDateString(undefined, optionsYear as any);
      const formattedTime = now.toLocaleTimeString(undefined, optionsTime as any);
      setCurrentDate(formattedDate);
      setCurrentYear(formattedYear);
      setCurrentTime(formattedTime);
    };

    updateDateTime(); 
    const intervalId = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className='2xl:text-4xl text-2xl rounded-xl p-4 flex border border-[--border] items-center gap-4 transition duration-200 bg-[#161515] hover:border-[#585757] hover:scale-105'>
      <div className='flex flex-col w-full justify-center'>
        <p>{currentDate}</p>
        <p>{currentYear}</p>
      </div>
      <div className='flex flex-col gap-2 text-5xl 2xl:text-[5rem]'>
        <div>{currentTime}</div>
      </div>
    </div>
  );
}