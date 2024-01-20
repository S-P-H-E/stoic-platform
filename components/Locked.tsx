import Link from 'next/link';
import React from 'react';
import { AiFillLock } from 'react-icons/ai';

export default function Locked() {
  return (
    <>
      <div className="md:pl-[15rem] lg:pl-[18rem] absolute inset-0 backdrop-blur-xl w-full h-full flex items-center justify-center z-40 rounded-xl">
        <div className="bg-[--bg] opacity-80 absolute inset-0" />
        <div className="w-full h-60 text-white text-center p-4 rounded-lg z-20 flex flex-col items-center justify-center">
          <AiFillLock size={64} className="text-[--upgrade]" />
          <p className="text-4xl pb-2">
            <Link
              href={'/upgrade'}
              className="text-[--upgrade] hover:underline font-medium"
            >
              Upgrade
            </Link>{' '}
            to get access
          </p>
          <Link href={'/upgrade'}>
            <button className="upgrade bg-blue-400 !text-black">
              UPGRADE
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
