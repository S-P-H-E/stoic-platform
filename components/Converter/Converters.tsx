import React from 'react';
import Converter from './Converter';
import { AiFillInstagram, AiFillYoutube } from 'react-icons/ai';
import { SiTiktok } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';

const converters = [
  {
    name: 'Youtube Converter',
    description:
      'Convert YouTube videos into downloadable video and audio files.',
    color: 'bg-red-500',
    icon: <AiFillYoutube size={64} />,
    href: '/converters/youtube',
    disabled: false,
  },
  {
    name: 'Instagram Converter',
    description:
      'Convert Instagram videos into downloadable video and audio files.',
    color: 'bg-blue-500',
    icon: <AiFillInstagram size={64} />,
    href: '',
    disabled: true,
  },
  {
    name: 'TikTok Converter',
    description:
      'Convert TikTok videos into downloadable video and audio files.',
    color: 'bg-pink-500',
    icon: <SiTiktok size={48} />,
    href: '/converters/tiktok',
    disabled: false,
  },
  {
    name: 'Twitter (X) Converter',
    description:
      'Convert X (Twitter) videos into downloadable video and audio files.',
    color: 'bg-yellow-800', // ? change to black
    icon: <FaXTwitter size={48} />,
    href: '',
    disabled: true,
  },
  /*   {
    name: 'Rumble Converter',
    description: 'Convert Rumble videos into downloadable mp4 or mp3 files.',
    color: 'bg-green-500',
    icon: <p className="text-xl text-center font-medium">Coming Soon</p>,
    href: '',
    disabled: true
  }, */
];

export default function Converters({
  allowedToFetch,
}: {
  allowedToFetch: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {allowedToFetch &&
        converters.map((converter, index) => (
          <Converter
            key={index}
            title={converter.name}
            color={converter.color}
            icon={converter.icon}
            href={converter.href}
            description={converter.description}
            disabled={converter.disabled}
          />
        ))}
    </div>
  );
}
