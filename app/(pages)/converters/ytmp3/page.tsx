"use client"

import { useRef, useState } from "react";
import Button from "@/components/UI Elements/Button";
import Input from "@/components/Converter/Input";
import clsx from "clsx";
import axios, { AxiosRequestConfig } from "axios";
import SocialLink from "@/components/Converter/SocialLink";
import {SiTiktok } from 'react-icons/si'
import Image from "next/image";
import {AiFillYoutube} from "react-icons/ai"
import { BsTrash } from "react-icons/bs";
import { BiLoader } from "react-icons/bi";
import { YoutubeParser } from "@/utils/converter/YtParser";
import { message } from "antd";

export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [urlResult, setUrlResult] = useState(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const RumbleIcon = '/RumbleIcon.svg'

  const isYouTubeUrlValid = (url: string): boolean => {
    // Use a regular expression to check if the URL is a valid YouTube video URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputUrlRef.current !== null) {
      const inputUrl = inputUrlRef.current.value;
      
      if (!isYouTubeUrlValid(inputUrl)) {
        // Display an error message to the user or handle invalid URL case
        message.error("This is not a valid link")
        return;
      }

      const youtubeId = YoutubeParser(inputUrl)
      setLoading(true);

      const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '',
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        },
        params: {
          id: youtubeId
        }
      }
      axios(options)
       .then(res => {
        setVideoTitle(res.data.title);
        setUrlResult(res.data.link)
      })
       .catch(err => console.log(err))
       .finally(() => {
        setLoading(false);
      })

       inputUrlRef.current.value = ""
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <main className="flex flex-col pt-64 items-center w-full h-full text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold text-red-600">
        Youtube MP3 <span className="text-white">Converter</span>
      </h1>
      <section className="sm:w-[50rem] gap-4 flex flex-col">
        <p className="text-xl">
          Transform YouTube videos into MP3 in just a few clicks
        </p>

        <form onSubmit={handleSubmit} className="gap-3 flex">
          <Input
            ref={inputUrlRef}
            type="text"
            placeholder="Enter the link of the desired audio"
            value={inputValue}
            onChange={handleInputChange}
          />
          {urlResult ?
             <Button 
             className="group font-semibold text-stone-300 hover:text-white transition !w-36"
            onClick={() => {
              setUrlResult(null)
              setInputValue("")
              setVideoTitle("")
            }}>
              <p className="group-hover:opacity-0 transition">Remove</p>
             <BsTrash className="group-hover:-translate-x-8 transition group-hover:scale-125"/>
            </Button>
          :
          <Button
          className={clsx("!w-36", {
            "cursor-not-allowed hover:bg-transparent text-[--border] hover:ring-offset-0 hover:ring-0": inputValue === "" || isLoading,
          })}
          type="submit"
          disabled={inputValue === "" || isLoading}
        >
          {isLoading ? <BiLoader className="animate-spin"/> : inputValue === "" ? "Empty" : "Search"}
        </Button>
        }
        </form>

        {    
        urlResult ?
        <a target='_blank' rel="norefrrer" href={urlResult}>
          <Button className="bg-red-600 hover:bg-red-500 !ring-red-500/60">
            Download MP3
          </Button>
        </a> : null 
        }
        {videoTitle ?
        <p>{videoTitle}</p>
        :null}
      <hr className="border-[--border]"/>
        <div className="flex justify-center items-center gap-4">
          <SocialLink iconSize={36} link="/converters/tiktok" icon={SiTiktok}/>
          <SocialLink link="/converters/rumble">
            <Image  width={36} height={36} src={RumbleIcon} alt="Rumble Icon"/>
          </SocialLink>
          <SocialLink link="/converters/ytmp4" iconSize={36} icon={AiFillYoutube}>
          </SocialLink>
        </div>

      </section>
    </main>
  );
}
