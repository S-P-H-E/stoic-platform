'use client';

import Link from 'next/link';
import { ButtonShad } from './ui/buttonshad';

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <ButtonShad variant="link" asChild size="sm" className='active:scale-90 transition text-white font-normal w-full'>
      <Link href={href}>{label}</Link>
    </ButtonShad>
  );
};

export default BackButton;
