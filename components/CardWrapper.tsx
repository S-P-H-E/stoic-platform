'use client';

import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import BackButton from './BackButton';
import Header from './Header';
import Social from './Social';
import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="min-w-[300px] w-full md:w-[400px] shadow-md bg-black/40 border-none backdrop-blur-md md:hover:ring-blue-400/50 ring-border/80 ring-1 hover:ring transition duration-500">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
