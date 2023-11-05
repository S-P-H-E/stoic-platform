"use client"

import { useEffect, useRef, useState } from "react";
import Button from "@/components/UI Elements/Button";
import Input from "@/components/Converter/Input";
import clsx from "clsx";
import axios, { AxiosRequestConfig } from "axios";
import Image from "next/image";
import Download from "@/components/Converter/Download";
import {AiFillEye, AiFillYoutube} from 'react-icons/ai'
import {FiExternalLink, FiLoader} from 'react-icons/fi'
import SocialLink from "@/components/Converter/SocialLink";
import Link from "next/link";
import {BsMusicNote, BsTrash } from "react-icons/bs";
import {FaHeart, FaCommentAlt} from "react-icons/fa"
import { message } from "antd";
import { UserDataFetcher } from "@/utils/userDataFetcher";



export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [urlResult, setUrlResult] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [videoViews, setVideoViews] = useState<number | null>(null);
  const [videoLikes, setVideoLikes] = useState<number | null>(null);
  const [videoComments, setVideoComments] = useState<number | null>(null);
  
  const [videoMusic, setVideoMusic] = useState<string | null>(null);
  const [defaultQuality, setDefaultQuality] = useState<string | null>(null);
  const [betterQuality, setBetterQuality] = useState<string | null>(null);
  const [HDQuality, setHDQuality] = useState<string | null>(null);

  // updates the input value everytime the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const RumbleIcon = '/RumbleIcon.svg'
  const { userId, userStatus } = UserDataFetcher();
  const isPremium = userStatus === 'premium' || userStatus === 'admin'

/*   const incrementConverterUseCount = async (userId: string) => {
    const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', userId);
  
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const { converterUseCount } = userDocSnapshot.data() as { converterUseCount: number };
  
        const updatedConverterUseCount = converterUseCount + 1;
  
        await updateDoc(userDocRef, {
          converterUseCount: updatedConverterUseCount,
        });
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error incrementing converterUseCount:', error);
    }
  }; */
  
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
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputUrlRef.current !== null) {
      const tiktokUrl = (inputUrlRef.current.value)
      const tiktokUrlPattern = /^https:\/\/(www\.)?(vm\.)?tiktok\.com\/(@?\w+\/video\/\d+)/;

      if (!userId && !isPremium) {
        message.error("You are not allowed to use this.")
        return; // Return early to prevent further execution
      }

      if (tiktokUrlPattern.test(tiktokUrl)) {
        setLoading(true);
          /* incrementConverterUseCount(userId); */

        const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '',
          'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
        },
        params: {
          url: tiktokUrl,
          hd: '1' // have to be made dynamic
        }
    }
      
      // What to do after connected to api
      axios(options)
      .then(response => {
        const defaultQuality = response.data.data.play;
        const betterQuality = response.data.data.wmplay;
        const hDQuality = response.data.data.hdplay;
        const videoMusic = response.data.data.music;

        const videoTitle = response.data.data.title;
        const videoThumbnail = response.data.data.cover;
        const videoViews = response.data.data.play_count;
        const videoLikes = response.data.data.digg_count;
        const videoComments = response.data.data.comment_count;

        setThumbnailUrl(videoThumbnail)
        setUrlResult(response.data.data)
        setVideoTitle(videoTitle)
        setVideoViews(videoViews)
        setVideoLikes(videoLikes)
        setVideoComments(videoComments)

        setDefaultQuality(defaultQuality)
        setBetterQuality(betterQuality)
        setHDQuality(hDQuality)
        setVideoMusic(videoMusic)

      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
      inputUrlRef.current.value = "";
      } else {
        message.error("This is not a valid link")
      }
    }
  };

  const placeholderImageUrl = "/placeholder.jpg";

  return (
    <main className="flex flex-col pt-64 items-center w-full h-full text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold text-blue-400">
        TikTok <span className="text-white">Converter</span>
      </h1>
      <section className="sm:w-[50rem] gap-4 flex flex-col">
        <p className="text-xl">
          Transform TikTok videos into MP4 in just a few clicks
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
              <div className="flex flex-col gap-3 w-56">
              <Link className="pt-[0.44rem] w-56 h-80" target="_blank" href={inputValue || "cantfindvideo"}>
                  <div className="relative group">
                      <Image
                        alt="Video Thumbnail"
                        src={thumbnailUrl || placeholderImageUrl}
                        width={640}
                        height={480}
                        className="w-56 h-80 transition group-hover:ring-offset-4 group-hover:ring-4 ring-[--border] ring-offset-[--bg] border border-[--border] rounded-lg"
                      />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                      <FiExternalLink className="h-10 w-10 group-hover:text-white transition group-hover:opacity-100 opacity-0" />
                    </div>
                  </div>
                </Link>
                { videoTitle ?
                 <h1 className="pt-2 md:text-2xl font-semibold text-lg overflow-hidden whitespace-nowrap">
                 {videoTitle.length > 14
                   ? `${videoTitle.slice(0, 14)}...`
                  : videoTitle}
                  </h1>
                : null}
                <div className="flex gap-4 justify-center items-center">
                { videoViews ?
                <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoViews)}</p>
                  <AiFillEye/>
                </div>
                : null}
                { videoLikes ?
                <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoLikes)}</p>
                  <FaHeart/>
                  </div>
                : null}

                { videoComments ?
                  <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoComments)}</p>
                  <FaCommentAlt/>
                  </div>
                : null}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full p-2">
                { HDQuality ? 
                  <Download definition={'HD'} downloadUrl={HDQuality} quality={'Best Quality'}></Download>
                : null}


                { betterQuality ? 
                  <Download definition={'SD+'} downloadUrl={betterQuality} quality={'Better Quality'}></Download>
                : null}

                { defaultQuality ? 
                  <Download definition={'SD'} downloadUrl={defaultQuality} quality={'SD Quality'}></Download>
                : null}

                { videoMusic ? 
                <Download definition={'MP3'} downloadUrl={videoMusic} quality={'Audio Only'}></Download>  
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
          <SocialLink link="/converters/ytmp4" icon={AiFillYoutube} iconSize={64}/>
          <SocialLink link="/converters/rumble">
            <Image width={36} height={36} src={RumbleIcon} alt="Rumble Icon"/>
          </SocialLink>
          <SocialLink iconSize={36} icon={BsMusicNote} link="/converters/ytmp3">
          </SocialLink>
        </div>
      </section>
    </main>
  );
}