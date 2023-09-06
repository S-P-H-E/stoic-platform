"use client"

import { useRef, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Converter/Input";
import clsx from "clsx";
import axios, { AxiosRequestConfig } from 'axios';
import Image from "next/image";
import Download from "@/components/Converter/Download";
import { AiFillYoutube} from 'react-icons/ai'
import {FiExternalLink, FiLoader} from 'react-icons/fi'
import SocialLink from "@/components/Converter/SocialLink";
import Link from "next/link";
import {SiTiktok} from "react-icons/si"
import { BsMusicNote, BsTrash } from "react-icons/bs";
import { convertRumbleURLToAPIURL } from "@/utils/converter/RumbleParser";



export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [urlResult, setUrlResult] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  const [quality360p, setQuality360p] = useState<string | null>(null);
  const [quality480p, setQuality480p] = useState<string | null>(null);
  const [quality720p, setQuality720p] = useState<string | null>(null);
  const [quality1080p, setQuality1080p] = useState<string | null>(null);
  const [quality1440p, setQuality1440p] = useState<string | null>(null);
  const [quality2160p, setQuality2160p] = useState<string | null>(null);

  // updates the input value everytime the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  
  function formatInteractionCount(count: number) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return (count / 1000000).toFixed(1) + 'M';
    }
  }
  
  // What happens when the user presses on search button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputUrlRef.current !== null) {
      const rumbleUrl = convertRumbleURLToAPIURL(inputUrlRef.current.value)

      // Code to connect to rapid api
      if (rumbleUrl) {
        console.log("Valid Rumble URL:", rumbleUrl);
        setLoading(true);
        const options: AxiosRequestConfig = {
          method: 'GET', // Specify the HTTP method as a string
          url: rumbleUrl,
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '', // Add a default value if process.env.NEXT_PUBLIC_RAPID_API_KEY might be undefined
            'X-RapidAPI-Host': 'rumble-videos.p.rapidapi.com',
          },
        };
      
      // What to do after connected to api
      axios(options)
      .then(response => {
        const videoTitle = response.data.name;
        const videoThumbnail = response.data.thumbnailUrl
        
        setThumbnailUrl(videoThumbnail)
        setUrlResult(response.data)
        setVideoTitle(videoTitle)

        const videoSources = response.data.videoSources.mp4;

        const quality360p = videoSources["360"] ? videoSources["360"].url : null;
        const quality480p = videoSources["480"] ? videoSources["480"].url : null;
        const quality720p = videoSources["720"] ? videoSources["720"].url : null;
        const quality1080p = videoSources["1080"] ? videoSources["1080"].url : null;
        const quality1440p = videoSources["1440"] ? videoSources["1440"].url : null;
        const quality2160p = videoSources["2160"] ? videoSources["2160"].url : null;
        
        setQuality360p(quality360p)
        setQuality480p(quality480p)
        setQuality720p(quality720p)
        setQuality1080p(quality1080p)
        setQuality1440p(quality1440p)
        setQuality2160p(quality2160p)

        console.log('Default Quality:' + quality360p)

      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
      inputUrlRef.current.value = "";
      } else {
        console.log("THIS IS NOT A VALID LINK")
      }
    }
  };

  const placeholderImageUrl = "/placeholder.jpg";

  return (
    <main className="flex flex-col justify-center items-center w-full sm:h-screen h-full text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold text-green-500">
        Rumble <span className="text-white">Converter</span>
      </h1>
      <section className="sm:w-[50rem] gap-4 flex flex-col">
        <p className="text-xl">
          Transform Rumble videos into MP4 in just a few clicks
        </p>

        <form onSubmit={handleSubmit} className="gap-3 flex">
          <Input
            ref={inputUrlRef}
            type="text"
            placeholder="Enter the link of the desired video"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            className={clsx("!w-36", {
              "cursor-not-allowed hover:bg-transparent text-[--border] hover:ring-offset-0 hover:ring-0": inputValue === "" || isLoading,
            })}
            type="submit"
            disabled={inputValue === "" || isLoading}
          >
            {isLoading ? 'Loading...' : inputValue === "" ? "Empty" : "Search"}
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <FiLoader size={48} className="animate-spin"/>
          </div>
        ) : urlResult ? (
          <>
            <div className="md:items-start md:justify-start md:flex-row flex flex-col gap-4 items-center justify-center">
              <div className="md:w-[32rem] flex flex-col gap-3 w-80 pt-2">
              <Link className="" target="_blank" href={inputValue || "cantfindvideo"}>
                  <div className="relative transition hover:ring-offset-4 hover:ring-4 ring-[--border] ring-offset-[--bg] border border-[--border] rounded-lg group overflow-hidden h-[18rem] flex w-[32rem] items-center justify-center">
                      <Image
                        alt="Video Thumbnail"
                        src={thumbnailUrl || placeholderImageUrl}
                        width={640}
                        height={480}
                        className="w-full h-auto"
                      />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                      <FiExternalLink className="h-10 w-10 group-hover:text-white transition group-hover:opacity-100 opacity-0" />
                    </div>
                  </div>
                </Link>
                { videoTitle ?
                 <h1 className="md:text-2xl font-semibold text-lg overflow-hidden whitespace-nowrap">
                 {videoTitle.length > 40
                   ? `${videoTitle.slice(0, 40)}...`
                  : videoTitle}
                  </h1>
                : null}
              </div>
              <div className="flex flex-col gap-4 w-full p-2">
                { quality2160p ? 
                  <Download definition={'UHD'} downloadUrl={quality2160p} quality={'4K'}></Download>
                : null}
                
                { quality1440p ? 
                  <Download definition={'UHD'} downloadUrl={quality1440p} quality={'2K'}></Download>
                : null}

                { quality1080p ? 
                  <Download definition={'HD'} downloadUrl={quality1080p} quality={'1080P'}></Download>
                : null}
                
                { quality720p ? 
                  <Download definition={'HD'} downloadUrl={quality720p} quality={'720P'}></Download>
                : null}
                                
                { quality480p ? 
                  <Download definition={'SD'} downloadUrl={quality480p} quality={'480P'}></Download>
                : null}

                { quality360p ? 
                  <Download definition={'SD'} downloadUrl={quality360p} quality={'360P'}></Download>
                : null}

                <Button 
                className="group p-3 font-semibold text-stone-300 hover:text-white transition"
                onClick={() => {
                  setUrlResult(null)
                  setInputValue("")
                }}>
                  <p className="group-hover:opacity-0 transition">Remove</p>
                  <BsTrash className="group-hover:-translate-x-8 transition group-hover:scale-125"/>
                </Button>
              </div>
            </div>
          </>
        ) : null}
          <hr className="border-[--border]"/>
        <div className="flex justify-center items-center gap-4">
          <SocialLink link="https://youtube-converter-six.vercel.app" icon={AiFillYoutube} iconSize={64}/>
          <SocialLink icon={SiTiktok} iconSize={36} link="https://tiktok-converter.vercel.app"/>
          <SocialLink link="https://mp3-converter-one.vercel.app" iconSize={36} icon={BsMusicNote}/>
        </div>
      </section>
    </main>
  );
}