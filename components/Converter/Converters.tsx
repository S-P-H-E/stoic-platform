import React from 'react'
import Converter from './Converter'
import { AiFillYoutube } from 'react-icons/ai'
import { SiTiktok } from 'react-icons/si'

const converters = [
  {
    name: 'Youtube MP4 Converter',
    description: 'Convert YouTube videos into downloadable mp4 files.',
    color: 'bg-red-500',
    icon: <AiFillYoutube size={64}/>,
    href: '/converters/ytmp4',
    disabled: false
  },
  {
    name: 'Youtube MP3 Converter',
    description: 'Convert YouTube videos into downloadable mp3 files.',
    color: 'bg-blue-500',
    icon: <AiFillYoutube size={64}/>,
    href: '/converters/ytmp3',
    disabled: false
  },
  {
    name: 'TikTok Converter',
    description: 'Convert TikTok videos into downloadable mp4 or mp3 files.',
    color: 'bg-pink-500',
    icon: <SiTiktok size={48}/>,
    href: '/converters/tiktok',
    disabled: false
  },
  {
    name: 'Rumble Converter',
    description: 'Convert Rumble videos into downloadable mp4 or mp3 files.',
    color: 'bg-green-500',
    icon: <p className="text-xl text-center font-medium">Coming Soon</p>,
    href: '',
    disabled: true
  },
]

export default function Converters() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {converters.map((converter, index) => (
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
  )
}
