import Link from 'next/link'
import React from 'react'
import {BiDownload} from 'react-icons/bi'
import {GoUnmute, GoMute} from 'react-icons/go'


interface DownloadProps {
    definition?: string | null
    quality?:  string | null
    downloadUrl: string
    onclick?: () => void
    hasAudio?: boolean
  }

export default function Download({definition, quality, downloadUrl, onclick, hasAudio}: DownloadProps) {
  return (
    <Link onClick={onclick} target="_blank" rel="noreferrer" href={downloadUrl}>
        <div className='text-base relative group border-[--border] border rounded-lg p-3 w-full font-semibold flex justify-center items-center gap-2 ring-offset-[--bg] ring-white/10 cursor-pointer hover:bg-[--border] hover:ring hover:ring-offset-2 transition'>
            {hasAudio !== undefined ? (
              hasAudio ? (
                <GoUnmute />
              ) : (
                <GoMute />
              )
            ) : null}
            <p className='group-hover:border-white/30 text-stone-300 font-base group-hover:text-white  transition absolute top-2 right-2 text-sm px-1 rounded-full border-[--border] border'>{definition}</p>
            <p className='text-stone-300 group-hover:text-white'>Download {quality}</p>
            <BiDownload className="text-stone-300 group-hover:text-white group-hover:translate-y-1 transition " />
        </div>
    </Link>
  )
}
