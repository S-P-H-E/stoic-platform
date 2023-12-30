"use effect"
import { ButtonShad } from '@/components/ui/buttonshad';
import Image from 'next/image';
import Link from 'next/link';
import StoicLogo from '@/public/stoicWhite.webp';
import Confetti from 'react-confetti';
import React, { useEffect, useState } from 'react';

export default function Upgraded() {
  const [confettiActive, setConfettiActive] = useState(true);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [confettiDimensions, setConfettiDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setConfettiDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    setConfettiDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fadeOutTimeout = setTimeout(() => {
      setConfettiOpacity(0);
      setTimeout(() => {
        setConfettiActive(false);
      }, 1000);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimeout);
    };
  }, []);

  return (
    <div className='flex flex-col h-screen items-center justify-center gap-3'>
      <Image alt='Stoic Logo' src={StoicLogo} placeholder='blur' className='w-16 h-20 mb-2'/>
      <h2 className='text-7xl font-medium leading-[4rem]'>Upgraded</h2>
      <h3 className='text-2xl font-medium'>You are a premium member!</h3>
      <Link href="/">
        <ButtonShad variant={'outline'}>Go to dashboard</ButtonShad>
      </Link>

      {confettiActive && (
        <Confetti
          width={confettiDimensions.width}
          height={confettiDimensions.height}
          style={{ opacity: confettiOpacity, transition: 'opacity 1s ease-out' }}
        />
      )}
    </div>
  );
}
