'use client';

import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import BackButton from './BackButton';
import Header from './Header';
import Social from './Social';
import React from "react";
import clsx from "clsx";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  className?: string;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
    className,
}: CardWrapperProps) => {
  return (
    <Card className={clsx("min-w-[300px] w-[90%] mx-auto md:w-[400px] shadow-md bg-black/40 border-none backdrop-blur-md md:hover:ring-blue-400/50 ring-border/80 ring-1 hover:ring transition" +
        " duration-500", className && className)}>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter className="flex justify-center">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
