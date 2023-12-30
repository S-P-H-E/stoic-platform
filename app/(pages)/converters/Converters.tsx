import Image from 'next/image';
import React from 'react';
import bgCover from '@/public/backgroundCover.jpg';
import Converters from '@/components/Converter/Converters';

export default function ConvertersComponent() {
  return (
    <div className="h-full flex flex-col md:gap-16 gap-8 justify-between items-start w-full">
      <div className="relative flex w-full h-96">
        <Image
          alt="Background Cover"
          src={bgCover}
          fill
          className="object-cover"
          placeholder="blur"
        />
        <div className="absolute h-64 w-full bottom-0 bg-gradient-to-b from-transparent via-transparent to-[--bg]" />
        <h1 className="absolute -bottom-4 px-8 text-5xl md:text-7xl font-medium">
          Converters
        </h1>
      </div>
      <div className="flex flex-col gap-4 md:gap-8 w-full p-8">
        <Converters />
      </div>
    </div>
  );
}
