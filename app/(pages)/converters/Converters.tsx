"use client"

import Image from 'next/image';
import React from 'react';
import bgCover from '@/public/STOIC_EM_BANNER.webp';
import bgCoverOld from '@/public/backgroundCover.jpg';
import Converters from '@/components/Converter/Converters';
import {isUserAllowedToFetch} from "@/utils/utils";
import {UserDataFetcher} from "@/utils/userDataFetcher";

export default function ConvertersComponent() {
    const { userStatus } = UserDataFetcher();

    const allowedToFetch = isUserAllowedToFetch(userStatus)

  return (
    <div className="h-full flex flex-col md:gap-16 gap-8 justify-between items-start w-full">
      <div className="relative flex w-full h-96">
        <Image
          alt="Background Cover"
          src={bgCover}
          fill
          priority
          quality={90}
          className="object-cover"
          placeholder="blur"
        />
        <div className="absolute h-64 w-full bottom-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
        <div className="w-full h-full max-w-9xl mx-auto relative">
          <h1 className="absolute -bottom-4 px-8 text-5xl md:text-7xl font-medium">
            Converters
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-8 w-full p-8 max-w-9xl mx-auto">
        <Converters allowedToFetch={allowedToFetch} />
      </div>
    </div>
  );
}
